import { onAuthStateChanged, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import useAuthState from "./useAuthState";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaInfoCircle,
  FaPlayCircle,
  FaSearch,
} from "react-icons/fa";
import { CiLogout, CiLogin } from "react-icons/ci";
import { RiAdminLine } from "react-icons/ri";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state
  const navigate = useNavigate();
  const location = useLocation(); // Access location object
  const pathname = location.pathname; // Get the current pathname
  const navRef = useRef();

  console.log(isAdmin);
  console.log(pathname);

  async function logout() {
    try {
      setMenuOpen(false);
      await signOut(auth);
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

  function showNavBar() {
    navRef.current.classList.toggle("responsive_nav");
  }

  return (
    <div className="header-container">
      <h2 className="header-title">
        <Link to="/">Väringasagan</Link>
      </h2>

      <nav ref={navRef} className="header-nav">
        <Link
          className={pathname === "/" && "underline underline-offset-4"}
          to="/"
          onClick={closeHeader}
        >
          <FaHome /> <span className="nav-icon-margin">Hem</span>
        </Link>

        <Link
          className={
            pathname.includes("/books") && "underline underline-offset-4"
          }
          to="/books"
          onClick={closeHeader}
        >
          <FaBook /> <span className="nav-icon-margin">Böcker</span>
        </Link>

        <Link
          className={
            pathname.includes("/audioBooks") && "underline underline-offset-4"
          }
          to="/audioBooks"
          onClick={closeHeader}
        >
          <FaPlayCircle /> <span className="nav-icon-margin">Ljudböcker</span>
        </Link>

        <Link
          className={
            pathname.includes("/about") && "underline underline-offset-4"
          }
          to="/about"
          onClick={closeHeader}
        >
          <FaInfoCircle />
          <span className="nav-icon-margin">Om</span>
        </Link>

        {isAdmin && (
          <Link
            className={
              pathname.includes("/admin") && "underline underline-offset-4"
            }
            to="/admin"
            onClick={closeHeader}
          >
            <RiAdminLine /> <span className="nav-icon-margin">Admin</span>
          </Link>
        )}

        {signedInUser ? (
          <button className="nav-logout" onClick={logout}>
            <CiLogout /> <span className="nav-icon-margin">Logga ut</span>
          </button>
        ) : (
          <Link to="/login" className="nav-login" onClick={closeHeader}>
            <CiLogin /> <span className="nav-icon-margin">Logga in</span>
          </Link>
        )}

        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            className="search-input text-base leading-none"
            type="text"
            placeholder="Sök bland titlar..."
            onKeyDown={handleSearch}
          />
        </div>

        <button className="nav-btn nav-close-btn" onClick={showNavBar}>
          <FaTimes />
        </button>
      </nav>

      <button className="nav-btn nav-menu-btn" onClick={showNavBar}>
        <FaBars />
      </button>

      {signedInUser ? (
        <button className="nav-logout-desktop" onClick={logout}>
          <CiLogout /> <span className="nav-icon-margin">Logout</span>
        </button>
      ) : (
        <Link to="/login" className="nav-login-desktop" onClick={closeHeader}>
          <CiLogin /> <span className="nav-icon-margin">Login</span>
        </Link>
      )}
    </div>
  );
}
