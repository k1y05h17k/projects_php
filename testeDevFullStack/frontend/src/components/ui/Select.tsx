import { forwardRef, memo } from 'react'
import type { SelectHTMLAttributes } from 'react'

type Option = { label: string; value: string | number }
type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[]
  error?: string
}

const Select = memo(forwardRef<HTMLSelectElement, Props>(function Select(
  { options, error, ...rest }, ref
) {
  return (
    <select ref={ref} {...rest} aria-invalid={!!error}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}))

export default Select
