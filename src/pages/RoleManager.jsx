import { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase.js'

const ADMIN_UID = 'gTCyoZc6JFclEkueBg7wl2M8uzJ2'

export default function RoleManager(){
  const [uid, setUid] = useState('')
  const [mods, setMods] = useState([])
  const [busy, setBusy] = useState(false)

  const load = async ()=>{
    const q = query(collection(db,'users'), where('role','==','moderator'))
    const snap = await getDocs(q)
    setMods(snap.docs.map(d=>({id:d.id, ...d.data()})))
  }

  useEffect(()=>{ load() },[])

  const promote = async ()=>{
    if(!uid) return
    setBusy(true)
    try{
      const ref = doc(db,'users', uid)
      await setDoc(ref, { role: 'moderator', updatedAt: serverTimestamp() }, { merge: true })
      await load()
      setUid('')
    } finally { setBusy(false) }
  }

  const demote = async (uid)=>{
    setBusy(true)
    try{
      await updateDoc(doc(db,'users', uid), { role: 'user', updatedAt: serverTimestamp() })
      await load()
    } finally { setBusy(false) }
  }

  const lockToggle = async (m, isLocked)=>{
    setBusy(true)
    try{
      await updateDoc(doc(db,'users', m.id), { isLocked, updatedAt: serverTimestamp() })
      await load()
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 p-4 max-w-lg">
        <h3 className="font-semibold mb-2">Promote to moderator</h3>
        <div className="flex gap-2">
          <input className="input input-bordered flex-1" placeholder="User UID" value={uid} onChange={e=>setUid(e.target.value)} />
          <button className={`btn btn-primary ${busy?'loading':''}`} onClick={promote} disabled={busy}>Promote</button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Moderators</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>UID</th><th>Email</th><th>Locked</th><th>Actions</th></tr></thead>
            <tbody>
              {mods.map(m=> (
                <tr key={m.id}>
                  <td className="text-xs">{m.id}</td>
                  <td>{m.email}</td>
                  <td>{m.isLocked? 'Yes':'No'}</td>
                  <td className="space-x-2">
                    <button className="btn btn-xs" onClick={()=>lockToggle(m, !m.isLocked)}>{m.isLocked? 'Unlock':'Lock'}</button>
                    <button className="btn btn-xs btn-error" onClick={()=>demote(m.id)}>Remove moderator</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
