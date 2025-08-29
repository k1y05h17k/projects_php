import { useState } from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string
}

export default function PasswordInput({ inputClassName, ...props }: Props) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={inputClassName}
        style={{ width: '100%', paddingRight: 40, ...(props.style || {}) }}
      />
      <button
        type="button"
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        onClick={() => setShow(s => !s)}
        className="icon-button"
        style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          background: 'transparent', border: 0, cursor: 'pointer', padding: 6, lineHeight: 0,
        }}
      >
        {/* “olhinho” em SVG minimalista */}
        {show ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 5.52A10.94 10.94 0 0 1 12 5c5 0 9 4.5 10 7- .3.73-.82 1.7-1.6 2.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.53 6.53C4.23 7.7 2.6 9.54 2 12c.47 1.72 4 7 10 7 1.61 0 3.08-.34 4.38-.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )}
      </button>
    </div>
  )
}
