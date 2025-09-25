import { useEffect, useState } from 'react'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function BillingPage(){
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('SK')
  const [billingEmail, setBillingEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    if(!user) return
    (async()=>{
      const docRef = doc(db,'users', user.uid)
      const snap = await getDoc(docRef)
      if(snap.exists()){
        const d = snap.data()
        setFullName(d.billingFullName || '')
        setStreet(d.billingStreet || '')
        setCity(d.billingCity || '')
        setPostalCode(d.billingPostalCode || '')
        setCountry(d.billingCountry || (d.country || 'SK'))
        setBillingEmail(d.billingEmail || d.email || '')
      }
    })()
  },[user])

  const save = async (e)=>{
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try{
      const combinedAddress = [street, city, postalCode, country].filter(Boolean).join(', ')
      await setDoc(doc(db,'users', user.uid), {
        billingFullName: fullName,
        billingStreet: street,
        billingCity: city,
        billingPostalCode: postalCode,
        billingCountry: country,
        billingEmail,
        // maintain legacy combined string used elsewhere
        billingAddress: combinedAddress,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      setMsg('Saved')
    } finally { setBusy(false) }
  }

  return (
    <form onSubmit={save} className="card bg-base-200 p-6 max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Billing profile</h2>
      <a className="link text-sm" href="/">← Back</a>
      <input className="input input-bordered" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
      <input className="input input-bordered" placeholder="Street and number" value={street} onChange={e=>setStreet(e.target.value)} required />
      <div className="grid grid-cols-2 gap-2">
        <input className="input input-bordered" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} required />
        <input className="input input-bordered" placeholder="Postal code" value={postalCode} onChange={e=>setPostalCode(e.target.value)} required />
      </div>
      <input className="input input-bordered" placeholder="Country (e.g., SK)" value={country} onChange={e=>setCountry(e.target.value.toUpperCase())} required />
      {/* Removed billing email per request */}
      <button className={`btn btn-primary ${busy?'loading':''}`} disabled={busy}>Save</button>
      {msg && <div className="text-success text-sm">{msg}</div>}
    </form>
  )
}
