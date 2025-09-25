import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch, Timestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

const REWARD_CENTS = 500

const statusOrder = { pending: 0, elevated: 1, partial: 2, approved: 3, denied: 4 }

export default function ModeratorPanel(){
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [reasonText, setReasonText] = useState('')
  const [denyTarget, setDenyTarget] = useState(null)

  useEffect(()=>{
    const q = query(collection(db,'bug_reports'), orderBy('createdAt','desc'))
    const stop = onSnapshot(q, (snap)=>{
      const list = snap.docs.map(d=>({id:d.id, ...d.data()}))
        .filter(r => r.status !== 'elevated') // hidden when elevated
        .sort((a,b)=> (statusOrder[a.status||'pending'] - statusOrder[b.status||'pending']))
      setReports(list)
    })
    return ()=>stop()
  },[])

  const doStatus = async (r, status, opts={})=>{
    setBusyId(r.id)
    try{
      const reportRef = doc(db,'bug_reports', r.id)
      const batch = writeBatch(db)
      const historyEntry = {
        at: Timestamp.now(),
        by: user.uid,
        action: status,
        reason: opts.reason || null,
      }
      const update = {
        status,
        moderatorUid: user.uid,
        decisionReason: status==='denied' ? (opts.reason || 'No reason provided') : (opts.reason || null),
        updatedAt: serverTimestamp(),
        history: [...(r.history||[]), historyEntry],
      }
      if(status==='denied' && !opts.reason){
        throw new Error('Reason is required to deny')
      }
      batch.update(reportRef, update)

      if(status==='approved'){
        // credit user via transaction doc and user balance update
        const txRef = doc(collection(db,'transactions'))
        batch.set(txRef, {
          type: 'reward', amountCents: REWARD_CENTS, userUid: r.uid, relatedBugId: r.id,
          status: 'posted', createdAt: serverTimestamp(), createdBy: user.uid,
        })
        const userRef = doc(db,'users', r.uid)
        batch.update(userRef, { balanceCents: increment(REWARD_CENTS) })
      }

      await batch.commit()
    } catch(e){
      console.error(e)
      alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bug reports</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Created</th>
              <th>User</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r=> (
              <tr key={r.id}>
                <td>{r.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                <td className="text-xs">{r.email || r.uid}</td>
                <td className="max-w-[360px] whitespace-pre-wrap">{r.details}</td>
                <td className="capitalize">{r.status || 'pending'}</td>
                <td className="space-x-2">
                  <button className={`btn btn-xs btn-success ${busyId===r.id?'loading':''}`} onClick={()=>doStatus(r,'approved')} disabled={busyId===r.id || (r.status && r.status!=='pending')}>Approve +5€</button>
                  <button className={`btn btn-xs ${busyId===r.id?'loading':''}`} onClick={()=>doStatus(r,'partial')} disabled={busyId===r.id || (r.status && r.status!=='pending')}>Partial</button>
                  <button className={`btn btn-xs btn-error`} onClick={()=>{ setDenyTarget(r); setReasonText('') }} disabled={busyId===r.id || (r.status && r.status!=='pending')}>Deny</button>
                  <button className={`btn btn-xs btn-warning ${busyId===r.id?'loading':''}`} onClick={()=>doStatus(r,'elevated')} disabled={busyId===r.id || (r.status && r.status!=='pending')}>Elevate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {denyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>{ setDenyTarget(null); setReasonText('') }} />
          <div className="relative bg-base-200 p-4 rounded shadow max-w-md w-full m-4">
            <h4 className="font-semibold mb-2">Provide reason to deny</h4>
            <textarea className="textarea textarea-bordered w-full" placeholder="Reason" value={reasonText} onChange={e=>setReasonText(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <button className="btn btn-ghost btn-sm" onClick={()=>{ setDenyTarget(null); setReasonText('') }}>Cancel</button>
              <button className="btn btn-error btn-sm" onClick={()=>{ doStatus(denyTarget,'denied',{reason:reasonText}); setDenyTarget(null); setReasonText('') }}>Confirm deny</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
