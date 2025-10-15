'use client'
export default function RatingStars({ value=0 }: { value?: number }) {
  return (
    <div className="flex gap-1" aria-label={`Calificación ${value}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(value) ? '★' : '☆'}</span>
      ))}
    </div>
  )
}
