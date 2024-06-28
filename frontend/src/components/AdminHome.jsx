import { useEffect, useState } from "react";
import useAuthState from "./useAuthState";
import { Link, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { Box, Button, Modal, Typography } from "@mui/material";
import AdminAddBook from "./AdminAddBook";

export default function AdminHome() {
  const navigate = useNavigate();
  const { signedInUser, isAdmin, loading } = useAuthState(); // Use the custom hook to get authentication state
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [openDeleteData, setOpenDeleteData] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [openAddNew, setOpenAddNew] = useState(false);

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
        const filteredBooksData = booksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Fetch audiobooks
        const audioBooksData = await getDocs(audioBooksCollectionRef);
        const filteredAudioBooksData = audioBooksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

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

  async function deleteData() {
    const booksCollectionRef = collection(db, "books");
    const audioBooksCollectionRef = collection(db, "audioBooks");

    try {
      // Check if the document exists in the books collection
      const bookDocRef = doc(booksCollectionRef, dataToDelete);
      const bookDocSnapshot = await getDoc(bookDocRef);

      if (bookDocSnapshot.exists()) {
        // Document exists in books collection, delete it
        await deleteDoc(bookDocRef);
        console.log(`Document with ID ${dataToDelete} deleted from books collection`);
        setDataToDelete(null);
        setOpenDeleteData(false);
        setTrigger((prev) => !prev);
        return;
      }

      // Check if the document exists in the audiobooks collection
      const audioBookDocRef = doc(audioBooksCollectionRef, dataToDelete);
      const audioBookDocSnapshot = await getDoc(audioBookDocRef);

      if (audioBookDocSnapshot.exists()) {
        // Document exists in audiobooks collection, delete it
        await deleteDoc(audioBookDocRef);
        console.log(`Document with ID ${dataToDelete} deleted from audiobooks collection`);
        setDataToDelete(null);
        setOpenDeleteData(false);
        setTrigger((prev) => !prev);
        return;
      }
    } catch (err) {
      setDataToDelete(null);
      console.error(err);
    }
  }

  async function handleDeleteData(dataId) {
    setDataToDelete(dataId);
    setOpenDeleteData(true);
  }

  function handleSearch(value) {
    setSearchData(value);

    const filtered = allData.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filtered);
  }

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <div className="page-container">
      {/* Maybe change this to another banner */}
      <h1 className="books-h1">Admin Page</h1>

      <FaPlus className="admin-add" size="30" onClick={() => setOpenAddNew(true)} />

      <div className="admin-search-container">
        <input
          value={searchData}
          className="admin-search-input"
          type="text"
          placeholder="Search title..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {filteredData &&
        filteredData.map((data, index) => {
          const averageRating = calculateAverageRating(data.reviews);

          return (
            <div key={index} className="admin-data-container">
              {/* Add a Trashcan icon here */}
              <Link className="books-container" key={index} to={`/admin/data/${data.id}`}>
                <img className="books-img" src={data.image} alt="" />

                <div className="books-container-info">
                  <h2 className="books-h2">{data.title}</h2>
                  <FinishedRating score={averageRating} size={25} />

                  {/* Add emotes here instead of a text like "price:" and "pages:" */}
                  <div style={{ marginTop: "10px" }}>
                    <p>Author: {data.author}</p>
                    <p>Language: {data.language}</p>
                    <p>Price: {data.price} kr</p>
                    <p>Type: {data.type}</p>
                  </div>
                </div>
              </Link>

              <FaTrash className="admin-delete" size="22" onClick={() => handleDeleteData(data.id)} />
            </div>
          );
        })}

      <div>
        <Modal open={openDeleteData} onClose={() => setOpenDeleteData(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h5" sx={{ color: "black", mb: 2 }}>
              Are you sure you want to delete this?
            </Typography>
            <Button variant="contained" sx={{ mr: 1 }} onClick={() => deleteData()}>
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDeleteData(false);
                setDataToDelete(null);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </div>

      <div className="admin-add-choice-container">
        <Modal open={openAddNew} onClose={() => setOpenAddNew(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              maxHeight: 600,
              bgcolor: "#333",
              boxShadow: 24,
              p: 4,
              borderRadius: "1em",
              overflow: "auto",
            }}
          >
            <div>
              <h1 style={{ textAlign: "center" }}>Add new Content</h1>
              <p style={{ textAlign: "center", marginBottom: ".5em" }}>What Type of book do you want to add?</p>

              <div className="admin-add-choice">
                <button className="admin-add-book">Book</button>
                <button className="admin-add-audiobook">Audiobook</button>
              </div>

              <FaTimes
                className="admin-add-close"
                size="25"
                onClick={() => {
                  setOpenAddNew(false);
                }}
              />
            </div>
          </Box>
        </Modal>
      </div>

      <AdminAddBook />
    </div>
  );
}
