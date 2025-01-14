import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";

export default function AudioBooks() {
  const [books, setBooks] = useState();

  useEffect(() => {
    async function getAudioBooks() {
      const audioBooksCollectionRef = collection(db, "audioBooks");

      try {
        const booksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = booksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredAudioBooksData);
        setBooks(filteredAudioBooksData);
      } catch (err) {
        console.error(err);
      }
    }

    getAudioBooks();
  }, []);
  return (
    <div className="">
      <h1 className="title pb-2 font-bold">Audiobooks</h1>

      {books &&
        books.map((book, index) => {
          // const averageRating = calculateAverageRating(book.reviews);

          return (
            <Link className="no-link" key={index} to={`/audioBook/${book.id}`}>
              <div className="books-container" key={index}>
                <div className="audiobooks-img-container">
                  <img className="audiobooks-img" src={book.image} alt="" />
                </div>

                <div className="books-container-info">
                  <h2 className="text-xl mb-2 font-bold">{book.title}</h2>
                  {/* <FinishedRating score={averageRating} size={25} /> */}

                  {/* Add emotes here instead of a text like "price:" */}
                  <p className="mb-2">{book.secondTitle}</p>
                  <p className="line-clamp-2 text-sm font-light">
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
