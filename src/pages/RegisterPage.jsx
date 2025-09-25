import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <div className="p-8">Loading…</div>
  if (user) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-sm bg-base-200 shadow p-6 space-y-3">
        <h1 className="text-xl font-semibold">Register</h1>
        {error && <div className="alert alert-error text-sm">{error}</div>}
        <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className={`btn btn-primary w-full ${busy?'loading':''}`} disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
        <div className="text-sm opacity-80">Have an account? <Link className="link" to="/login">Sign in</Link></div>
      </form>
    </div>
  )
}
