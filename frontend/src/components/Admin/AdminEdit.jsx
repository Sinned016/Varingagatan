import { useNavigate, useParams } from "react-router-dom";
import useAuthState from "../useAuthState";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import FinishedRating from "../FinishedRating";
import { calculateAverageRating } from "../../functions/calculateAverageRating";

export default function AdminEdit() {
  let { type, id } = useParams();
  const navigate = useNavigate();
  const { signedInUser, isAdmin, loading } = useAuthState();
  const [initalData, setInitialData] = useState(null);
  const [data, setData] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

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
      const bookDocRef = doc(db, "books", id);
      const audioBookDocRef = doc(db, "audioBooks", id);
      let fetchedData;

      try {
        if (type === "Book") {
          fetchedData = await getDoc(bookDocRef);
        } else if (type === "Audiobook") {
          fetchedData = await getDoc(audioBookDocRef);
        }

        if (fetchedData && fetchedData.exists()) {
          const data = fetchedData.data();
          setInitialData(data);
          setData(data);

          const averageRating = calculateAverageRating(data.reviews);
          setAverageRating(averageRating);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, [type, id]);

  async function saveData() {
    const booksCollectionRef = collection(db, "books");
    const audioBooksCollectionRef = collection(db, "audioBooks");

    try {
      if (type === "Book") {
        const bookDocRef = doc(booksCollectionRef, id);
        await setDoc(bookDocRef, data);
        console.log("Book updated successfully!");
      } else if (type === "Audiobook") {
        const audioBookDocRef = doc(audioBooksCollectionRef, id);
        await setDoc(audioBookDocRef, data);
        console.log("Audiobook updated successfully!");
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="page-container">
      {data && (
        <div className="admin-edit-container">
          <div className="book-information-top">
            <img src={data.image} alt="" />
            <div className="book-information">
              <h2 style={{ marginBottom: "10px" }}>{data.title}</h2>

              <FinishedRating score={averageRating} size={25} />

              <p style={{ marginTop: "10px" }}>{data.author}</p>
            </div>
          </div>

          <div className="admin-edit-information">
            <h2 className="h2-title text-center">Edit {type}</h2>
            <label htmlFor="">Title</label>
            <input
              name="title"
              className="admin-content-input"
              type="text"
              value={data.title}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Second Title</label>
            <input
              name="secondTitle"
              className="admin-content-input"
              type="text"
              value={data.secondTitle}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Author</label>
            <input
              name="author"
              className="admin-content-input"
              type="text"
              value={data.author}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Description</label>
            <textarea
              name="description"
              className="admin-content-input"
              type="text"
              value={data.description}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Language</label>
            <input
              name="language"
              className="admin-content-input"
              type="text"
              value={data.language}
              onChange={(e) => handleChange(e)}
            />

            {type === "Audiobook" && data.reader && (
              <>
                <label htmlFor="">Reader</label>
                <input
                  name="reader"
                  className="admin-content-input"
                  type="text"
                  value={data.reader}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}

            <label htmlFor="">Price</label>
            <input
              name="price"
              className="admin-content-input"
              type="text"
              value={data.price}
              onChange={(e) => handleChange(e)}
            />

            {type === "Audiobook" && data.time && (
              <>
                <label htmlFor="">Time</label>
                <input
                  name="time"
                  className="admin-content-input"
                  type="text"
                  value={data.time}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}

            {type === "Audiobook" && data.size && (
              <>
                <label htmlFor="">Size</label>
                <input
                  name="size"
                  className="admin-content-input"
                  type="text"
                  value={data.size}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}

            {type === "Book" && data.pages && (
              <>
                <label htmlFor="">Pages</label>
                <input
                  name="pages"
                  className="admin-content-input"
                  type="text"
                  value={data.pages}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}

            {type === "Book" && data.weight && (
              <>
                <label htmlFor="">Weight</label>
                <input
                  name="weight"
                  className="admin-content-input"
                  type="text"
                  value={data.weight}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}

            <label htmlFor="">Release Date</label>
            <input
              name="releaseDate"
              className="admin-content-input"
              type="text"
              value={data.releaseDate}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Publisher</label>
            <input
              name="publisher"
              className="admin-content-input"
              type="text"
              value={data.publisher}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Link to Purchase</label>
            <input
              name="linkToPurchase"
              className="admin-content-input"
              type="text"
              value={data.linkToPurchase}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Link to Image of {type}</label>
            <input
              name="image"
              className="admin-content-input"
              type="text"
              value={data.image}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="admin-add-buttons">
            <button
              className="admin-add-cancel"
              onClick={() => {
                setData(initalData);
                navigate("/admin");
              }}
            >
              Cancel
            </button>
            <button className="admin-add-confirm" onClick={() => saveData()}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
