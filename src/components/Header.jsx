import { onAuthStateChanged, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { getDocs } from "firebase/firestore";

export default function Header() {
  const [signedInUser, setSignedInUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setSignedInUser({
          uid: user.uid,
          email: user.email,
        });

        try {
          const accessToken = await user.getIdToken();
          if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            console.log(decodedToken);
            setIsAdmin(decodedToken.admin);
          } else {
            console.error("Access token is undefined");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        // User is not logged in

        console.log("You are not logged in");
        setIsAdmin(false);
        setSignedInUser(undefined);
      }
    });

    return unsubscribe; // Clean up the subscription
  }, []);

  async function logout() {
    try {
      await signOut(auth);
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
