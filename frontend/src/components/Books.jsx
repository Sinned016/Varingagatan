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
    <div className="bg-slate-50 p-6">
      {/* Maybe change this to another banner */}
      <h1 className="text-center text-4xl font-bold mb-3">Books</h1>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {books &&
          books.map((book, index) => {
            // const averageRating = calculateAverageRating(book.reviews);

            return (
              <Link className="flex-grow " key={index} to={`/book/${book.id}`}>
                <div className="flex flex-col gap-2 sm:gap-6 sm:flex-row">
                  <div className="w-full sm:w-44 h-64 sm:h-72 border flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src={book.image}
                      alt=""
                    />
                  </div>

                  <div className="">
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                      {book.title}
                    </h2>

                    {/* Add emotes here instead of a text like "price:" */}

                    <p className=" font-semibold">{book.secondTitle}</p>
                    <p className="">{book.author}</p>
                    <p className="">{book.price} kr</p>
                    <p className="hidden sm:line-clamp-4 sm:overflow-hidden sm:-webkit-box sm:-webkit-line-clamp-4 sm:-webkit-box-orient-vertical">
                      {book.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
