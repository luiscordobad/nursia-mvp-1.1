import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export function supabaseFromCookie() {
  const cookieStore = cookies()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )
  return supabase
}
