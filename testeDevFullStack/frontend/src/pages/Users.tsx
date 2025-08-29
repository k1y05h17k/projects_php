import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { roleBadgeClass, roleDisplay } from '../utils/roles'
import { listUsers, deleteUser } from '../api/users'

type UserRow = {
  id: number
  name: string
  email: string
  role_level: 1 | 2 | 3
}

export default function Users() {
  const { user: me, isAdmin, isModerator } = useAuth()
  const [rows, setRows] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers() // já vem array normalizado
      const norm: UserRow[] = data.map(u => ({
        id: Number(u.id),
        name: String(u.name ?? ''),
        email: String(u.email ?? ''),
        role_level: Number(u.role_level ?? 3) as 1 | 2 | 3,
      }))
      setRows(norm)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Internal server error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function canEditOrDelete(target: UserRow): { edit: boolean; del: boolean } {
    const edit = !!(isAdmin || isModerator)
    const del  = !!(isAdmin && me && me.id !== target.id) // admin e não pode deletar a si mesmo
    return { edit, del }
  }

  async function onDelete(u: UserRow) {
    if (!window.confirm(`Excluir o usuário "${u.name}"? Essa ação não pode ser desfeita.`)) return
    try {
      await deleteUser(u.id)
      setRows(prev => prev.filter(r => r.id !== u.id))
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Falha ao excluir usuário.')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Usuários</h2>

        {error && <p className="error">{error}</p>}

        <table className="table" style={{ width: '100%', marginTop: 8 }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Nível</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 16, color: 'var(--muted)' }}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}

            {rows.map((u) => {
              const perm = canEditOrDelete(u)
              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={roleBadgeClass(u.role_level)}>
                      {roleDisplay(u.role_level)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', minWidth: 160 }}>
                    {perm.edit || perm.del ? (
                      <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
                        {perm.edit && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              // TODO: navegar para tela de edição ou abrir modal
                              alert('Edição de usuário em breve 🙂')
                            }}
                          >
                            Editar
                          </Button>
                        )}
                        {perm.del && (
                          <Button variant="danger" onClick={() => onDelete(u)}>
                            Excluir
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span style={{ opacity: 0.3 }}>—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {loading && <p style={{ color: 'var(--muted)', marginTop: 8 }}>Carregando…</p>}
      </div>
    </div>
  )
}
