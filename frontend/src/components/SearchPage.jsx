import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import { FaSearch } from "react-icons/fa";

export default function SearchPage() {
  const [combinedData, setCombinedData] = useState([]);
  const [search, setSearch] = useState("");

  console.log(combinedData);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTitle = queryParams.get("title");

  const navigate = useNavigate();

  console.log(searchTitle);

  useEffect(() => {
    async function getData() {
      const booksCollectionRef = collection(db, "books");
      const audioBooksCollectionRef = collection(db, "audioBooks");

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

        const filteredCombinedData = combinedData.filter((data) => {
          return data.title.toLowerCase().includes(searchTitle.toLowerCase());
        });

        // Set state for combined data
        setCombinedData(filteredCombinedData);
        setSearch(searchTitle);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, [searchTitle]);

  function handleSearch(e) {
    const title = e.target.value;
    setSearch(title);
    navigate(`?title=${title}`);
  }

  return (
    <div className="page-container">
      <h2 className="title pb-2">Search</h2>
      <div className="search-input-page-container">
        <FaSearch className="search-icon" />
        <input
          value={search}
          className="search-input"
          type="text"
          placeholder="Search title..."
          onChange={handleSearch}
        />
      </div>

      {combinedData && combinedData.length > 0 ? (
        combinedData.map((data, index) => {
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
