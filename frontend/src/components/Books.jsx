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
        const filteredBooksData = booksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
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
      <h1 className="title pb-2 font-bold">Books</h1>

      {books &&
        books.map((book, index) => {
          // const averageRating = calculateAverageRating(book.reviews);

          return (
            <Link className="no-link" key={index} to={`/book/${book.id}`}>
              <div className="books-container">
                <div className="books-img-container">
                  <img className="books-img" src={book.image} alt="" />
                </div>

                <div className="books-container-info">
                  <h2 className="text-xl mb-2 font-bold">{book.title}</h2>

                  {/* Add emotes here instead of a text like "price:" */}

                  <p className="mb-2">{book.secondTitle}</p>
                  <p className="line-clamp-3 text-sm font-light">
                    {book.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
