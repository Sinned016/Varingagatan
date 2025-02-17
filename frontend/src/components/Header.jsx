import { onAuthStateChanged, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import useAuthState from "./useAuthState";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import ToggleMode from "./ToggleMode";
import HeaderDesktop from "./HeaderDesktop";
import HeaderPhone from "./HeaderPhone";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  console.log(isAdmin);

  async function logout() {
    try {
      setMenuOpen(false);
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }

  function handleSearch() {
    setMenuOpen(false);
    navigate(`books/search?title=${search}`);

    setSearch("");
  }

  return (
    <div className=" p-6 z-50 bg-card backdrop-blur-lg shadow-md  dark:border-neutral-700">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h2 className="text-2xl ">
          <Link className="" to="/">
            Väringasagan
          </Link>
        </h2>

        <HeaderDesktop
          search={search}
          setSearch={setSearch}
          logout={logout}
          handleSearch={handleSearch}
          signedInUser={signedInUser}
          isAdmin={isAdmin}
        />

        <div className="flex flex-row items-center gap-4 block xl:hidden">
          <ToggleMode />

          <HeaderPhone
            search={search}
            setSearch={setSearch}
            logout={logout}
            handleSearch={handleSearch}
            signedInUser={signedInUser}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
