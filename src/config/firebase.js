import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC4YEVjyO0zlJktcvzrQA0tJDbqeLoeypg",
  authDomain: "varingasagan-733fa.firebaseapp.com",
  projectId: "varingasagan-733fa",
  storageBucket: "varingasagan-733fa.appspot.com",
  messagingSenderId: "642807871816",
  appId: "1:642807871816:web:d79fe11a8a8405176bdb7d",
  measurementId: "G-V0PGGQ41FB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

