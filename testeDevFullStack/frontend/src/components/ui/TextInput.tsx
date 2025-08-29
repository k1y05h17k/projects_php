import { forwardRef, memo } from 'react'
import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}

const TextInput = memo(forwardRef<HTMLInputElement, Props>(function TextInput(
  { error, ...rest }, ref
) {
  return <input ref={ref} {...rest} aria-invalid={!!error} />
}))

export default TextInput
