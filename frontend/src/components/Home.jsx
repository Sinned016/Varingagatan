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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state

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

      <>
        <div className="bg-slate-50 p-4 sm:mb-4 sm:mt-4">
          <h2 className="text-center text-3xl font-bold mb-4">Böcker</h2>

          <div className="flex justify-center flex-wrap">
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
                        <h3 className="text-black text-center font-semibold text-xl">
                          {book.title}
                        </h3>

                        <p className="text-center text-black mb-2 sm:mb-0">
                          {book.author}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-zinc-50 p-4">
          <h2 className="text-center text-3xl font-bold mb-4">Ljudböcker</h2>

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
                        <h3 className="text-black text-center text-xl font-semibold">
                          {book.title}
                        </h3>

                        <p className="text-center text-black mb-2 sm:mb-0">
                          {book.author}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    </div>
  );
}
