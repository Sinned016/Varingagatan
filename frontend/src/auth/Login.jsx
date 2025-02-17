import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res) {
        console.log("You logged in", res);
        navigate("/");
      }
    } catch (e) {
      console.error(e);
      if (e.code === "auth/invalid-credential") {
        setFormError("Try again or create an account");
      } else {
        setFormError("An error occurred. Please try again later.");
      }
    }
  }

  async function signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      if (res) {
        //Create an object for the user in the users collection here when logging in with google.
        console.log("You logged in through google", res);
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex justify-center items-center ">
      <form
        className=" border p-6 border-neutral-500 rounded-xl mt-10 w-full bg-card shadow-lg"
        onSubmit={handleLogin}
      >
        <h1 className="font-bold text-2xl mb-4 text-center">Välkommen!</h1>

        <div>
          <p className="text-red-500">{formError}</p>
        </div>

        <div className="mb-4">
          <p className="font-bold text-sm mb-2 text-secondary-foreground">
            Email
          </p>
          <input
            className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500 "
            required
            type="email"
            placeholder="placeholder@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <p className="font-bold text-sm mb-2 text-secondary-foreground">
            Lösenord
          </p>
          <input
            className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
            required
            type="password"
            placeholder="********"
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-primary w-full text-white mb-4 hover:bg-red-500 duration-200"
        >
          Logga in
        </button>

        <div className="">
          <Button
            variant={"outline"}
            className="flex gap-4 w-full bg-card border border-neutral-500 rounded-full"
            onClick={signInWithGoogle}
          >
            <p>Logga in med Google</p>
            <FcGoogle className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-sm text-center pt-6">
          <Link
            className="hover:underline underline-offset-2 text-primary font-bold"
            to={"/register"}
          >
            Skapa nytt konto
          </Link>
        </p>
      </form>
    </div>
  );
}
