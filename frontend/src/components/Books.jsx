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
    <div className="p-6 sm:p-0 sm:pt-6">
      {/* <h1 className="text-center text-4xl font-bold mb-4">Böcker</h1>

      <div className="border border-muted-foreground mb-6"></div> */}

      <div className="flex flex-wrap -mx-2">
        {books &&
          books.map((book, index) => {
            // const averageRating = calculateAverageRating(book.reviews);

            return (
              <div key={index} className="w-1/2 sm:w-full px-2">
                <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 sm:mb-6 mb-2 group">
                  <div className="w-full h-72 sm:w-[150px] sm:h-[225px] flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow duration-300 group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
                    <img
                      className="h-full w-full object-cover"
                      src={book.image}
                      alt=""
                    />
                  </div>
                  <div>
                    <Link
                      className="hover:text-purple-800 cursor-pointer transform duration-200"
                      to={`/Book/${book.id}`}
                    >
                      <p className="text-2xl sm:text-2xl font-semibold ">
                        {book.title}{" "}
                        <span
                          className={
                            book.secondTitle
                              ? "hidden sm:inline-block"
                              : "hidden"
                          }
                        >
                          - {book.secondTitle}
                        </span>
                      </p>
                    </Link>

                    <p className="font-semibold sm:hidden">
                      {book.secondTitle}
                    </p>
                    <p>{book.author}</p>
                    <p className="mb-2">Typ: {book.type}</p>
                    <p className="hidden sm:line-clamp-5 sm:overflow-hidden sm:-webkit-box sm:-webkit-line-clamp-5 sm:-webkit-box-orient-vertical">
                      {book.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
