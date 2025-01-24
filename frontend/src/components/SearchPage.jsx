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

  // Gotta somehow use this to filter the data
  const searchTitle = queryParams.get("title");

  console.log(combinedData);
  console.log(searchTitle);

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
        const combinedData = [...filteredBooksData, ...filteredAudioBooksData];

        setCombinedData(combinedData);

        const filteredData = combinedData.filter((data) =>
          data.title.toLowerCase().includes(searchTitle.toLowerCase())
        );
        setSearchedData(filteredData);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, []);

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
    <div className="bg-slate-50 p-6">
      <h2 className="text-center text-4xl font-bold mb-3">Search</h2>
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-full p-2 bg-slate-300 placeholder-neutral-700"
          type="text"
          placeholder="Search for a title..."
          onKeyDown={handleSearch}
        />
      </div>

      {searchedData && searchedData.length > 0 ? (
        searchedData.map((data, index) => {
          return (
            <Link
              className="no-link"
              key={index}
              to={
                data.type === "Book"
                  ? `/book/${data.id}`
                  : `/audioBook/${data.id}`
              }
            >
              <div className="books-container">
                <div className="books-img-container">
                  <img className="books-img" src={data.image} alt="" />
                </div>

                <div className="books-container-info">
                  <h2 className="text-xl mb-2 font-bold">
                    {data.title} - {data.type}
                  </h2>

                  {/* Add emotes here instead of a text like "price:" */}

                  <p className="mb-2">{data.secondTitle}</p>

                  <p
                    className={`${data.type === "Book" ? "line-clamp-3" : "line-clamp-2"} text-sm font-light`}
                  >
                    {data.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <h2 style={{ marginBottom: "1em", textAlign: "center" }}>
          No book with that title
        </h2>
      )}
    </div>
  );
}
