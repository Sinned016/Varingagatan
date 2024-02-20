import { onAuthStateChanged, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { getDocs } from "firebase/firestore";
import useAuthState from "./useAuthState";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state
  const navigate = useNavigate();

  async function logout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="header-container">
      <h2 className="header-title">
        <Link to="/">Väringasagan</Link>
      </h2>

      <i onClick={() => setMenuOpen(!menuOpen)} className="bx bx-menu"></i>

      {menuOpen && (
        <nav className="header-nav">
          <ul className="header-ul">
            <li>
              <Link to="/info">Books</Link>
            </li>
            <div className="line-space"></div>
            <li>
              <Link to="/contact">Audiobooks</Link>
            </li>
            <div className="line-space"></div>
            <li>
              <Link to="/contact">Shop</Link>
            </li>
            <div className="line-space"></div>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <div className="line-space"></div>
            <li>
              <Link to="/contact">About</Link>
            </li>
            <div className="line-space"></div>
            {isAdmin && (
              <>
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
                <div className="line-space"></div>
              </>
            )}
            {signedInUser ? (
              <li onClick={logout}>Logout</li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
