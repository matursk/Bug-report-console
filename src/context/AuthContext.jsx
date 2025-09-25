import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const ADMIN_UID = 'gTCyoZc6JFclEkueBg7wl2M8uzJ2'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setProfile(null)
        setLoading(false)
        return
      }
      const userRef = doc(db, 'users', u.uid)
      const stop = onSnapshot(userRef, async (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          // auto-elevate fixed admin UID
          if (u.uid === ADMIN_UID && data.role !== 'admin') {
            await setDoc(userRef, { role: 'admin', updatedAt: serverTimestamp() }, { merge: true })
            setProfile({ id: u.uid, ...data, role: 'admin' })
          } else {
            setProfile({ id: snap.id, ...data })
          }
        } else {
          // create default profile on first login
          const defaultDoc = {
            role: u.uid === ADMIN_UID ? 'admin' : 'user',
            isLocked: false,
            balanceCents: 0,
            email: u.email || null,
            createdAt: serverTimestamp(),
          }
          await setDoc(userRef, defaultDoc, { merge: true })
          setProfile({ id: u.uid, ...defaultDoc })
        }
        setLoading(false)
      })
      return () => stop()
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => ({ user, profile, loading, signOut: () => signOut(auth) }), [user, profile, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
