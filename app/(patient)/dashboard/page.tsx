'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import RatingStars from '@/app/(public)/components/RatingStars'

export default function PatientDashboard() {
  const [rows, setRows] = useState<any[]>([])
  const [userId, setUserId] = useState<string|undefined>()

  useEffect(()=>{
    supabaseBrowser.auth.getUser().then(({data})=>setUserId(data.user?.id))
  },[])

  useEffect(()=>{
    if (!userId) return
    supabaseBrowser.from('solicitudes').select('id, tipo_servicio, estado, enfermero:users(id, nombre)').eq('paciente_id', userId).then(({ data })=> setRows(data||[]))
  },[userId])

  async function rate(id: string, enfermero_id: string) {
    const estrellas = Number(prompt('Califica (1-5)'))
    const comentario = String(prompt('Reseña (opcional)')||'')
    if (!estrellas) return
    await supabaseBrowser.from('reseñas').insert({ enfermero_id, paciente_id: userId, estrellas, comentario })
    alert('¡Gracias por calificar!')
  }

  return (
    <div className="container py-10">
      <h1 className="h1 mb-4">Mis solicitudes</h1>
      <div className="grid gap-3">
        {rows.map(r=> (
          <div className="card" key={r.id}>
            <div className="h2">{r.tipo_servicio}</div>
            <div className="text-sm text-gray-600">Estado: {r.estado} · Enfermero: {r.enfermero?.nombre || 'Pendiente'}</div>
            {r.estado==='finalizado' && r.enfermero?.id && (
              <div className="mt-3">
                <button className="btn" onClick={()=>rate(r.id, r.enfermero.id)}>Calificar servicio</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
