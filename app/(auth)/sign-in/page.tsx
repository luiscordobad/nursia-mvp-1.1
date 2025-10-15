'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function send() {
    const { error } = await supabaseBrowser.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
    if (!error) setSent(true)
  }

  return (
    <div className="container py-10">
      <h1 className="h1 mb-4">Ingresar</h1>
      {sent ? <p>Revisa tu correo para continuar.</p> : (
        <div className="card max-w-md">
          <input className="border rounded w-full p-2 mb-3" placeholder="tu@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="btn" onClick={send}>Enviar enlace</button>
        </div>
      )}
    </div>
  )
}
