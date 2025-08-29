import { NavLink, Link } from 'react-router-dom'
import Button from './ui/Button'
import { useAuth } from '../context/AuthContext'


export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header
      className="row"
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#ffffff',            // visível na paleta clara
        borderBottom: '1px solid #e5e7eb' // linha sutil
      }}
    >
      <nav className="row" style={{ gap: 12 }}>
        <NavLink to="/users" className={({isActive}) => isActive ? 'active' : ''}>Início</NavLink>
        {user?.role_level === 1 && (
          <NavLink to="/users/new" className={({isActive}) => isActive ? 'active' : ''}>
            Novo usuário
          </NavLink>
        )}
      </nav>

      <div className="row" style={{ gap: 8 }}>
        {user ? (
          <>
            <span style={{ color: '#475569' /* cinza legível */ }}>
              {user.name}
            </span>
            <Button className="secondary" onClick={logout}>Sair</Button>
          </>
        ) : (
          <>
            <Link to="/login" className="ghost">Login</Link>
            <Link to="/signup" className="ghost">Cadastre-se</Link>
          </>
        )}
      </div>
    </header>
  )
}
