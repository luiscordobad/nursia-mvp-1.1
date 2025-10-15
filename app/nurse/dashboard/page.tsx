'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import StatusBadge from '@/app/(public)/components/StatusBadge'
export default function NurseDashboard(){
  const [rows,setRows]=useState<any[]>([]); const [userId,setUserId]=useState<string|undefined>()
  useEffect(()=>{ supabaseBrowser.auth.getUser().then(({data})=>{ setUserId(data.user?.id) }) },[])
  useEffect(()=>{ if(!userId) return; supabaseBrowser.from('solicitudes').select('id, tipo_servicio, ubicacion, fecha_inicio, fecha_fin, estado, paciente:users(nombre)').eq('enfermero_asignado_id', userId).then(({data})=>setRows(data||[])) },[userId])
  async function changeStatus(id:string, status:'en_curso'|'finalizado'){ await supabaseBrowser.from('solicitudes').update({ estado: status }).eq('id', id); setRows(prev=>prev.map(r=>r.id===id?{...r,estado:status}:r)) }
  return(<div className="container py-10"><h1 className="h1 mb-4">Mis servicios</h1><div className="grid gap-3">{rows.map(r=>(<div className="card" key={r.id}><div className="flex items-center justify-between"><div><div className="h2">{r.tipo_servicio}</div><div className="text-sm text-gray-600">Paciente: {r.paciente?.nombre || '—'} · {r.ubicacion}</div></div><StatusBadge status={r.estado}/></div><div className="mt-3 flex gap-2">{r.estado==='pendiente' && <button className="btn" onClick={()=>changeStatus(r.id,'en_curso')}>Iniciar</button>}{r.estado!=='finalizado' && <button className="btn" onClick={()=>changeStatus(r.id,'finalizado')}>Finalizar</button>}</div></div>))}</div></div>)}
