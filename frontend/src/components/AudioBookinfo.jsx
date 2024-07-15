import { Timestamp, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
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
  const [audioBookInfo, setAudioBookInfo] = useState();
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
      const audioBookDocRef = doc(db, "audioBooks", id);
      try {
        const booksData = await getDoc(audioBookDocRef);

        if (booksData.exists()) {
          const data = booksData.data();
          setAudioBookInfo(data); // Set bookInfo state with the data of the document

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

    const audioBookDocRef = doc(db, "audioBooks", id);
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
      await updateDoc(audioBookDocRef, {
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

    const audioBookDocRef = doc(db, "audioBooks", id);
    //const newTimestamp = Timestamp.now();

    try {
      const bookSnapshot = await getDoc(audioBookDocRef);
      const bookData = bookSnapshot.data();

      const reviewIndex = bookData.reviews.findIndex((review) => review.reviewId === reviewId);

      // The specific review the user has liked
      const review = bookData.reviews[reviewIndex];

      if (action === "like") {
        const userLiked = review.likes.includes(signedInUser.uid);

        if (!userLiked) {
          bookData.reviews[reviewIndex].likes.push(signedInUser.uid);
          await updateDoc(audioBookDocRef, {
            reviews: bookData.reviews,
          });
        } else {
          const userIndex = review.likes.indexOf(signedInUser.uid);
          bookData.reviews[reviewIndex].likes.splice(userIndex, 1);
          await updateDoc(audioBookDocRef, {
            reviews: bookData.reviews,
          });
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
        const audioBookDocRef = doc(db, "audioBooks", id);

        // Fetch the book document
        const audioBookDocSnap = await getDoc(audioBookDocRef);

        if (audioBookDocSnap.exists()) {
          const bookData = audioBookDocSnap.data();
          const reviews = bookData.reviews;

          // Find the review to remove
          const reviewToRemove = reviews.find((review) => review.reviewId === reviewIdToDelete);

          if (reviewToRemove) {
            // Update the book document to remove the review from the array
            await updateDoc(audioBookDocRef, {
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
      {audioBookInfo ? (
        <div>
          <div className="book-information-container">
            <div className="book-information-top">
              <img src={audioBookInfo.image} alt="" />
              <div className="book-information">
                <h2 style={{ marginBottom: "10px" }}>{audioBookInfo.title}</h2>

                <FinishedRating score={averageRating} size={25} />

                <p style={{ marginTop: "10px" }}>{audioBookInfo.author}</p>
                {/* <p>{audioBookInfo.language}</p>
                <p>{audioBookInfo.price} kr</p> */}
              </div>
            </div>

            <div className="book-information-middle">
              <Link to={audioBookInfo.linkToPurchase}>
                <button className="purchase-btn">Purchase</button>
              </Link>
            </div>

            <div style={{ marginBottom: "1em" }} className="book-information-bottom">
              <h2>Description</h2>
              <p>{audioBookInfo.description}</p>
            </div>

            <div className="book-information-bottom">
              <h2>Information</h2>

              <div className="book-details">
                <div className="book-details-item">
                  <h3>Author</h3>
                  <p>{audioBookInfo.author}</p>
                </div>

                <div className="book-details-item">
                  <h3>Language</h3>
                  <p>{audioBookInfo.language}</p>
                </div>

                {audioBookInfo.releaseDate && (
                  <div className="book-details-item">
                    <h3>Second Title</h3>
                    <p>{audioBookInfo.secondTitle}</p>
                  </div>
                )}

                <div className="book-details-item">
                  <h3>Reader</h3>
                  <p>{audioBookInfo.reader}</p>
                </div>

                <div className="book-details-item">
                  <h3>Price</h3>
                  <p>{audioBookInfo.price} sek</p>
                </div>

                {audioBookInfo.time && (
                  <div className="book-details-item">
                    <h3>Time</h3>
                    <p>{audioBookInfo.time}</p>
                  </div>
                )}

                {audioBookInfo.size && (
                  <div className="book-details-item">
                    <h3>Size</h3>
                    <p>{audioBookInfo.size}</p>
                  </div>
                )}

                {audioBookInfo.publisher && (
                  <div className="book-details-item">
                    <h3>Publisher</h3>
                    <p>{audioBookInfo.publisher}</p>
                  </div>
                )}

                {audioBookInfo.releaseDate && (
                  <div className="book-details-item">
                    <h3>Release Date</h3>
                    <p>{audioBookInfo.releaseDate}</p>
                  </div>
                )}

                <div className="book-details-item">
                  <h3>Type</h3>
                  <p>{audioBookInfo.type}</p>
                </div>
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
                  <p className="modal-text">Are you sure you want to post this review?</p>

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
            {audioBookInfo.reviews ? (
              <>
                {/* Map over only the number of reviews specified by displayedReviews */}
                {audioBookInfo.reviews.slice(0, displayedReviews).map((review, i) => {
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
                {audioBookInfo.reviews.length > displayedReviews && (
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
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h5" sx={{ color: "black", mb: 2 }}>
                  Are you sure you want to delete this review?
                </Typography>
                <Button variant="contained" sx={{ mr: 1 }} onClick={deleteReview}>
                  Yes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenDeleteReview(false);
                    setReviewIdToDelete(null);
                  }}
                >
                  No
                </Button>
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
