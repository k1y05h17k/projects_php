import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Field from '../components/ui/Field'
import TextInput from '../components/ui/TextInput'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import PasswordInput from '../components/ui/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { register, login } from '../api/auth'
import { createUser } from '../api/users'

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'app_token'

export default function UserUpsert() {
  const { user, isAdmin, reload } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_level: 3 as 1 | 2 | 3,
    registration_code: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isPublicSignup = !user
  const title = isPublicSignup ? 'Cadastro' : 'Novo usuário'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setSuccess(null)

    if (!form.password || form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (form.password !== form.password_confirmation) {
      setError('As senhas não conferem.')
      return
    }

    setLoading(true)
    try {
      if (isPublicSignup) {
        // público → /auth/register (backend decide se aceita role via código)
        const res = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role_level: form.role_level,
          // @ts-ignore — o register aceita campo extra; backend ignora se não usar
          registration_code: form.registration_code || undefined,
        })

        // se o backend já retornou token (como implementamos), salve e vá pra /users
        if (res?.access_token) {
          localStorage.setItem(TOKEN_KEY, res.access_token)
          await reload()
          navigate('/users', { replace: true })
        } else {
          // fallback: se não vier token, tenta login com as mesmas credenciais
          const loginRes = await login({ email: form.email, password: form.password })
          localStorage.setItem(TOKEN_KEY, loginRes.access_token)
          await reload()
          navigate('/users', { replace: true })
        }
      } else {
        // admin → cria via /users respeitando role
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role_level: form.role_level,
        })
        setSuccess('Usuário criado com sucesso.')
        const from = (location.state as any)?.from ?? '/users'
        setTimeout(() => navigate(from, { replace: true }), 600)
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Erro ao salvar'
      const errors = e?.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join('\n') : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding: 16 }}>
      <div className="card" style={{ width: 520 }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>


        <form onSubmit={onSubmit} className="grid grid-2">
          <Field label="Nome">
            <TextInput
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>

          <Field label="E-mail">
            <TextInput
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>

          <Field label="Senha">
            <PasswordInput
              value={form.password}
              onChange={e => setForm({ ...form, password: (e.target as HTMLInputElement).value })}
              placeholder="mínimo 6 caracteres"
              required
            />
          </Field>

          <Field label="Repetir senha">
            <PasswordInput
              value={form.password_confirmation}
              onChange={e =>
                setForm({ ...form, password_confirmation: (e.target as HTMLInputElement).value })
              }
              required
            />
          </Field>

          <Field label="Perfil (nível)">
            <Select
              value={form.role_level}
              onChange={e => setForm({ ...form, role_level: Number(e.target.value) as 1|2|3 })}
              options={[
                { label: 'Admin (1)', value: 1 },
                { label: 'Moderador (2)', value: 2 },
                { label: 'Leitor (3)', value: 3 },
              ]}
            />
          </Field>


          <div className="row" style={{ justifyContent: 'space-between', gridColumn:'1 / -1' }}>
            <Link to={isPublicSignup ? '/login' : '/users'} className="ghost">
              {isPublicSignup ? 'Voltar ao login' : 'Cancelar'}
            </Link>
            <Button type="submit" loading={loading}>
              {isPublicSignup ? 'Cadastrar e entrar' : 'Salvar'}
            </Button>
          </div>

          {error && <p className="error" style={{ gridColumn:'1 / -1', margin: 0 }}>{error}</p>}
          {success && <p style={{ color:'var(--success,#10b981)', gridColumn:'1 / -1', margin: 0 }}>{success}</p>}
        </form>
      </div>
    </div>
  )
}
