import './(public)/styles/globals.css'

export const metadata = {
  title: 'Nursia',
  description: 'Plataforma de conexión entre pacientes y enfermeros verificados',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
