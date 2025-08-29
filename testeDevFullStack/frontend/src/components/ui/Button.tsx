import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, variant = 'primary', loading, disabled, ...rest }: Props) {
  const cls = ['btn', variant !== 'primary' ? variant : ''].filter(Boolean).join(' ')
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading ? 'Carregando…' : children}
    </button>
  )
}
