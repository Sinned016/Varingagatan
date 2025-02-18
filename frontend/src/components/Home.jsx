import { db, auth } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { filterBooksForNewest } from "../functions/filterBooksForNewest";
import homeHeader from "../assets/pictures/homeheader.jpg";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import FinishedRating from "./FinishedRating";
import { BookText } from "lucide-react";
import { sortDataDescending } from "@/functions/sortDataDescending";

export default function Home() {
  const [books, setBooks] = useState();
  const [audioBooks, setAudioBooks] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const booksCollectionRef = collection(db, "books");
      const audioBooksCollectionRef = collection(db, "audioBooks");

      try {
        // Fetch books
        const booksData = await getDocs(booksCollectionRef);
        const filteredBooksData = booksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const sortedBooks = sortDataDescending(filteredBooksData);
        setBooks(sortedBooks);

        // Fetch audiobooks
        const audioBooksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = audioBooksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const sortedAudioBooks = sortDataDescending(filteredAudioBooksData);
        setAudioBooks(sortedAudioBooks);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, []);

  return (
    <div>
      <img
        src={homeHeader}
        className="object-cover h-full w-full"
        alt="Picture of Leif Selander"
      />

      {/* Add bg-slate-50 here if I want side borders and a background of that color instead of nothing */}
      <div className="sm:px-4 xl:px-0 ">
        <div className="p-4 sm:p-0 sm:pb-4 sm:pt-4 ">
          <div className="flex justify-between items-center mt-8 mb-4 ">
            <h2 className="text-2xl font-bold">Upptäck episka berättelser</h2>

            <Link
              to="/books"
              class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-red-500 duration-200"
            >
              Se alla böcker
            </Link>
          </div>

          <div className="flex justify-center flex-wrap ">
            {books &&
              books.slice(0, 6).map((book) => {
                return (
                  <div
                    className="px-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 group"
                    key={book.id}
                  >
                    <Link to={`/book/${book.id}`}>
                      <div className="w-full h-64 mb-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] group-hover:scale-105">
                        <img
                          src={book.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className=" text-center font-semibold text-xl">
                          {book.title}
                        </h3>

                        <p className="text-center  mb-2 sm:mb-0 font-medium">
                          {book.author}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="p-4 sm:p-0 sm:pb-6">
          <div className="flex justify-between items-center mt-8 mb-4">
            <h2 className="text-2xl font-bold">
              Lyssna på historien komma till liv
            </h2>

            <Link
              to="/audioBooks"
              class="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-red-500 duration-200"
            >
              Se alla ljudböcker
            </Link>
          </div>

          <div className="flex justify-center flex-wrap">
            {audioBooks &&
              audioBooks.slice(0, 6).map((book) => {
                return (
                  <div
                    className="px-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 group"
                    key={book.id}
                  >
                    <Link to={`/audioBook/${book.id}`}>
                      <div className="mb-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] group-hover:scale-105">
                        <img
                          src={book.image}
                          alt=""
                          className="w-full h-full object-cover "
                        />
                      </div>

                      <div>
                        <h3 className=" text-center text-xl font-semibold">
                          {book.title}
                        </h3>

                        <p className="text-center  mb-2 sm:mb-0">
                          {book.author}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
