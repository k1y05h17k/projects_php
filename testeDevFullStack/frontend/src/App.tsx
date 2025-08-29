import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row">
            <strong>Frontend – Prova</strong>
            <nav>
              <NavLink to="/users" className={({isActive}) => isActive ? 'active' : ''}>Users</NavLink>
            </nav>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="badge">{user?.name} · role {user?.role_level}</span>
            <button className="ghost" onClick={() => { logout(); navigate('/login') }}>Sair</button>
          </div>
        </div>
      </div>
      <div className="card">
        <p>Bem-vindo! Use o menu para navegar.</p>
        <p><Link to="/users">Ir para Users →</Link></p>
      </div>
    </div>
  )
}
