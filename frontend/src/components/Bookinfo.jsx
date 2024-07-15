import { Timestamp, arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import useAuthState from "./useAuthState";
import { Button, Modal, Box, Typography } from "@mui/material";
import likeWhite from "../assets/icons/likeWhite.png";
import likeRed from "../assets/icons/likeRed.png";
import StarRating from "./StarRating";
import FinishedRating from "./FinishedRating";
import { calculateAverageRating } from "../functions/calculateAverageRating";
import { FaTimes, FaTrash } from "react-icons/fa";

export default function Bookinfo() {
  let { id } = useParams();
  const [bookInfo, setBookInfo] = useState();
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewTitleError, setReviewTitleError] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewContentError, setReviewContentError] = useState("");
  const [reviewRatingError, setReviewRatingError] = useState("");
  const [open, setOpen] = useState(false);
  const [openDeleteReview, setOpenDeleteReview] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  const [displayedReviews, setDisplayedReviews] = useState(5);
  const [reviewRating, setReviewRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  // Trigger to do the useEffect again and fetch all data.
  const [submitTrigger, setSubmitTrigger] = useState(false);
  //Testing Timestamp, gonna use it later
  // const time = Timestamp.now();
  // console.log(time.toDate());

  useEffect(() => {
    async function getData() {
      const bookDocRef = doc(db, "books", id);
      try {
        const booksData = await getDoc(bookDocRef);

        if (booksData.exists()) {
          const data = booksData.data();
          setBookInfo(data); // Set bookInfo state with the data of the document

          const averageRating = calculateAverageRating(data.reviews);

          setAverageRating(averageRating);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error(err);
      }
    }
    getData();
  }, [id, submitTrigger]);

  function openModal(e) {
    e.preventDefault();

    if (!reviewTitle || reviewTitle.length < 3) {
      setReviewTitleError("Please provide a title for your review");
      return;
    } else {
      setReviewTitleError("");
    }

    if (!reviewContent) {
      setReviewContentError("Please provide your review before submitting");
      return;
    } else {
      setReviewContentError("");
    }

    if (reviewRating === 0) {
      setReviewRatingError("Please provide a rating before submitting");
      return;
    } else {
      setReviewRatingError("");
    }

    setOpen(true);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();

    const bookDocRef = doc(db, "books", id);
    const newTimestamp = Timestamp.now();

    const payloadData = {
      userId: signedInUser.uid,
      reviewId: `email-${signedInUser.email}-title-${reviewTitle}-timestamp-${newTimestamp}`,
      email: signedInUser.email,
      reviewTitle: reviewTitle,
      reviewContent: reviewContent,
      reviewRating: reviewRating,
      timestamp: newTimestamp,
      likes: [],
    };

    try {
      await updateDoc(bookDocRef, {
        reviews: arrayUnion(payloadData), // Add the new review to the existing reviews array
      });

      setReviewTitle("");
      setReviewContent("");
      setReviewRating(0);
      setOpen(false);
      setSubmitTrigger(!submitTrigger);
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancelReview(e) {
    e.preventDefault();

    setReviewTitle("");
    setReviewContent("");
  }

  const handleShowMoreReviews = () => {
    setDisplayedReviews(displayedReviews + 5);
  };

  async function rateReview(e, reviewId, action) {
    e.preventDefault();

    const bookDocRef = doc(db, "books", id);
    //const newTimestamp = Timestamp.now();

    try {
      const bookSnapshot = await getDoc(bookDocRef);
      const bookData = bookSnapshot.data();

      const reviewIndex = bookData.reviews.findIndex((review) => review.reviewId === reviewId);

      // The specific review the user has liked
      const review = bookData.reviews[reviewIndex];

      if (action === "like") {
        const userLiked = review.likes.includes(signedInUser.uid);

        if (!userLiked) {
          bookData.reviews[reviewIndex].likes.push(signedInUser.uid);
          await updateDoc(bookDocRef, {
            reviews: bookData.reviews,
          });

          console.log("You liked the review");
        } else {
          const userIndex = review.likes.indexOf(signedInUser.uid);
          bookData.reviews[reviewIndex].likes.splice(userIndex, 1);
          await updateDoc(bookDocRef, {
            reviews: bookData.reviews,
          });
          console.log("You unliked the review");
        }
      }
      setSubmitTrigger(!submitTrigger);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteReviewModal(reviewId) {
    setReviewIdToDelete(reviewId);
    setOpenDeleteReview(true);
  }

  //Create a function that works with both audio books and books, now i have 2 functions which kinda looks the same.
  async function deleteReview() {
    if (isAdmin) {
      try {
        // Get a reference to the book document
        const bookDocRef = doc(db, "books", id);

        // Fetch the book document
        const bookDocSnap = await getDoc(bookDocRef);

        if (bookDocSnap.exists()) {
          const bookData = bookDocSnap.data();
          const reviews = bookData.reviews;

          // Find the review to remove
          const reviewToRemove = reviews.find((review) => review.reviewId === reviewIdToDelete);

          if (reviewToRemove) {
            // Update the book document to remove the review from the array
            await updateDoc(bookDocRef, {
              reviews: arrayRemove(reviewToRemove),
            });

            console.log("Review deleted successfully");
          } else {
            console.log("Review not found");
          }
        } else {
          console.log("Book not found");
        }
      } catch (err) {
        console.error("Error deleting review: ", err);
      }
      setSubmitTrigger(!submitTrigger);
      setReviewIdToDelete(null);
      setOpenDeleteReview(false);
    }
  }

  return (
    <div className="page-container">
      {bookInfo ? (
        <div>
          <div className="book-information-container">
            <div className="book-information-top">
              <img src={bookInfo.image} alt="" />

              <div className="book-information">
                <h2 style={{ marginBottom: "10px" }}>{bookInfo.title}</h2>

                <FinishedRating score={averageRating} size={25} />

                <p style={{ marginTop: "10px" }}>{bookInfo.author}</p>

                {/* <p>{bookInfo.language}</p> */}
                {/* <p>{bookInfo.price}</p> */}
              </div>
            </div>

            <div className="book-information-middle">
              <Link to={bookInfo.linkToPurchase}>
                <button className="purchase-btn">Purchase</button>
              </Link>
            </div>

            <div style={{ marginBottom: "1em" }} className="book-information-bottom">
              <h2>Description</h2>
              <p>{bookInfo.description}</p>
            </div>

            <div className="book-information-bottom">
              <h2>Information</h2>

              <div className="book-details">
                <div className="book-details-item">
                  <h3>Author</h3>
                  <p>{bookInfo.author}</p>
                </div>

                <div className="book-details-item">
                  <h3>Language</h3>
                  <p>{bookInfo.language}</p>
                </div>

                {bookInfo.secondTitle && (
                  <div className="book-details-item">
                    <h3>Second Title</h3>
                    <p>{bookInfo.secondTitle}</p>
                  </div>
                )}

                <div className="book-details-item">
                  <h3>Price</h3>
                  <p>{bookInfo.price} sek</p>
                </div>

                {bookInfo.pages && (
                  <div className="book-details-item">
                    <h3>Pages</h3>
                    <p>{bookInfo.pages}</p>
                  </div>
                )}

                {bookInfo.publisher && (
                  <div className="book-details-item">
                    <h3>Publisher</h3>
                    <p>{bookInfo.publisher}</p>
                  </div>
                )}

                {bookInfo.releaseDate && (
                  <div className="book-details-item">
                    <h3>Release Date</h3>
                    <p>{bookInfo.releaseDate}</p>
                  </div>
                )}

                <div className="book-details-item">
                  <h3>Type</h3>
                  <p>{bookInfo.type}</p>
                </div>

                {bookInfo.weight && (
                  <div className="book-details-item">
                    <h3>Weight</h3>
                    <p>{bookInfo.weight}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {signedInUser ? (
            <div className="submitReview-container">
              <form className="submitReview-form" onSubmit={openModal}>
                <h2>Leave a Review</h2>
                <label>Review Title</label>
                <p className="error-message">{reviewTitleError}</p>
                <input
                  placeholder={"Write your Title here..."}
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  type="text"
                />

                <label>Overall Score</label>
                <p className="error-message">{reviewRatingError}</p>

                <StarRating reviewRating={reviewRating} setReviewRating={setReviewRating} />

                <label>Review Content</label>
                <p className="error-message">{reviewContentError}</p>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder={"Write your review here..."}
                  rows={3} // Initial number of rows
                />

                <div className="submitReview-btns">
                  <button className="submit-btn" type="submit">
                    Submit
                  </button>
                  <button className="cancel-btn" onClick={handleCancelReview}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // <p>Sign in to review the book</p>
            ""
          )}

          <div>
            <Modal open={open} onClose={() => setOpen(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "#333",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: "1em",
                  overflow: "auto",
                  outline: "none",
                }}
              >
                <div>
                  <h1 className="modal-title">Post Review?</h1>
                  <p className="modal-text">
                    Are you sure you want to <span style={{ fontWeight: "bold" }}>post</span> this review?
                  </p>

                  <div className="modal-button-container">
                    <button
                      style={{ marginBottom: ".5em" }}
                      className="modal-button-delete"
                      onClick={handleSubmitReview}
                    >
                      Submit
                    </button>
                    <button className="modal-button" onClick={() => setOpen(false)}>
                      Close
                    </button>
                  </div>

                  <FaTimes className="modal-close" size="25" onClick={() => setOpen(false)} />
                </div>
              </Box>
            </Modal>
          </div>

          <div className="reviews-container">
            <h2>Reviews</h2>
            <div className="line-space"></div>
            {bookInfo.reviews ? (
              <>
                {/* Map over only the number of reviews specified by displayedReviews */}
                {bookInfo.reviews.slice(0, displayedReviews).map((review, i) => {
                  return (
                    <div className="review-container" key={i}>
                      <h3>{review.reviewTitle}</h3>

                      <FinishedRating score={review.reviewRating} size={25} />

                      <div className="email-date">
                        <p>BY {review.email}</p>
                        <p>{new Date(review.timestamp.seconds * 1000).toLocaleString()}</p>
                      </div>
                      <p>{review.score}</p>
                      <p className="margin-bot review-content">{review.reviewContent}</p>

                      <div className="reviews-rating-container">
                        {isAdmin && (
                          <FaTrash
                            className="trash-icon"
                            size="22"
                            onClick={() => handleDeleteReviewModal(review.reviewId)}
                          />
                        )}

                        <p className="total-reviews">
                          {review.likes && review.likes.length > 0 ? review.likes.length : ""}
                        </p>

                        {signedInUser ? (
                          <div
                            className={review.likes && review.likes.includes(signedInUser?.uid) ? "liked" : "unliked"}
                            onClick={(e) => rateReview(e, review.reviewId, "like")}
                          >
                            {review.likes && review.likes.includes(signedInUser.uid) ? (
                              <img className="rate-icon" src={likeWhite} alt="" />
                            ) : (
                              <img className="rate-icon" src={likeRed} alt="" />
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="line-space"></div>
                    </div>
                  );
                })}
                {/* Button to show more reviews */}
                {bookInfo.reviews.length > displayedReviews && (
                  <button onClick={handleShowMoreReviews} className="show-more-btn">
                    Show More
                  </button>
                )}
              </>
            ) : (
              "No reviews"
            )}
          </div>

          <div>
            <Modal open={openDeleteReview} onClose={() => setOpenDeleteReview(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "#333",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: "1em",
                  overflow: "auto",
                  outline: "none",
                }}
              >
                <div>
                  <h1 className="modal-title">Delete Review?</h1>
                  <p className="modal-text">
                    Are you sure you want to <span style={{ fontWeight: "bold" }}>delete</span> this review?
                  </p>

                  <div className="modal-button-container">
                    <button style={{ marginBottom: ".5em" }} className="modal-button-delete" onClick={deleteReview}>
                      Delete
                    </button>
                    <button
                      className="modal-button"
                      onClick={() => {
                        setOpenDeleteReview(false);
                        setReviewIdToDelete(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <FaTimes className="modal-close" size="25" onClose={() => setOpenDeleteReview(false)} />
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
