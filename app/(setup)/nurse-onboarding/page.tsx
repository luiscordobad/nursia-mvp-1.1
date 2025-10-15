'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export default function NurseOnboarding() {
  const [form, setForm] = useState({ nombre:'', cedula:'', especialidad:'', disponibilidad:'', contacto:'', documentos_url:'' })
  const [userId, setUserId] = useState<string|undefined>()

  useEffect(()=>{ supabaseBrowser.auth.getUser().then(({data})=>setUserId(data.user?.id)) },[])

  async function submit() {
    if (!userId) return alert('Inicia sesión primero')
    // upsert user role
    await supabaseBrowser.from('users').upsert({ id: userId, nombre: form.nombre, role: 'enfermero', contacto: form.contacto, estado: 'inactive' })
    // create nurse profile (await admin validation)
    await supabaseBrowser.from('enfermeros').upsert({ id_usuario: userId, especialidad: form.especialidad, cedula: form.cedula, disponibilidad: form.disponibilidad, documentos_url: form.documentos_url })
    alert('Registro enviado. Te notificaremos cuando se active tu perfil.')
  }

  return (
    <div className="container py-10">
      <h1 className="h1 mb-4">Unirme como enfermero</h1>
      <div className="grid gap-3 max-w-xl">
        {['nombre','cedula','especialidad','disponibilidad','contacto','documentos_url'].map((k)=> (
          <input key={k} className="border rounded p-2" placeholder={k} value={(form as any)[k]} onChange={e=>setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="btn" onClick={submit}>Enviar</button>
      </div>
    </div>
  )
}
