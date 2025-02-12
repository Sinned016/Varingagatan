import React, { useState } from "react";
import useAuthState from "./useAuthState";
import { Box, Modal } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import StarRating from "./StarRating";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Review({
  submitTrigger,
  setSubmitTrigger,
  typeofBook,
}) {
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
      setReviewTitleError("Vänligen ge en titel för din recension.");
      return;
    } else {
      setReviewTitleError("");
    }

    if (reviewRating === 0) {
      setReviewRatingError("Vänligen ange ett betyg för din recension.");
      return;
    } else {
      setReviewRatingError("");
    }

    if (!reviewContent) {
      setReviewContentError(
        "Vänligen lämna din recension innan du skickar in."
      );
      return;
    } else {
      setReviewContentError("");
    }

    setOpen(true);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();

    const bookDocRef = doc(db, "books", id);
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
      if (typeofBook === "book") {
        await updateDoc(bookDocRef, {
          reviews: arrayUnion(payloadData),
        });
      } else if (typeofBook === "audioBook") {
        await updateDoc(audioBookDocRef, {
          reviews: arrayUnion(payloadData),
        });
      }

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
          <Button
            onClick={() => setShowReview(!showReview)}
            className="p-6 w-full rounded-lg mb-6 transform duration-300"
          >
            Skriv recension
          </Button>

          <AnimatePresence>
            {showReview && (
              <motion.div
                className=" border border-neutral-600  p-4 rounded-lg bg-card mb-6 "
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form className="flex flex-col" onSubmit={openModal}>
                  <h2 className="text-xl mb-2 font-bold">Skriv Recension</h2>
                  <label className="mb-1">Recensions titel</label>
                  <p className="error-message">{reviewTitleError}</p>
                  <input
                    placeholder={"Skriv din titel här..."}
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    type="text"
                    className="p-2 border rounded-lg w-full border-neutral-600 mb-4 bg-card"
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
                    className="p-2 border rounded-lg w-full border-neutral-600 mb-4 bg-card"
                  />

                  <div className="flex gap-2">
                    <Button
                      className="py-2 px-3 bg-red-500 rounded hover:bg-red-600 text-white transform duration-300"
                      type="submit"
                    >
                      Skicka
                    </Button>
                    <Button
                      className="py-2 px-3 rounded bg-zinc-500 hover:bg-zinc-600 text-white transform duration-300"
                      onClick={handleCancelReview}
                    >
                      Stäng
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
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
              <h3 className="text-lg font-bold mb-2">Skicka recension?</h3>
              <p className="text-sm  mb-4">
                Är då säker på att du vill{" "}
                <span style={{ fontWeight: "bold" }}>skicka</span> den här
                recensionen?
              </p>

              <div className="modal-button-container">
                <Button
                  className="mb-2 modal-button rounded-lg bg-green-500 hover:bg-green-600 text-white transform duration-300 w-full"
                  onClick={handleSubmitReview}
                >
                  Ja
                </Button>
                <Button
                  className="modal-button rounded-lg bg-zinc-500 hover:bg-zinc-600 text-white transform duration-300 w-full"
                  onClick={() => setOpen(false)}
                >
                  Nej
                </Button>
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
