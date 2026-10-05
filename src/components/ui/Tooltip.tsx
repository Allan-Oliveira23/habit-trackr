import { useRef, useState, type ReactNode } from 'react'

interface Props {
  content: ReactNode
  children: ReactNode
}

/** Tooltip complementar (hover/foco). Usa posição fixa para não ser cortada por containers com scroll. */
export default function Tooltip({ content, children }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const show = () => {
    const r = ref.current?.getBoundingClientRect()
    if (r) setPos({ x: r.left + r.width / 2, y: r.top })
  }
  const hide = () => setPos(null)

  return (
    <span ref={ref} className="inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {pos && (
        <span
          role="tooltip"
          style={{ left: pos.x, top: pos.y - 6 }}
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-line bg-card px-2 py-1 text-xs shadow-lg"
        >
          {content}
        </span>
      )}
    </span>
  )
}
