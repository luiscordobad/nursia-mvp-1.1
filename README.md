# Nursia – MVP 1.1

Plataforma para conectar pacientes/familiares con enfermeros verificados. Stack: **Next.js (App Router) + TypeScript + Tailwind + Supabase**.

## Setup
1. `pnpm i` (o `npm i`)
2. Crear proyecto en Supabase y rellenar `.env.local` (ver `.env.example`)
3. Ejecutar `supabase/migrations/001_init.sql` en SQL Editor
4. (Opcional) `supabase/seed.sql`
5. `pnpm dev` y abre http://localhost:3000

## Roles
- Admin → `/admin/dashboard`
- Enfermero → `/nurse/dashboard`
- Paciente → `/patient/dashboard`

## Flujo principal
- Landing `/`
- Iniciar sesión `/sign-in` (magic link)
- Paciente solicita: `/patient/request`
- Admin asigna: `/admin/dashboard`
- Enfermero opera: `/nurse/dashboard`
- Paciente califica al finalizar

## Deploy
- Conecta GitHub → Vercel
- Añade env vars en Vercel

## Licencia
MIT
