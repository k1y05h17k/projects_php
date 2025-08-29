import { Outlet } from 'react-router-dom'
import TopBar from '../components/TopBar'

export default function AppLayout() {
  return (
    <div>
      <TopBar />
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  )
}
