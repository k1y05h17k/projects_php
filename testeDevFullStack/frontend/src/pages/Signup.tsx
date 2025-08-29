// src/pages/Signup.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Field from '../components/ui/Field'
import TextInput from '../components/ui/TextInput'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { register, login } from '../api/auth'
import { createUser } from '../api/users'

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'app_token'

export default function Signup() {
  const { user, isAdmin, reload } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_level: 3 as 1 | 2 | 3,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)

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
      if (user && isAdmin) {
        // Admin cria via endpoint protegido (respeita role escolhido)
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role_level: form.role_level,
        })
        setSuccess('Usuário criado com sucesso.')
        // Admin já está logado; segue para a lista
        setTimeout(() => navigate('/users', { replace: true }), 600)
      } else {
        // Público: registra (back forçará Leitor mesmo que troque aqui)
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role_level: form.role_level, // será ignorado no back se não for admin
        })
        // Auto-login
        const res = await login({ email: form.email, password: form.password })
        localStorage.setItem(TOKEN_KEY, res.access_token)
        await reload()
        navigate('/users', { replace: true })
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Erro ao cadastrar'
      const errors = e?.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join('\n') : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding: 16 }}>
      <div className="card" style={{ width: 520 }}>
        <h2 style={{ marginTop: 0 }}>Cadastro</h2>
        <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
          {isAdmin ? 'Admin pode escolher o perfil.' : 'Cadastros públicos entram como Leitor.'}
        </p>

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
            <div className="row" style={{ gap: 8 }}>
              <TextInput
                style={{ flex: 1 }}
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="mínimo 6 caracteres"
                required
              />
              <Button type="button" variant="ghost" onClick={() => setShowPwd(s => !s)}>
                {showPwd ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </Field>

          <Field label="Repetir senha">
            <div className="row" style={{ gap: 8 }}>
              <TextInput
                style={{ flex: 1 }}
                type={showPwd2 ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                required
              />
              <Button type="button" variant="ghost" onClick={() => setShowPwd2(s => !s)}>
                {showPwd2 ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </Field>

          <Field
            label="Perfil (nível)"
            help={isAdmin ? undefined : 'Somente administradores podem alterar. Padrão: Leitor (3).'}
          >
            <Select
              value={form.role_level}
              onChange={e => setForm({ ...form, role_level: Number(e.target.value) as 1|2|3 })}
              options={[
                { label: 'Admin (1)', value: 1 },
                { label: 'Moderador (2)', value: 2 },
                { label: 'Leitor (3)', value: 3 },
              ]}
              disabled={!isAdmin}
            />
          </Field>

          <div className="row" style={{ justifyContent:'flex-end', gridColumn:'1 / -1' }}>
            <Link to="/login" className="ghost">Voltar ao login</Link>
            <Button type="submit" loading={loading}>Cadastrar</Button>
          </div>

          {error && <p className="error" style={{ gridColumn:'1 / -1', margin: 0 }}>{error}</p>}
          {success && <p style={{ color:'var(--success,#10b981)', gridColumn:'1 / -1', margin: 0 }}>{success}</p>}
        </form>
      </div>
    </div>
  )
}
