import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getDocs, collection } from "firebase/firestore";
import { filterBooksForNewest } from "../functions/filterBooksForNewest";
import useAuthState from "./useAuthState";
import homeHeader from "../assets/pictures/homeHeader.jpg";

export default function Home() {
  const [books, setBooks] = useState();
  const [newestBooks, setNewestBooks] = useState();
  const [audioBooks, setAudioBooks] = useState();
  const navigate = useNavigate();

  //const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state

  useEffect(() => {
    async function getData() {
      const booksCollectionRef = collection(db, "books");
      const audioBooksCollectionRef = collection(db, "audioBooks");
      try {
        const booksData = await getDocs(booksCollectionRef);
        const filteredBooksData = booksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(filteredBooksData);
        setBooks(filteredBooksData);

        const newestBooks = filterBooksForNewest(filteredBooksData);
        setNewestBooks(newestBooks);
      } catch (err) {
        console.error(err);
      }

      try {
        const audioBooksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = audioBooksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(filteredAudioBooksData);
        setAudioBooks(filteredAudioBooksData);
      } catch (err) {
        console.error(err);
      }
    }
    getData();
  }, []);

  return (
    <div className="page-container">
      <div className="home-header">
        <img src={homeHeader} alt="" />
      </div>

      <div className="books-container">
        <h2 className="title">Recommended Series</h2>

        <div className="books-grid">
          {newestBooks &&
            newestBooks.map((book) => (
              <div className="book-item" key={book.id}>
                <div className="book-image-container">
                  <Link to={`/book/${book.id}`}>
                    <img src={book.image} alt="" className="book-image" />
                  </Link>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
                <div className="book-price">
                  <Link to={book.linkToPurchase}>
                    <button>{book.price} kr</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="books-container">
        <h2 className="title">Books</h2>

        <div className="books-grid">
          {books &&
            books.map((book) => (
              <div className="book-item" key={book.id}>
                <div className="book-image-container">
                  <Link to={`/book/${book.id}`}>
                    <img src={book.image} alt="" className="book-image" />
                  </Link>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
                <div className="book-price">
                  <Link to={book.linkToPurchase}>
                    <button>{book.price} kr</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="books-container">
        <h2 className="title">Audio Books</h2>

        <div className="books-grid">
          {audioBooks &&
            audioBooks.map((book) => (
              <div className="book-item" key={book.id}>
                <div className="book-image-container">
                  <Link to={`/audioBook/${book.id}`}>
                    <img src={book.image} alt="" className="book-image" />
                  </Link>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
                <div className="book-price">
                  <Link to={book.linkToPurchase}>
                    <button>{book.price} kr</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
