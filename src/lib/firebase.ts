import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBUUf6OVq1-fum87PavTpNfsXUsXSa5y8",
  authDomain: "wini-de28d.firebaseapp.com",
  projectId: "wini-de28d",
  storageBucket: "wini-de28d.firebasestorage.app",
  messagingSenderId: "201095133260",
  appId: "1:201095133260:web:02ce115bde1d621f2edce9",
  measurementId: "G-9038JHRKV4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
