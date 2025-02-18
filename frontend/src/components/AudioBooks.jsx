import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";

import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import SearchForData from "./SearchForData";
import { sortDataDescending } from "@/functions/sortDataDescending";

export default function AudioBooks() {
  const [audiobooks, setAudiobooks] = useState();
  const [searchedData, setSearchedData] = useState([]);

  useEffect(() => {
    async function getAudioBooks() {
      const audioBooksCollectionRef = collection(db, "audioBooks");

      try {
        const booksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = booksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const sortedAudioBooks = sortDataDescending(filteredAudioBooksData);
        setAudiobooks(sortedAudioBooks);
        setSearchedData(sortedAudioBooks);
      } catch (err) {
        console.error(err);
      }
    }

    getAudioBooks();
  }, []);
  return (
    <div className=" p-6 sm:p-0 sm:pt-6 sm:px-6 xl:px-0">
      {/* <h1 className="text-center text-4xl font-bold mb-4">Ljudböcker</h1>

      <div className="border border-muted-foreground mb-6"></div> */}

      <SearchForData
        originalData={audiobooks}
        setSearchedData={setSearchedData}
      />

      <div className="flex flex-wrap -mx-2">
        {audiobooks &&
          searchedData.map((book, index) => {
            // const averageRating = calculateAverageRating(book.reviews);

            return (
              <div key={index} className="w-1/2 sm:w-full px-2">
                <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 sm:mb-6 mb-2 group">
                  <div className="w-full h-full sm:w-[150px] sm:h-[150px] flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow duration-300 group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
                    <img
                      className="h-full w-full object-cover"
                      src={book.image}
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-2xl font-semibold">
                      <Link
                        className="hover:text-primary cursor-pointer transform duration-200"
                        to={`/Audiobook/${book.id}`}
                      >
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
                      </Link>
                    </p>

                    <p className="font-semibold sm:hidden">
                      {book.secondTitle}
                    </p>
                    <p className="font-medium">{book.author}</p>
                    <p className="mb-2">Typ: {book.type}</p>
                    <p className="hidden sm:line-clamp-2 sm:overflow-hidden sm:-webkit-box sm:-webkit-line-clamp-2 sm:-webkit-box-orient-vertical">
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
