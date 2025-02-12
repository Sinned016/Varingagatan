import { useEffect, useState } from "react";
import useAuthState from "../useAuthState";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

import AdminNav from "./AdminNav";
import { Ellipsis, Settings } from "lucide-react";
import SearchForData from "../SearchForData";

export default function AdminHome() {
  const navigate = useNavigate();
  const { signedInUser, isAdmin, loading } = useAuthState(); // Use the custom hook to get authentication state
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (isAdmin === false) {
        navigate("/");
      } else {
        console.log("Welcome to the admin page");
      }
    }
  }, [isAdmin, loading, navigate]);

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

        setAllData(combinedData);
        setFilteredData(combinedData);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, [loading, trigger]);

  return (
    <div className=" p-6  sm:pt-6 sm:px-6 xl:px-0">
      <AdminNav />

      <SearchForData originalData={allData} setSearchedData={setFilteredData} />

      {/* <h1 className="text-3xl font-bold mb-6">Alla titlar</h1> */}

      <div className="flex flex-wrap -mx-2">
        {filteredData &&
          filteredData.map((data, index) => {
            return (
              <div className="w-1/2 sm:w-full px-2 relative" key={index}>
                <Link
                  className="hover:text-primary cursor-pointer"
                  to={`/admin/${data.type}/${data.id}`}
                >
                  <Settings className="absolute top-1 right-2 hidden sm:block z-10" />
                </Link>

                {data.type === "Bok" ? (
                  // Books
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 sm:mb-6 mb-2 group">
                    <div className="w-full h-72 sm:w-[150px] sm:h-[225px] flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow duration-300 group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
                      <img
                        className="h-full w-full object-cover"
                        src={data.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-2xl font-semibold ">
                        <Link
                          className="hover:text-primary cursor-pointer transform duration-200"
                          to={`/admin/${data.type}/${data.id}`}
                        >
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
                        </Link>
                      </p>

                      <p className="font-semibold sm:hidden">
                        {data.secondTitle}
                      </p>
                      <p className="font-medium">{data.author}</p>
                      <p className="mb-2">Typ: {data.type}</p>
                      <p className="hidden sm:line-clamp-5 sm:overflow-hidden sm:-webkit-box sm:-webkit-line-clamp-5 sm:-webkit-box-orient-vertical">
                        {data.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Audiobooks
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 sm:mb-6 mb-2 relative">
                    <div className="w-full h-full sm:w-[150px] sm:h-[150px] flex-shrink-0">
                      <img
                        className="h-full w-full object-cover"
                        src={data.image}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-2xl font-semibold">
                        <Link
                          className="hover:text-purple-800 cursor-pointer"
                          to={`/admin/${data.type}/${data.id}`}
                        >
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
                        </Link>
                      </p>

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
          })}
      </div>
    </div>
  );
}
