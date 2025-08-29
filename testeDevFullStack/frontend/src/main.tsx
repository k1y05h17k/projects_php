import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/global.css'

import { AuthProvider } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'

import Login from './pages/Login'
import UserUpsert from './pages/UserUpsert'
import Users from './pages/Users'

const router = createBrowserRouter([
  // rotas públicas simples
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <UserUpsert /> },

  // rotas com layout (TopBar aparece aqui)
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <div className="container"><div className="card">Bem-vindo</div></div> },
      {
        path: '/users',
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/users/new',
        element: (
          <ProtectedRoute>
            <UserUpsert />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
