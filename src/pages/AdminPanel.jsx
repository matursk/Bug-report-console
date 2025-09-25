import { useEffect, useState } from 'react'
import { addDoc, collection, doc, getDoc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

const REWARD_CENTS = 500

export default function AdminPanel(){
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [tab, setTab] = useState('reports')

  // withdrawals
  const [pendingWithdrawals, setPendingWithdrawals] = useState([])
  const [historyWithdrawals, setHistoryWithdrawals] = useState([])
  const [wBusyId, setWBusyId] = useState(null)
  const [denyTarget, setDenyTarget] = useState(null)
  const [denyReason, setDenyReason] = useState('')
  const [viewW, setViewW] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)

  useEffect(()=>{
    const q = query(collection(db,'bug_reports'), where('status','==','elevated'), orderBy('createdAt','desc'))
    const stop = onSnapshot(q, (snap)=>{
      setReports(snap.docs.map(d=>({id:d.id, ...d.data()})))
    })
    return ()=>stop()
  },[])

  useEffect(()=>{
    const q1 = query(collection(db,'withdrawals'), where('status','==','requested'))
    const stop1 = onSnapshot(q1, (snap)=>{
      const list = snap.docs.map(d=>({id:d.id, ...d.data()}))
        .sort((a,b)=> ((b.createdAt?.toDate?.()?.getTime?.()||0) - (a.createdAt?.toDate?.()?.getTime?.()||0)))
      setPendingWithdrawals(list)
    })
    const q2 = query(collection(db,'withdrawals'), where('status','==','paid'))
    const stop2 = onSnapshot(q2, (snap)=>{
      const list = snap.docs.map(d=>({id:d.id, ...d.data()}))
        .sort((a,b)=> ((b.processedAt?.toDate?.()?.getTime?.()||0) - (a.processedAt?.toDate?.()?.getTime?.()||0)))
      setHistoryWithdrawals(list)
    })
    return ()=>{ stop1(); stop2(); }
  },[])

  const resolve = async (r, status, opts={})=>{
    if(status==='elevated') return
    setBusyId(r.id)
    try{
      const batch = writeBatch(db)
      const ref = doc(db,'bug_reports', r.id)
      batch.update(ref, {
        status,
        adminUid: user.uid,
        updatedAt: serverTimestamp(),
        decisionReason: status==='denied' ? (opts.reason || 'No reason provided') : (opts.reason || null),
        history: [...(r.history||[]), { at: Timestamp.now(), by: user.uid, action: `admin_${status}`, reason: opts.reason || null }]
      })
      await batch.commit()
      if(status==='approved'){
        await updateDoc(doc(db,'users', r.uid), { balanceCents: increment(REWARD_CENTS) })
      }
    }catch(e){
      alert(e.message)
    }finally{
      setBusyId(null)
    }
  }

  const markWithdrawalPaid = async (w)=>{
    setWBusyId(w.id)
    try{
      const batch = writeBatch(db)
      const wRef = doc(db,'withdrawals', w.id)
      batch.update(wRef, {
        status: 'paid',
        processedAt: serverTimestamp(),
        processedBy: user.uid,
      })
      if(w.relatedTransactionId){
        const txRef = doc(db,'transactions', w.relatedTransactionId)
        batch.update(txRef, { status: 'posted', postedAt: serverTimestamp() })
      } else {
        const txRef = doc(collection(db,'transactions'))
        batch.set(txRef, {
          type: 'withdrawal',
          amountCents: -Math.abs(w.amountCents||0),
          userUid: w.userUid,
          relatedWithdrawalId: w.id,
          status: 'posted',
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        })
      }
      await batch.commit()
    } catch(e){
      alert(e.message)
    } finally {
      setWBusyId(null)
    }
  }

  const markWithdrawalUnpaid = async (w)=>{
    setWBusyId(w.id)
    try{
      const batch = writeBatch(db)
      const wRef = doc(db,'withdrawals', w.id)
      batch.update(wRef, {
        status: 'requested',
        processedAt: null,
        processedBy: null,
      })
      if(w.relatedTransactionId){
        const txRef = doc(db,'transactions', w.relatedTransactionId)
        batch.update(txRef, { status: 'pending', postedAt: null })
      }
      await batch.commit()
    } catch(e){
      alert(e.message)
    } finally {
      setWBusyId(null)
    }
  }

  const openWithdrawalDetails = async (w)=>{
    setViewW(w)
    setViewUser(null)
    setViewLoading(true)
    try{
      const snap = await getDoc(doc(db,'users', w.userUid))
      if(snap.exists()) setViewUser({ id: snap.id, ...snap.data() })
    } finally {
      setViewLoading(false)
    }
  }

  function euros(c){ return ((c??0)/100).toFixed(2) }

  return (
    <div className="space-y-4">
      <div className="tabs tabs-boxed">
        <a className={`tab ${tab==='reports'?'tab-active':''}`} onClick={()=>setTab('reports')}>Elevated reports</a>
        <a className={`tab ${tab==='withdrawals'?'tab-active':''}`} onClick={()=>setTab('withdrawals')}>Withdrawals</a>
      </div>

      {tab==='reports' && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Created</th>
                <th>User</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r=> (
                <tr key={r.id}>
                  <td>{r.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                  <td className="text-xs">{r.email || r.uid}</td>
                  <td className="max-w-[360px] whitespace-pre-wrap">{r.details}</td>
                  <td className="space-x-2">
                    <button className={`btn btn-xs btn-success ${busyId===r.id?'loading':''}`} onClick={()=>resolve(r,'approved')} disabled={busyId===r.id}>Approve +5€</button>
                    <button className={`btn btn-xs ${busyId===r.id?'loading':''}`} onClick={()=>resolve(r,'partial')} disabled={busyId===r.id}>Partial</button>
                    <button className={`btn btn-xs btn-error ${busyId===r.id?'loading':''}`} onClick={()=>{ setDenyTarget(r); setDenyReason('') }}>Deny</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='withdrawals' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Pending withdrawals</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Requested</th>
                    <th>User</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWithdrawals.map(w=> (
                    <tr key={w.id}>
                      <td>{w.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                      <td className="text-xs">{w.userUid}</td>
                      <td className="capitalize">{w.method}</td>
                      <td>€ {euros(w.amountCents)}</td>
                      <td className="text-xs whitespace-pre-wrap">{w.method==='bank_sk' ? (w.payload?.fullName + ' / ' + w.payload?.iban) : (w.payload?.fullName + ' / ' + w.payload?.paypalEmail)}</td>
                      <td className="space-x-2">
                        <button className="btn btn-xs" onClick={()=>openWithdrawalDetails(w)}>View</button>
                        <button className={`btn btn-xs btn-success ${wBusyId===w.id?'loading':''}`} onClick={()=>markWithdrawalPaid(w)} disabled={wBusyId===w.id}>Mark paid</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Withdrawal history</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Processed</th>
                    <th>User</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Processed by</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {historyWithdrawals.map(w=> (
                    <tr key={w.id}>
                      <td>{w.processedAt?.toDate?.().toLocaleString?.() || ''}</td>
                      <td className="text-xs">{w.userUid}</td>
                      <td className="capitalize">{w.method}</td>
                      <td>€ {euros(w.amountCents)}</td>
                      <td className="text-xs">{w.processedBy}</td>
                      <td className="space-x-2">
                        <button className="btn btn-xs" onClick={()=>openWithdrawalDetails(w)}>View</button>
                        <button className={`btn btn-xs btn-warning ${wBusyId===w.id?'loading':''}`} onClick={()=>markWithdrawalUnpaid(w)} disabled={wBusyId===w.id}>Mark unpaid</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {denyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>{ setDenyTarget(null); setDenyReason('') }} />
          <div className="relative bg-base-200 p-4 rounded shadow max-w-md w-full m-4">
            <h4 className="font-semibold mb-2">Provide reason to deny</h4>
            <textarea className="textarea textarea-bordered w-full" placeholder="Reason" value={denyReason} onChange={e=>setDenyReason(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <button className="btn btn-ghost btn-sm" onClick={()=>{ setDenyTarget(null); setDenyReason('') }}>Cancel</button>
              <button className="btn btn-error btn-sm" onClick={()=>{ resolve(denyTarget,'denied',{reason:denyReason}); setDenyTarget(null); setDenyReason('') }}>Confirm deny</button>
            </div>
          </div>
        </div>
      )}

      {viewW && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>{ setViewW(null); setViewUser(null) }} />
          <div className="relative bg-base-200 p-4 rounded shadow max-w-lg w-full m-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Withdrawal details</h4>
              <button className="btn btn-ghost btn-xs" onClick={()=>{ setViewW(null); setViewUser(null) }}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="opacity-70">User</span><div className="break-all">{viewW.userUid}</div></div>
              <div><span className="opacity-70">Amount</span><div>€ {euros(viewW.amountCents)}</div></div>
              <div><span className="opacity-70">Method</span><div className="capitalize">{viewW.method}</div></div>
              <div><span className="opacity-70">Status</span><div className="capitalize">{viewW.status}</div></div>
              <div className="col-span-2">
                <span className="opacity-70">Payout payload</span>
                <div className="break-words whitespace-pre-wrap">{viewW.method==='bank_sk' ? (viewW.payload?.fullName + ' / ' + viewW.payload?.iban) : (viewW.payload?.fullName + ' / ' + viewW.payload?.paypalEmail)}</div>
              </div>
            </div>
            <div className="divider my-2">Billing profile</div>
            {viewLoading && <div className="text-sm">Loading…</div>}
            {(!viewLoading && viewUser) && (
              <div className="text-sm space-y-1">
                <div><span className="opacity-70">Name</span>: {viewUser.billingFullName || ''}</div>
                <div><span className="opacity-70">Street</span>: {viewUser.billingStreet || ''}</div>
                <div><span className="opacity-70">City</span>: {viewUser.billingCity || ''}</div>
                <div><span className="opacity-70">Postal code</span>: {viewUser.billingPostalCode || ''}</div>
                <div><span className="opacity-70">Country</span>: {viewUser.billingCountry || ''}</div>
                {viewUser.billingEmail && <div><span className="opacity-70">Billing email</span>: {viewUser.billingEmail}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
