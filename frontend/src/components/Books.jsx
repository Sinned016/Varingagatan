import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";

export default function Books() {
  const [books, setBooks] = useState();

  useEffect(() => {
    async function getBooks() {
      const booksCollectionRef = collection(db, "books");

      try {
        const booksData = await getDocs(booksCollectionRef);
        const filteredBooksData = booksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(filteredBooksData);
        setBooks(filteredBooksData);
      } catch (err) {
        console.error(err);
      }
    }

    getBooks();
  }, []);
  return (
    <div className="page-container">
      {/* Maybe change this to another banner */}
      <h1 className="books-h1">Books</h1>

      {books &&
        books.map((book, index) => {
          const averageRating = calculateAverageRating(book.reviews);

          return (
            <Link className="no-link" key={index} to={`/book/${book.id}`}>
              <div className="books-container">
                <div className="books-img-container">
                  <img className="books-img" src={book.image} alt="" />
                </div>

                <div className="books-container-info">
                  <h2 className="books-h2">{book.title}</h2>

                  <FinishedRating score={averageRating} size={25} />

                  {/* Add emotes here instead of a text like "price:" */}
                  <div className="books-info" style={{ marginTop: "10px" }}>
                    <div>
                      <p>Author: {book.author}</p>
                      <p>Language: {book.language}</p>
                      {book.secondTitle && <p>Second Title: {book.secondTitle}</p>}
                      {book.reader && <p>Reader: {book.reader}</p>}
                    </div>
                    <div className="books-info-hide">
                      <p>Price: {book.price} kr</p>
                      {book.pages && <p>Pages: {book.pages}</p>}
                      {book.weight && <p>Weight: {book.weight}</p>}
                      {book.time && <p>Time: {book.time}</p>}
                      {book.size && <p>Size: {book.size}</p>}
                    </div>
                    <div className="books-info-hide">
                      {book.releaseDate && <p>Release Date: {book.releaseDate}</p>}
                      {book.publisher && <p>Publisher: {book.publisher}</p>}
                      <p>Type: {book.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
