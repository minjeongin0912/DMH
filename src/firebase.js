import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAufv_NY5GgtrS8EnWxCrGMM61zWY12DLw',
  authDomain: 'duck-bc1a2.firebaseapp.com',
  projectId: 'duck-bc1a2',
  storageBucket: 'duck-bc1a2.firebasestorage.app',
  messagingSenderId: '883738102132',
  appId: '1:883738102132:web:1f2666574f80ce92ecc421',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
