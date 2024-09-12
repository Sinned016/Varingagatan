import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { filterBooksForNewest } from "../functions/filterBooksForNewest";
import homeHeader from "../assets/pictures/homeheader.jpg";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import FinishedRating from "./FinishedRating";

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
        // Fetch books
        const booksData = await getDocs(booksCollectionRef);
        const filteredBooksData = booksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBooks(filteredBooksData);

        // Fetch audiobooks
        const audioBooksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = audioBooksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAudioBooks(filteredAudioBooksData);

        // Filter and set state for newest books
        const newestBooks = filterBooksForNewest(filteredBooksData);
        setNewestBooks(newestBooks);
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

      <div className="home-container">
        <h2 className="title">Väringasagan Series</h2>

        <div className="recommended-books-grid">
          {newestBooks &&
            newestBooks.map((book) => {
              // const averageRating = calculateAverageRating(book.reviews);

              return (
                <div className="book-item" key={book.id}>
                  <Link to={`/book/${book.id}`}>
                    <div className="book-image-container">
                      <img src={book.image} alt="" className="book-image" />
                    </div>

                    <div className="book-info-container">
                      <div className="book-info">
                        <h3>{book.title}</h3>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* <FinishedRating score={averageRating} size={17} /> */}
                      </div>

                      <div className="book-author">
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>

      <div className="home-container">
        <h2 className="title">Books</h2>

        <div className="books-grid">
          {books &&
            books.map((book) => {
              // const averageRating = calculateAverageRating(book.reviews);
              return (
                <div className="book-item" key={book.id}>
                  <Link to={`/book/${book.id}`}>
                    <div className="book-image-container">
                      <img src={book.image} alt="" className="book-image" />
                    </div>

                    <div className="book-info-container">
                      <div className="book-info">
                        <h3>{book.title}</h3>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* <FinishedRating score={averageRating} size={17} /> */}
                      </div>

                      <div className="book-author">
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>

      <div className="home-container">
        <h2 className="title">Audiobooks</h2>

        <div className="audiobook-grid">
          {audioBooks &&
            audioBooks.map((book) => {
              // const averageRating = calculateAverageRating(book.reviews);
              return (
                <div className="audiobook-item" key={book.id}>
                  <Link to={`/audioBook/${book.id}`}>
                    <div className="audiobook-image-container">
                      <img
                        src={book.image}
                        alt=""
                        className="audiobook-image"
                      />
                    </div>

                    <div className="book-info-container">
                      <div className="book-info">
                        <h3>{book.title}</h3>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* <FinishedRating score={averageRating} size={17} /> */}
                      </div>

                      <div className="book-author">
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
