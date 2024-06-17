import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getDocs, collection } from "firebase/firestore";
import { filterBooksForNewest } from "../functions/filterBooksForNewest";
import useAuthState from "./useAuthState";
import homeHeader from "../assets/pictures/homeHeader.jpg";
import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";

export default function AudioBooks() {
  const [books, setBooks] = useState();

  useEffect(() => {
    async function getAudioBooks() {
      const audioBooksCollectionRef = collection(db, "audioBooks");

      try {
        const booksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = booksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(filteredAudioBooksData);
        setBooks(filteredAudioBooksData);
      } catch (err) {
        console.error(err);
      }
    }

    getAudioBooks();
  }, []);
  return (
    <div className="page-container">
      <h1 className="books-h1">Audiobooks</h1>

      {books &&
        books.map((book, index) => {
          const averageRating = calculateAverageRating(book.reviews);

          return (
            <Link className="no-link" key={index} to={`/audioBook/${book.id}`}>
              <div className="books-container" key={index}>
                <img className="books-img" src={book.image} alt="" />

                <div className="books-container-info">
                  <h2 className="books-h2">{book.title}</h2>
                  <FinishedRating score={averageRating} size={25} />

                  {/* Add emotes here instead of a text like "price:" */}
                  <div style={{ marginTop: "10px" }}>
                    <p>{book.author}</p>
                    <p>{book.language}</p>
                    <p>Price: {book.price} kr</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
