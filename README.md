# Bug Report Dashboard

A themed bug report console for users, moderators, and admin. Static React app for Cloudflare hosting.

## Features
- Firebase Auth (email/password)
- Role-based panels (user, moderator, admin)
- Withdrawals (bank, PayPal)
- Bug report management
- Dark, clean theme

## Setup
1. Add your logo to `src/assets/logo.png`.
2. Firebase config is in `src/firebase.js`.
3. Install and run locally, then build and deploy.

### Local dev
```sh
npm install
npm run dev
```

### Build
```sh
npm run build
```

Deploy the `dist/` folder to Cloudflare static hosting.

## Data model (Firestore)
- users/{uid}
  - role: "user" | "moderator" | "admin"
  - isLocked: boolean
  - balanceCents: number
  - email: string
  - createdAt, updatedAt
  - billing: stored under subcollection `users/{uid}/billing/*` (future)
- bug_reports/{id}
  - keep all existing fields you send from app (app, appVersion map, createdAt, details, email, origin, platform, token, uid, etc.)
  - added: status: "pending"|"approved"|"partial"|"denied"|"elevated"
  - moderatorUid, adminUid, decisionReason, updatedAt, history[]
- withdrawals/{id}
  - userUid, method: "bank_sk"|"paypal", payload, amountCents, status, createdAt, reviewerUid
- transactions/{id}
  - type: "reward"|"withdrawal"|"adjustment", amountCents, userUid, relatedBugId, status, createdAt, createdBy

Note: rewards (+5€) on approve are recorded, and balance is incremented. Partial gives no credit. Deny requires reason. Elevate hides from moderators and shows on admin panel; admin resolves to approved/partial/denied.

## Security
- Email/password auth with registration.
- Role gating in client; add Firestore Rules/Functions for stronger guarantees in production.


## Firebase Config
```
const firebaseConfig = {
  apiKey: "AIzaSyBxvhTuQhfKeIgybiRQoca7btPdSO5oFag",
  authDomain: "matur-3f6cc.firebaseapp.com",
  projectId: "matur-3f6cc",
  storageBucket: "matur-3f6cc.firebasestorage.app",
  messagingSenderId: "624068510753",
  appId: "1:624068510753:web:9fa6e6fea0562cd7c08f60",
  measurementId: "G-S4JYWP03FQ"
};
```
