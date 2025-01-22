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
    <div className="bg-slate-50 p-6">
      <h1 className="text-center text-4xl font-bold mb-3">Audiobooks</h1>

      {books &&
        books.map((book, index) => {
          // const averageRating = calculateAverageRating(book.reviews);

          return (
            <Link className="" key={index} to={`/audioBook/${book.id}`}>
              <div className="flex flex-row mb-6 gap-6" key={index}>
                <div className="flex-shrink-0">
                  <img className="w-full max-w-52" src={book.image} alt="" />
                </div>

                <div className="">
                  <h2 className="text-3xl mb-2 font-semibold">{book.title}</h2>
                  {/* <FinishedRating score={averageRating} size={25} /> */}

                  {/* Add emotes here instead of a text like "price:" */}
                  <p className="mb-2 font-semibold">{book.secondTitle}</p>
                  <p className="mb-2">{book.author}</p>
                  <p className="line-clamp-3">{book.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
