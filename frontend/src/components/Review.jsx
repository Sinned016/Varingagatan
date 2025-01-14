import React, { useState } from "react";
import useAuthState from "./useAuthState";
import { Box, Modal } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import StarRating from "./StarRating";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";

export default function Review({ submitTrigger, setSubmitTrigger }) {
  let { id } = useParams();
  const { signedInUser } = useAuthState(); // Use the custom hook to get authentication state

  const [open, setOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewTitleError, setReviewTitleError] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewContentError, setReviewContentError] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewRatingError, setReviewRatingError] = useState("");
  const [showReview, setShowReview] = useState(false);

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
    setShowReview(!showReview);
  }

  return (
    <>
      {signedInUser ? (
        <>
          <button
            onClick={() => setShowReview(!showReview)}
            className="p-4 w-full bg-slate-300 hover:bg-slate-400 rounded-lg mb-6"
          >
            Skriv recension
          </button>

          {showReview && (
            <div className=" border border-black p-4 rounded-lg bg-slate-100 mb-6">
              <form className="flex flex-col" onSubmit={openModal}>
                <h2 className="text-xl mb-2 font-bold">Skriv Recension</h2>
                <label className="mb-1">Recensions titel</label>
                <p className="error-message">{reviewTitleError}</p>
                <input
                  placeholder={"Skriv din titel här..."}
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  type="text"
                  className="p-2 border border-black rounded-lg mb-4"
                />

                <label className="mb-1">Recensions betyg</label>
                <p className="error-message">{reviewRatingError}</p>

                <StarRating
                  reviewRating={reviewRating}
                  setReviewRating={setReviewRating}
                />

                <label className="mb-1 mt-4">Recensions innehåll</label>
                <p className="error-message">{reviewContentError}</p>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder={"Skriv ditt innehåll här..."}
                  rows={3} // Initial number of rows
                  className="p-2 border border-black rounded-lg mb-4"
                />

                <div className="flex gap-2">
                  <button
                    className="py-2 px-3 bg-red-500 rounded hover:bg-red-600 text-white"
                    type="submit"
                  >
                    Skicka
                  </button>
                  <button
                    className="py-2 px-3 rounded bg-zinc-500 hover:bg-zinc-600 text-white"
                    onClick={handleCancelReview}
                  >
                    Stäng
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
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

              boxShadow: 24,

              overflow: "auto",
              outline: "none",
            }}
            className="bg-slate-100 rounded-lg p-6"
          >
            <div>
              <h3 className="text-lg font-bold mb-2">Post Review?</h3>
              <p className="text-sm  mb-4">
                Are you sure you want to{" "}
                <span style={{ fontWeight: "bold" }}>post</span> this review?
              </p>

              <div className="modal-button-container">
                <button
                  className="mb-2 modal-button rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleSubmitReview}
                >
                  Yes
                </button>
                <button
                  className="modal-button rounded-lg bg-zinc-500 hover:bg-zinc-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  No
                </button>
              </div>

              <FaTimes
                className="cursor-pointer absolute top-0 right-0 m-4"
                size="22"
                onClick={() => setOpen(false)}
              />
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
