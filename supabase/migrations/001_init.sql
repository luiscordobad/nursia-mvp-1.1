-- Habilitar UUID por defecto
create extension if not exists "uuid-ossp";

-- Tabla de usuarios (perfil público)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  nombre text,
  role text check (role in ('admin','enfermero','paciente')) default 'paciente',
  contacto text,
  estado text check (estado in ('active','inactive')) default 'inactive',
  inserted_at timestamptz default now()
);

-- Vincular auth.users → public.users vía trigger (auto-provision)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, nombre, role, estado)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), 'paciente', 'inactive')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enfermeros
create table if not exists public.enfermeros (
  id_usuario uuid primary key references public.users(id) on delete cascade,
  especialidad text,
  cedula text,
  disponibilidad text,
  documentos_url text,
  rating_promedio numeric default 0
);

-- Solicitudes
create table if not exists public.solicitudes (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.users(id) on delete set null,
  tipo_servicio text,
  ubicacion text,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  requerimientos text,
  enfermero_asignado_id uuid references public.users(id) on delete set null,
  estado text check (estado in ('pendiente','en_curso','finalizado')) default 'pendiente',
  inserted_at timestamptz default now()
);

-- Reseñas
create table if not exists public.reseñas (
  id uuid primary key default uuid_generate_v4(),
  enfermero_id uuid references public.users(id) on delete cascade,
  paciente_id uuid references public.users(id) on delete set null,
  estrellas int check (estrellas between 1 and 5),
  comentario text,
  fecha timestamptz default now()
);

-- Incidencias
create table if not exists public.incidencias (
  id uuid primary key default uuid_generate_v4(),
  enfermero_id uuid references public.users(id) on delete set null,
  solicitud_id uuid references public.solicitudes(id) on delete cascade,
  descripcion text,
  fecha timestamptz default now()
);

-- Vistas/relaciones útiles
create or replace view public.v_enfermero_rating as
select e.id_usuario as enfermero_id,
       coalesce(avg(r.estrellas),0) as rating
from public.enfermeros e
left join public.reseñas r on r.enfermero_id = e.id_usuario
group by e.id_usuario;

-- RLS
alter table public.users enable row level security;
alter table public.enfermeros enable row level security;
alter table public.solicitudes enable row level security;
alter table public.reseñas enable row level security;
alter table public.incidencias enable row level security;

-- Políticas
-- users: cada quien ve su perfil; admin ve todo
create policy users_select_self on public.users
for select using (
  auth.role() = 'authenticated' and (id = auth.uid() or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'))
);
create policy users_update_self on public.users
for update using (id = auth.uid());

-- enfermeros: el dueño ve su fila; admin ve todo; público puede leer info (simplificado para MVP)
create policy enfermeros_select_public on public.enfermeros
for select using (true);
create policy enfermeros_update_owner on public.enfermeros
for update using (id_usuario = auth.uid());
create policy enfermeros_insert_owner on public.enfermeros
for insert with check (id_usuario = auth.uid());

-- solicitudes: paciente ve las suyas; enfermero asignado ve las suyas; admin todo; insert solo paciente
create policy solicitudes_select_scope on public.solicitudes
for select using (
  auth.uid() = paciente_id or auth.uid() = enfermero_asignado_id or exists (select 1 from public.users u where u.id = auth.uid() and u.role='admin')
);
create policy solicitudes_insert_paciente on public.solicitudes
for insert with check (paciente_id = auth.uid());
create policy solicitudes_update_assigned on public.solicitudes
for update using (
  auth.uid() = enfermero_asignado_id or exists (select 1 from public.users u where u.id = auth.uid() and u.role='admin')
);

-- reseñas: visibles; insertar solo paciente autenticado
create policy reseñas_select_all on public.reseñas for select using (true);
create policy reseñas_insert_patient on public.reseñas for insert with check (paciente_id = auth.uid());

-- incidencias: enfermero dueño o admin
create policy incidencias_select_scope on public.incidencias for select using (
  enfermero_id = auth.uid() or exists (select 1 from public.users u where u.id = auth.uid() and u.role='admin')
);
create policy incidencias_insert_owner on public.incidencias for insert with check (enfermero_id = auth.uid());

-- Trigger para actualizar promedio en enfermeros
create or replace function public.update_rating_promedio()
returns trigger as $$
begin
  update public.enfermeros e
     set rating_promedio = (
       select coalesce(avg(estrellas),0) from public.reseñas where enfermero_id = e.id_usuario
     )
   where e.id_usuario = new.enfermero_id;
  return new;
end; $$ language plpgsql;

drop trigger if exists on_review_insert on public.reseñas;
create trigger on_review_insert
  after insert on public.reseñas
  for each row execute procedure public.update_rating_promedio();
