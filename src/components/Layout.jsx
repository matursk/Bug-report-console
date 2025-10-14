import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logoUrl from '../assets/logo.png'

export default function Layout() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-200/60 backdrop-blur border-b border-base-300">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl flex items-center gap-2">
            <img src={logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
            Bug Console
          </Link>
        </div>
        <div className="flex-none">
          <div className="mr-4 text-sm opacity-80">{user?.email}</div>
          <button className="btn btn-sm" onClick={signOut}>Sign out</button>
        </div>
      </div>
      <div className="bg-base-100 border-b border-base-300">
        <div className="tabs tabs-boxed p-2 max-w-6xl mx-auto">
          <NavLink to="/" end className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>User</NavLink>
          {(profile?.role === 'moderator' || profile?.role === 'admin') && (
            <NavLink to="/moderator" end className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>Moderator</NavLink>
          )}
          {profile?.role === 'admin' && (
            <>
              <NavLink to="/admin" end className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>Admin</NavLink>
              <NavLink to="/admin/roles" end className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}`}>Role Manager</NavLink>
            </>
          )}
        </div>
      </div>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <Outlet />
        </div>
      </main>
      <footer className="p-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Matur · <Link to="/podmienky" className="link">Podmienky</Link>
      </footer>
    </div>
  )
}
