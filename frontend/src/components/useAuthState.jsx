import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const useAuthState = () => {
  const [signedInUser, setSignedInUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setSignedInUser({
          uid: user.uid,
          email: user.email,
        });

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            name: user.displayName,
            picture: user.photoURL,
          });
        }

        try {
          const accessToken = await user.getIdToken();
          if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setIsAdmin(decodedToken.admin);
          } else {
            console.error("Access token is undefined");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        // User is not logged in
        setIsAdmin(false);
        setSignedInUser(undefined);
      }
      setLoading(false); // Set loading to false once the state is determined
    });

    return unsubscribe; // Clean up the subscription
  }, []);

  return { signedInUser, isAdmin, loading }; // Return loading state
};

export default useAuthState;
