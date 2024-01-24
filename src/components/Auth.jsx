import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.photoURL);

  async function signIn() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err){
      console.error(err);
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err){
      console.error(err);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (err){
      console.error(err);
    }
  }

  return (
    <>
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email..."/>
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password..."/>
        <button onClick={signIn}>Sign in</button>

        <button onClick={signInWithGoogle}>Sign in with google</button>

        <button onClick={logout}>Logout</button>
    </>
  )
}
