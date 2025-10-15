'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import StatusBadge from '@/app/(public)/components/StatusBadge'
export default function AdminDashboard(){
  const [sols,setSols]=useState<any[]>([]); const [nurses,setNurses]=useState<any[]>([]); const [reviews,setReviews]=useState<any[]>([])
  useEffect(()=>{ supabaseBrowser.from('solicitudes').select('id, tipo_servicio, ubicacion, estado, paciente:users(nombre), enfermero_asignado_id, enfermero:users!solicitudes_enfermero_asignado_id_fkey(nombre,id)').then(({data})=>setSols(data||[]))
    supabaseBrowser.from('enfermeros').select('id_usuario, especialidad, cedula, disponibilidad, documentos_url, users:users(nombre, estado)').then(({data})=>setNurses(data||[]))
    supabaseBrowser.from('reseñas').select('id, estrellas, comentario, fecha, enfermero:users(nombre)').order('fecha',{ascending:false}).limit(10).then(({data})=>setReviews(data||[])) },[])
  async function approve(id_usuario:string){ await supabaseBrowser.from('users').update({ estado:'active' }).eq('id', id_usuario); alert('Enfermero activado') }
  async function assign(solicitud_id:string){ const enfermero=prompt('ID del enfermero a asignar'); if(!enfermero) return; await supabaseBrowser.from('solicitudes').update({ enfermero_asignado_id: enfermero }).eq('id', solicitud_id); setSols(prev=>prev.map(s=>s.id===solicitud_id?{...s,enfermero_asignado_id:enfermero}:s)) }
  return(<div className="container py-10 grid gap-8">
    <section><h2 className="h2 mb-3">Solicitudes</h2><div className="grid gap-3">{sols.map(s=>(<div key={s.id} className="card"><div className="flex justify-between"><div><div className="font-semibold">{s.tipo_servicio} · {s.ubicacion}</div><div className="text-sm text-gray-600">Paciente: {s.paciente?.nombre || '—'}</div></div><StatusBadge status={s.estado}/></div><div className="mt-2 flex gap-2"><button className="btn" onClick={()=>assign(s.id)}>Asignar/Reasignar</button></div></div>))}</div></section>
    <section><h2 className="h2 mb-3">Enfermeros por aprobar</h2><div className="grid gap-3">{nurses.filter(n=>n.users?.estado!=='active').map(n=>(<div key={n.id_usuario} className="card"><div className="font-semibold">{n.users?.nombre || '—'} · {n.especialidad}</div><div className="text-sm">Cédula: {n.cedula}</div><div className="text-sm">Disponibilidad: {n.disponibilidad}</div><button className="btn mt-2" onClick={()=>approve(n.id_usuario)}>Aprobar</button></div>))}</div></section>
    <section><h2 className="h2 mb-3">Reseñas recientes</h2><div className="grid gap-3">{reviews.map(r=>(<div key={r.id} className="card"><div className="font-semibold">{r.enfermero?.nombre || '—'}</div><div>⭐ {r.estrellas}</div><div className="text-sm text-gray-600">{r.comentario}</div></div>))}</div></section>
  </div>)}
