import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import { FaSearch } from "react-icons/fa";

export default function SearchPage() {
  const [combinedData, setCombinedData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTitle = queryParams.get("title");

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const booksCollectionRef = collection(db, "books");
      const audioBooksCollectionRef = collection(db, "audioBooks");
      setSearch(searchTitle);

      try {
        // Fetch books
        const booksData = await getDocs(booksCollectionRef);
        const filteredBooksData = booksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Fetch audiobooks
        const audioBooksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = audioBooksData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Combine books and audiobooks into a single array
        const finishedCombinedData = [
          ...filteredBooksData,
          ...filteredAudioBooksData,
        ];

        setCombinedData(finishedCombinedData);

        const filteredData = finishedCombinedData.filter((data) =>
          data.title.toLowerCase().includes(searchTitle.toLowerCase())
        );

        setSearchedData(filteredData);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, [searchTitle]);

  function handleSearch(e) {
    if (e.key === "Enter") {
      navigate(`?title=${search}`);

      const filteredData = combinedData.filter((data) =>
        data.title.toLowerCase().includes(search.toLowerCase())
      );
      setSearchedData(filteredData);
    }
  }

  return (
    <div className="bg-slate-50 p-6 pb-0">
      <h1 className="text-center text-4xl font-bold mb-4">Sök bland titlar</h1>

      <div className="border border-muted-foreground mb-6"></div>
      <div className="mb-6 relative">
        <FaSearch className="absolute pointer-events-none left-3 top-1/2 -translate-y-1/2 transform " />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-full p-2 bg-slate-300 placeholder-neutral-700 pl-10 text-base leading-none"
          type="text"
          placeholder="Sök bland titlar..."
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex flex-wrap -mx-2">
        {searchedData && searchedData.length > 0 ? (
          searchedData.map((data, index) => {
            return (
              <div className="w-1/2 sm:w-full px-2" key={index}>
                {data.type === "Bok" ? (
                  // Books
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 sm:mb-6 mb-2">
                    <div className="w-full h-72 sm:w-[150px] sm:h-[225px] flex-shrink-0">
                      <img
                        className="h-full w-full object-cover"
                        src={data.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <Link
                        className="hover:text-purple-800 cursor-pointer"
                        to={`/Book/${data.id}`}
                      >
                        <p className="text-2xl sm:text-2xl font-semibold ">
                          {data.title}{" "}
                          <span
                            className={
                              data.secondTitle
                                ? "hidden sm:inline-block"
                                : "hidden"
                            }
                          >
                            - {data.secondTitle}
                          </span>
                        </p>
                      </Link>

                      <p className="font-semibold sm:hidden">
                        {data.secondTitle}
                      </p>
                      <p>{data.author}</p>
                      <p className="mb-2">Typ: {data.type}</p>
                      <p className="hidden sm:line-clamp-5 sm:overflow-hidden sm:-webkit-box sm:-webkit-line-clamp-5 sm:-webkit-box-orient-vertical">
                        {data.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Audiobooks
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 sm:mb-6 mb-2">
                    <div className="w-full h-full sm:w-[150px] sm:h-[150px] flex-shrink-0">
                      <img
                        className="h-full w-full object-cover"
                        src={data.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <Link
                        className="hover:text-purple-800 cursor-pointer"
                        to={`/Book/${data.id}`}
                      >
                        <p className="text-2xl sm:text-2xl font-semibold">
                          {data.title}{" "}
                          <span
                            className={
                              data.secondTitle
                                ? "hidden sm:inline-block"
                                : "hidden"
                            }
                          >
                            - {data.secondTitle}
                          </span>
                        </p>
                      </Link>

                      <p className="font-semibold sm:hidden">
                        {data.secondTitle}
                      </p>
                      <p>{data.author}</p>
                      <p className="mb-2">Typ: {data.type}</p>
                      <p className="hidden sm:line-clamp-2 sm:overflow-hidden sm:-webkit-box sm:-webkit-line-clamp-2 sm:-webkit-box-orient-vertical">
                        {data.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="w-full">
            <h2
              className="text-center "
              style={{ marginBottom: "1em", textAlign: "center" }}
            >
              No book with that title
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
