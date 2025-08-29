import type { ReactNode } from 'react'
import { useId } from 'react'

type Props = {
  label?: string
  error?: string
  help?: string
  children: ReactNode
}

export default function Field({ label, error, help, children }: Props) {
  const id = useId()
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      {typeof children === 'object' && children && 'props' in (children as any)
        ? ( // injeta id no primeiro filho com props
          { ...(children as any), props: { ...(children as any).props, id } }
        )
        : children}
      {help && <div className="help">{help}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  )
}
