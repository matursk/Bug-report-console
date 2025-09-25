import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyBxvhTuQhfKeIgybiRQoca7btPdSO5oFag',
  authDomain: 'matur-3f6cc.firebaseapp.com',
  projectId: 'matur-3f6cc',
  storageBucket: 'matur-3f6cc.firebasestorage.app',
  messagingSenderId: '624068510753',
  appId: '1:624068510753:web:9fa6e6fea0562cd7c08f60',
  measurementId: 'G-S4JYWP03FQ',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
