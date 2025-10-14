import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import ModeratorPanel from './pages/ModeratorPanel.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import RoleManager from './pages/RoleManager.jsx'
import LockedPage from './pages/LockedPage.jsx'
import Layout from './components/Layout.jsx'
import BillingPage from './pages/BillingPage.jsx'
import Podmienky from './pages/Podmienky.jsx'

function PrivateRoute({ children }) {
  const { user, loading, profile } = useAuth()
  if (loading) return <div className="p-8">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (profile?.isLocked) return <Navigate to="/locked" replace />
  return children
}

function RoleRoute({ role, children }) {
  const { profile } = useAuth()
  if (!profile) return null
  if (profile.isLocked) return <Navigate to="/locked" replace />
  if (role === 'moderator' && (profile.role === 'moderator' || profile.role === 'admin')) return children
  if (role === 'admin' && profile.role === 'admin') return children
  if (role === 'user') return children
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/podmienky" element={<Podmienky />} />
        <Route
          path="/locked"
          element={
            <PrivateRoute>
              <LockedPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="billing" element={<BillingPage />} />
          <Route
            path="moderator"
            element={
              <RoleRoute role="moderator">
                <ModeratorPanel />
              </RoleRoute>
            }
          />
          <Route
            path="admin"
            element={
              <RoleRoute role="admin">
                <AdminPanel />
              </RoleRoute>
            }
          />
          <Route
            path="admin/roles"
            element={
              <RoleRoute role="admin">
                <RoleManager />
              </RoleRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
