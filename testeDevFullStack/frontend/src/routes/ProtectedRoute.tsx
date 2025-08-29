import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth()
  if (loading) return <div className="container"><div className="card">Carregando…</div></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
