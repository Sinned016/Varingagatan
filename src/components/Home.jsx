import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getDocs, collection } from "firebase/firestore";

export default function Home() {
  const [signedInUser, setSignedInUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState();
  const [audioBooks, setAudioBooks] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const booksCollectionRef = collection(db, "books");
      const audioBooksCollectionRef = collection(db, "audioBooks");
      try {
        const booksData = await getDocs(booksCollectionRef);
        const filteredBooksData = booksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(filteredBooksData);
        setBooks(filteredBooksData);
      } catch (err) {
        console.error(err);
      }
    }
    getData();

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
  }, [navigate]);

  return (
    <>
      <h1 className="title">This is the Home Page</h1>

      <div className="books-grid">
        {books &&
          books.map((book) => (
            <div key={book.id}>
              <img src={book.image} alt="" className="book-image" />
              <h3>{book.title}</h3>
            </div>
          ))}
      </div>
    </>
  );
}
