import { Timestamp, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import useAuthState from "./useAuthState";
import { Button, Modal, Box, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import likeWhite from "../assets/icons/likeWhite.png";
import likeBlue from "../assets/icons/likeBlue.png";

export default function Bookinfo() {
  let { id } = useParams();
  const [bookInfo, setBookInfo] = useState();
  const { signedInUser, isAdmin } = useAuthState(); // Use the custom hook to get authentication state

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewTitleError, setReviewTitleError] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewContentError, setReviewContentError] = useState("");
  const [open, setOpen] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState(5);

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
      timestamp: newTimestamp,
      likes: [],
    };

    try {
      await updateDoc(bookDocRef, {
        reviews: arrayUnion(payloadData), // Add the new review to the existing reviews array
      });

      setReviewTitle("");
      setReviewContent("");
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
    console.log(id);
    const bookDocRef = doc(db, "books", id);
    //const newTimestamp = Timestamp.now();

    try {
      const bookSnapshot = await getDoc(bookDocRef);
      const bookData = bookSnapshot.data();
      console.log(bookData);
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

  return (
    <div className="page-container">
      {bookInfo ? (
        <div>
          <div className="book-information-container">
            <div className="book-information-top">
              <img src={bookInfo.image} alt="" />
              <div>
                <h1>{bookInfo.title}</h1>
                <p>{bookInfo.author}</p>
                <p>{bookInfo.language}</p>
                <p>{bookInfo.price} kr</p>
              </div>
            </div>

            <div className="book-information-middle">
              <Link to={bookInfo.linkToPurchase}>
                <button>Purchase</button>
              </Link>
            </div>

            <div className="book-information-bottom">
              <h2>Description</h2>
              <p>{bookInfo.description}</p>
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

                {/* Add score here */}

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
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h5" sx={{ color: "black", mb: 2 }}>
                  Are you sure you want to post this review?
                </Typography>
                <Button variant="contained" sx={{ mr: 1 }} onClick={handleSubmitReview}>
                  Submit
                </Button>
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Close
                </Button>
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
                      <div className="email-date">
                        <p>BY {review.email}</p>
                        <p>{new Date(review.timestamp.seconds * 1000).toLocaleString()}</p>
                      </div>
                      <p>{review.score}</p>
                      <p className="margin-bot review-content">{review.reviewContent}</p>

                      <div className="reviews-rating-container">
                        <p>{review.likes && review.likes.length > 0 ? review.likes.length : ""}</p>

                        {signedInUser ? (
                          <div
                            className={review.likes && review.likes.includes(signedInUser?.uid) ? "liked" : "unliked"}
                            onClick={(e) => rateReview(e, review.reviewId, "like")}
                          >
                            {review.likes && review.likes.includes(signedInUser.uid) ? (
                              <img className="rate-icon" src={likeWhite} alt="" />
                            ) : (
                              <img className="rate-icon" src={likeBlue} alt="" />
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
