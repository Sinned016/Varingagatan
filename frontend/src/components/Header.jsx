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
import { BookHeadphones, BookText, Home, Info, LogOut } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state
  const [search, setSearch] = useState("");
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

  function handleSearch() {
    setMenuOpen(false);
    navigate(`books/search?title=${search}`);

    setSearch("");
  }

  function showNavBar() {
    navRef.current.classList.toggle("responsive_nav");
  }

  return (
    <div className=" p-6 bg-[#333] text-[#f0f0f0] border-b border-black  z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h2 className="text-2xl ">
          <Link to="/">Väringasagan</Link>
        </h2>

        <div className="search-container sm:block hidden">
          <FaSearch className="search-icon" />
          <input
            className="search-input text-base leading-none"
            type="text"
            placeholder="Sök bland titlar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        <nav
          ref={navRef}
          className="sm:flex justify-center items-center gap-6 hidden "
        >
          <Link
            className={pathname === "/" && " underline underline-offset-4"}
            to="/"
            onClick={closeHeader}
          >
            <span className="nav-icon-margin">Hem</span>
          </Link>

          <Link
            className={
              pathname.includes("/books") && "underline underline-offset-4"
            }
            to="/books"
            onClick={closeHeader}
          >
            <span className="nav-icon-margin">Böcker</span>
          </Link>

          <Link
            className={
              pathname.includes("/audioBooks") && "underline underline-offset-4"
            }
            to="/audioBooks"
            onClick={closeHeader}
          >
            <span className="nav-icon-margin">Ljudböcker</span>
          </Link>

          <Link
            className={
              pathname.includes("/about") && "underline underline-offset-4"
            }
            to="/about"
            onClick={closeHeader}
          >
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
              <span className="nav-icon-margin">Admin</span>
            </Link>
          )}

          <div class="h-6 border-l border-gray-400"></div>

          {signedInUser ? (
            <button
              className="flex justify-center items-center "
              onClick={logout}
            >
              <LogOut
                className="rotate-180 hover:text-red-500 duration-300"
                size={22}
              />
            </button>
          ) : (
            <Link
              to="/login"
              className="flex justify-center items-center "
              onClick={closeHeader}
            >
              <LogOut className="hover:text-green-500 duration-300" size={22} />
            </Link>
          )}

          {/* {signedInUser ? (
          <button className="nav-logout" onClick={logout}>
            <CiLogout size={16} />{" "}
            <span className="nav-icon-margin">Logga ut</span>
          </button>
        ) : (
          <Link to="/login" className="nav-login" onClick={closeHeader}>
            <CiLogin size={16} />{" "}
            <span className="nav-icon-margin">Logga in</span>
          </Link>
        )} */}

          <button className="nav-btn nav-close-btn" onClick={showNavBar}>
            <FaTimes />
          </button>
        </nav>

        <button className="nav-btn nav-menu-btn" onClick={showNavBar}>
          <FaBars />
        </button>
      </div>
    </div>
  );
}
