import type { ReactNode } from 'react'

interface Props {
  title?: string
  children: ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: Props) {
  return (
    <section className={`rounded-xl border border-line bg-card p-4 ${className}`}>
      {title && <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h2>}
      {children}
    </section>
  )
}
