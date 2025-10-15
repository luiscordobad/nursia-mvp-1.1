export default function StatusBadge({ status }: { status: 'pendiente'|'en_curso'|'finalizado' }) {
  const map: Record<string,string> = { pendiente: 'bg-yellow-100 text-yellow-800', en_curso: 'bg-blue-100 text-blue-800', finalizado: 'bg-green-100 text-green-800' }
  return <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>{status}</span>
}
