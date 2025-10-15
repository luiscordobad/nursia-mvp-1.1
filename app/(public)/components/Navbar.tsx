'use client'
import Link from 'next/link'
export default function Navbar(){return(<nav className="border-b bg-white"><div className="container flex items-center justify-between h-14"><Link href="/" className="font-bold">Nursia</Link><div className="flex items-center gap-3"><Link className="btn" href="/patient/request">Solicitar enfermero</Link><Link className="btn" href="/nurse/dashboard">Panel enfermero</Link><Link className="btn" href="/admin/dashboard">Admin</Link><Link className="btn" href="/sign-in">Ingresar</Link></div></div></nav>)}
