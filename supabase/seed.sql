-- Usuario admin
insert into public.users (id, nombre, role, contacto, estado)
values ('00000000-0000-0000-0000-000000000001','Admin','admin','admin@nursia.local','active')
on conflict do nothing;

-- Paciente demo
insert into public.users (id, nombre, role, contacto, estado)
values ('00000000-0000-0000-0000-000000000002','Paciente Demo','paciente','paciente@nursia.local','active')
on conflict do nothing;

-- Enfermero demo
insert into public.users (id, nombre, role, contacto, estado)
values ('00000000-0000-0000-0000-000000000003','Enfermero Demo','enfermero','enfermero@nursia.local','active')
on conflict do nothing;

insert into public.enfermeros (id_usuario, especialidad, cedula, disponibilidad, documentos_url)
values ('00000000-0000-0000-0000-000000000003', 'Geriatría', 'CED-12345', 'L-V 9-18h', 'https://example.com/doc.pdf')
on conflict do nothing;

-- Solicitud demo
insert into public.solicitudes (paciente_id, tipo_servicio, ubicacion, fecha_inicio, fecha_fin, requerimientos, enfermero_asignado_id, estado)
values ('00000000-0000-0000-0000-000000000002', 'Curación', 'Querétaro', now()+interval '1 day', now()+interval '1 day 2 hours', 'Experiencia en curaciones', '00000000-0000-0000-0000-000000000003', 'pendiente');
