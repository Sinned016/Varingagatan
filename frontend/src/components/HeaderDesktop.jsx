import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { LogOut } from "lucide-react";
import ToggleMode from "./ToggleMode";
import { Link, useLocation } from "react-router-dom";

export default function HeaderDesktop({
  search,
  setSearch,
  logout,
  handleSearch,
  signedInUser,
  isAdmin,
}) {
  const location = useLocation(); // Access location object
  const pathname = location.pathname; // Get the current pathname

  return (
    <>
      <div className="xl:block hidden">
        <FaSearch className="absolute top-[50%] translate-y-[-50%] ml-3 " />
        <input
          className="border border-neutral-600 bg-card p-2 rounded-full pl-10 w-[400px] text-base leading-none"
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

      <nav className="xl:flex justify-center items-center gap-6 hidden">
        <Link
          className={
            pathname === "/" && "underline underline-offset-4 text-primary"
          }
          to="/"
        >
          <span className="hover:text-primary duration-200">Hem</span>
        </Link>

        <Link
          className={
            pathname.includes("/books") &&
            "underline underline-offset-4 text-primary"
          }
          to="/books"
        >
          <span className="hover:text-primary duration-200">Böcker</span>
        </Link>

        <Link
          className={
            pathname.includes("/audioBooks") &&
            "underline underline-offset-4 text-primary"
          }
          to="/audioBooks"
        >
          <span className="hover:text-primary duration-200">Ljudböcker</span>
        </Link>

        <Link
          className={
            pathname.includes("/about") &&
            "underline underline-offset-4 text-primary"
          }
          to="/about"
        >
          <span className="hover:text-primary duration-200">Om</span>
        </Link>

        {isAdmin && (
          <Link
            className={
              pathname.includes("/admin") &&
              "underline underline-offset-4 text-primary"
            }
            to="/admin"
          >
            <span className="hover:text-primary duration-200">Admin</span>
          </Link>
        )}

        <div class="h-6 border-l border-gray-400"></div>

        <ToggleMode />

        <div class="h-6 border-l border-gray-400"></div>

        {signedInUser ? (
          <button
            className="flex justify-center items-center "
            onClick={logout}
          >
            <LogOut
              className="rotate-180 hover:text-red-500 duration-200"
              size={22}
            />
          </button>
        ) : (
          <Link to="/login" className="flex justify-center items-center ">
            <LogOut className="hover:text-green-500 duration-200" size={22} />
          </Link>
        )}
      </nav>
    </>
  );
}
