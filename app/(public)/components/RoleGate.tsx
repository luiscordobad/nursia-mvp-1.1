'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

export default function RoleGate() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function run() {
      const { data: { user } } = await supabaseBrowser.auth.getUser()
      if (!user) return router.replace('/sign-in')
      const { data } = await supabaseBrowser
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      const role = data?.role
      if (role === 'admin') router.replace('/admin/dashboard')
      else if (role === 'enfermero') router.replace('/nurse/dashboard')
      else router.replace('/patient/dashboard')
      setLoading(false)
    }
    run()
  }, [router])

  if (loading) return <p className="p-6">Cargando…</p>
  return null
}
