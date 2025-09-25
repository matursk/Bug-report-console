import { useAuth } from '../context/AuthContext.jsx'

export default function LockedPage() {
  const { signOut } = useAuth()
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Account temporarily locked</h1>
        <p className="opacity-80">Please contact support. You can sign out and try later.</p>
        <button className="btn" onClick={signOut}>Sign out</button>
      </div>
    </div>
  )
}
