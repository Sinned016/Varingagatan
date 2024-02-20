import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { auth } from "../config/firebase";

const useAuthState = () => {
  const [signedInUser, setSignedInUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

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

  return { signedInUser, isAdmin };
};

export default useAuthState;
