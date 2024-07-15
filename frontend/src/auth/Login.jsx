import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

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
      console.log(e);
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
    <div className="register-container">
      <div className="register-wrapper">
        <form onSubmit={handleLogin}>
          <h1 className="title">Sign In</h1>

          <div className="error-box">
            <p>{formError}</p>
          </div>

          <div className="input-box">
            <input required type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              required
              type="password"
              placeholder="Password"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="remember-forgot">
            {/* Dont know how to get this to work rn, might continue in the future  */}
            {/* <div>
                <input type="checkbox" onChange={() => setRememberMe(!rememberMe)}></input>
                <label>Remember me</label>
              </div> */}
            <div></div>

            <a href="">Forgot password?</a>
          </div>

          <button type="submit" className="register-btn">
            Login
          </button>

          <div className="register-link">
            <p>
              Dont have an account? <Link to={"/register"}>Sign Up</Link>
            </p>
          </div>

          <div className="google-box">
            <button onClick={signInWithGoogle}>Sign In with google</button>
          </div>
        </form>
      </div>
    </div>
  );
}
