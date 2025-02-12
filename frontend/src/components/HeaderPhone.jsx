import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { LogOut } from "lucide-react";
import ToggleMode from "./ToggleMode";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

export default function HeaderPhone({
  search,
  setSearch,
  logout,
  handleSearch,
  signedInUser,
  isAdmin,
}) {
  const location = useLocation(); // Access location object
  const pathname = location.pathname; // Get the current pathname
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FaBars size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 p-4 border border-neutral-600"
        align="end"
      >
        <Link
          className={
            pathname === "/" && "underline underline-offset-4 text-primary"
          }
          to="/"
        >
          <DropdownMenuItem className="py-2 font-medium cursor-pointer hover:text-primary duration-200">
            Hem
          </DropdownMenuItem>
        </Link>

        <Link
          className={
            pathname.includes("/books") &&
            "underline underline-offset-4 text-primary"
          }
          to="/books"
        >
          <DropdownMenuItem className="py-2 font-medium cursor-pointer">
            Böcker
          </DropdownMenuItem>
        </Link>

        <Link
          className={
            pathname.includes("/audioBooks") &&
            "underline underline-offset-4 text-primary"
          }
          to="/audioBooks"
        >
          <DropdownMenuItem className="py-2 font-medium cursor-pointer">
            {" "}
            Ljudböcker
          </DropdownMenuItem>
        </Link>

        <Link
          className={
            pathname.includes("/about") &&
            "underline underline-offset-4 text-primary"
          }
          to="/about"
        >
          <DropdownMenuItem className="py-2 font-medium cursor-pointer">
            {" "}
            Om
          </DropdownMenuItem>
        </Link>
        {isAdmin && (
          <Link
            className={
              pathname.includes("/admin") &&
              "underline underline-offset-4 text-primary"
            }
            to="/admin"
          >
            <DropdownMenuItem className="py-2 font-medium cursor-pointer">
              Admin
            </DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
