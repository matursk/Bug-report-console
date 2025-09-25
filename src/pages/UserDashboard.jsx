import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, where, addDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

function cents(n){return (n??0)/100}

export default function UserDashboard(){
  const { user, profile } = useAuth()
  const [reports, setReports] = useState([])
  const [tab, setTab] = useState('withdraw')
  const [method, setMethod] = useState('bank_sk')
  const [iban, setIban] = useState('')
  const [fullName, setFullName] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(()=>{
    if(!user) return
    const q = query(
      collection(db,'bug_reports'),
      where('uid','==', user.uid),
      orderBy('createdAt','desc')
    )
    const stop = onSnapshot(q, (snap)=>{
      setReports(snap.docs.map(d=>({id:d.id, ...d.data()})))
    })
    return ()=>stop()
  },[user])

  useEffect(()=>{
    if(profile?.billingFullName){
      setFullName(profile.billingFullName)
    }
  },[profile])

  const requestWithdraw = async (e)=>{
    e.preventDefault()
    setBusy(true)
    setError('')
    const amt = Math.round(parseFloat(amount)*100)
    if(!amt || amt<=0) { setError('Enter valid amount'); setBusy(false); return }
    if((profile?.balanceCents??0) < amt){ setError('Insufficient balance'); setBusy(false); return }
    if(!profile?.billingFullName || !profile?.billingAddress){ setError('Complete billing profile first'); setBusy(false); return }
    // require billing profile exists
    // kept simple: just ensure fullName present here
    try{
      const payload = method==='bank_sk' ? { iban, fullName } : { paypalEmail, fullName }
      const batch = writeBatch(db)
      const wRef = doc(collection(db,'withdrawals'))
      const txRef = doc(collection(db,'transactions'))
      batch.set(wRef, {
        userUid: user.uid,
        method,
        payload,
        amountCents: amt,
        status: 'requested',
        createdAt: serverTimestamp(),
        relatedTransactionId: txRef.id,
      })
      batch.set(txRef, {
        type: 'withdrawal',
        amountCents: -Math.abs(amt),
        userUid: user.uid,
        relatedWithdrawalId: wRef.id,
        status: 'pending',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      })
      const userRef = doc(db,'users', user.uid)
      batch.update(userRef, { balanceCents: (profile?.balanceCents ?? 0) - Math.abs(amt) })
      await batch.commit()
      setAmount('')
    }catch(e){
      setError(e.message)
    }finally{
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Balance</div>
          <div className="stat-value">€ {cents(profile?.balanceCents).toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Role</div>
          <div className="stat-value text-primary capitalize">{profile?.role}</div>
        </div>
      </div>
  <div className="text-sm opacity-80">Complete your <a className="link" href="/billing">billing profile</a> to withdraw.</div>

      <div className="tabs tabs-boxed">
        <a className={`tab ${tab==='withdraw'?'tab-active':''}`} onClick={()=>setTab('withdraw')}>Withdraw</a>
        <a className={`tab ${tab==='reports'?'tab-active':''}`} onClick={()=>setTab('reports')}>My Reports</a>
      </div>

      {tab==='withdraw' && (
        <form onSubmit={requestWithdraw} className="card bg-base-200 p-6 max-w-xl space-y-3">
          <div className="form-control">
            <label className="label"><span className="label-text">Method</span></label>
            <select className="select select-bordered" value={method} onChange={e=>setMethod(e.target.value)}>
              <option value="bank_sk">Bank (SK)</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          {method==='bank_sk' ? (
            <>
              <input className="input input-bordered" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
              <input className="input input-bordered" placeholder="IBAN" value={iban} onChange={e=>setIban(e.target.value)} required />
            </>
          ) : (
            <>
              <input className="input input-bordered" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
              <input className="input input-bordered" placeholder="PayPal email" type="email" value={paypalEmail} onChange={e=>setPaypalEmail(e.target.value)} required />
              <div className="text-xs opacity-70">PayPal standard fees apply.</div>
            </>
          )}
          <input className="input input-bordered" placeholder="Amount (EUR)" type="number" min="1" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} required />
          {error && <div className="alert alert-error text-sm">{error}</div>}
          <button className={`btn btn-primary ${busy?'loading':''}`} disabled={busy}>Request withdrawal</button>
        </form>
      )}

      {tab==='reports' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Created</th>
                <th>Title</th>
                <th>Status</th>
                <th>Platform</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r=> (
                <tr key={r.id}>
                  <td>{r.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                  <td className="max-w-[320px] truncate">{r.details}</td>
                  <td className="capitalize">{r.status || 'pending'}</td>
                  <td>{r.platform}</td>
                  <td>{r.appVersion?.name || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
