import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import useAuthState from "./useAuthState";

export default function Bookinfo() {
  let { id } = useParams();
  const [bookInfo, setBookInfo] = useState();
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state

  console.log(bookInfo);
  console.log(id);

  useEffect(() => {
    async function getData() {
      const bookDocRef = doc(db, "books", id);
      try {
        const booksData = await getDoc(bookDocRef);

        if (booksData.exists()) {
          // Check if the document exists
          setBookInfo(booksData.data()); // Set bookInfo state with the data of the document
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error(err);
      }
    }
    getData();
  }, [id]);

  return (
    <>
      {bookInfo ? (
        <div>
          <div>
            <h1>{bookInfo.title}</h1>
            <p>{bookInfo.language}</p>
            <img src={bookInfo.image} alt="" />
            <p>Author: {bookInfo.author}</p>
            {/* Fix so users can rate books */}
            {/* <p>Score: </p> */}
            <p>{bookInfo.price} kr</p>
            <Link to={bookInfo.linkToPurchase}>
              <button>Purchase</button>
            </Link>
            <div></div>
            <h2>Description</h2>
            <p>{bookInfo.description}</p>
          </div>

          <div>
            {signedInUser ? (
              <>
                <h2>Leave a Review</h2>
                <form>
                  <label>Review Title</label>
                  <input type="text" />
                  {/* Add score here */}
                  <label>Review Content</label>
                  <input type="text" />
                </form>
              </>
            ) : (
              // <p>Sign in to review the book</p>
              ""
            )}
          </div>

          <div>
            <h2>Reviews</h2>
            {bookInfo.reviews
              ? bookInfo.reviews.map((review, i) => {
                  return (
                    <div key={i}>
                      <h3>{review.title}</h3>
                      <div>
                        <p>{review.user}</p>
                        <p>{new Date(review.timestamp.seconds * 1000).toLocaleString()}</p>
                      </div>
                      <p>{review.score}</p>
                      <p>{review.content}</p>
                    </div>
                  );
                })
              : "No reviews"}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
