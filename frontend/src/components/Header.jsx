import { onAuthStateChanged, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import useAuthState from "./useAuthState";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state
  const navigate = useNavigate();

  console.log(isAdmin);

  async function logout() {
    try {
      setMenuOpen(false);
      await signOut(auth);
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  }

  function closeHeader() {
    setMenuOpen(false);
  }

  function handleSearch(e) {
    const title = e.target.value;
    if (e.key === "Enter") {
      setMenuOpen(false);
      navigate(`books/search?title=${title}`);
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
            <div className="search-container">
              <input className="search-input" type="text" placeholder="Search title..." onKeyDown={handleSearch} />
            </div>

            <Link to="/" className="navLink" onClick={closeHeader}>
              Home
            </Link>

            <Link to="/books" className="navLink" onClick={closeHeader}>
              Books
            </Link>

            <Link to="/audioBooks" className="navLink" onClick={closeHeader}>
              Audiobooks
            </Link>

            <Link to="/about" className="navLink" onClick={closeHeader}>
              About
            </Link>

            {isAdmin && (
              <Link to="/admin" className="navLink" onClick={closeHeader}>
                Admin
              </Link>
            )}

            {signedInUser ? (
              <Link to="/login" className="navLink" onClick={logout}>
                Logout
              </Link>
            ) : (
              <Link to="/login" className="navLink" onClick={closeHeader}>
                Login
              </Link>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
