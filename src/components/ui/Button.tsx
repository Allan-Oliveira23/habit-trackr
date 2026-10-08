import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

const styles: Record<Variant, string> = {
  primary: 'bg-ok text-bg hover:bg-ok/85 active:bg-ok/70',
  ghost: 'border border-line text-slate-200 hover:bg-white/5 active:bg-white/10',
  danger: 'bg-bad text-bg hover:bg-bad/85 active:bg-bad/70',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({ variant = 'ghost', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    />
  )
}
