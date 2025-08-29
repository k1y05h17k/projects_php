import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { me } from '../api/auth'

type User = { id: number; name: string; email: string; role_level: 1|2|3 }
type AuthCtx = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isModerator: boolean
  reload: () => Promise<void>
  logout: () => void
}

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'app_token'
const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function reload() {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setUser(null); setLoading(false); return }

    try {
      setLoading(true)
      const data = await me()
      const raw = (data?.data ?? data) as any
      // normaliza tipagem e garante role_level numérico
      const normalized: User = {
        id: Number(raw.id),
        name: String(raw.name ?? ''),
        email: String(raw.email ?? ''),
        role_level: Number(raw.role_level ?? 3) as 1|2|3,
      }
      setUser(normalized)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
  }

  useEffect(() => { reload() }, [])

  const isAdmin = !!user && user.role_level === 1
  const isModerator = !!user && user.role_level === 2

  return (
    <Ctx.Provider value={{ user, loading, isAdmin, isModerator, reload, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
