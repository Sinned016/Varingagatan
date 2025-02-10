import { Box, Modal } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminEditInputs({ data, setData, initalData }) {
  let { type, id } = useParams();
  const [openDeleteData, setOpenDeleteData] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  const navigate = useNavigate();
  console.log(dataToDelete);

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function saveData() {
    const booksCollectionRef = collection(db, "books");
    const audioBooksCollectionRef = collection(db, "audioBooks");

    try {
      if (type === "Bok") {
        const bookDocRef = doc(booksCollectionRef, id);
        await setDoc(bookDocRef, data);
        console.log("Book updated successfully!");
      } else if (type === "Ljudbok") {
        const audioBookDocRef = doc(audioBooksCollectionRef, id);
        await setDoc(audioBookDocRef, data);
        console.log("Audiobook updated successfully!");
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteData(dataId) {
    setDataToDelete(dataId);
    setOpenDeleteData(true);
  }

  async function deleteData() {
    const booksCollectionRef = collection(db, "books");
    const audioBooksCollectionRef = collection(db, "audioBooks");

    try {
      if (type === "Bok") {
        const bookDocRef = doc(booksCollectionRef, dataToDelete);
        const bookDocSnapshot = await getDoc(bookDocRef);

        if (bookDocSnapshot.exists()) {
          // Document exists in books collection, delete it
          await deleteDoc(bookDocRef);
          console.log(
            `Document with ID ${dataToDelete} deleted from books collection`
          );
          setDataToDelete(null);
          setOpenDeleteData(false);
          navigate("/admin");

          return;
        }
      } else if (type === "Ljudbok") {
        const audioBookDocRef = doc(audioBooksCollectionRef, dataToDelete);
        const audioBookDocSnapshot = await getDoc(audioBookDocRef);

        if (audioBookDocSnapshot.exists()) {
          // Document exists in audiobooks collection, delete it
          await deleteDoc(audioBookDocRef);
          console.log(
            `Document with ID ${dataToDelete} deleted from audiobooks collection`
          );
          setDataToDelete(null);
          setOpenDeleteData(false);
          navigate("/admin");

          return;
        }
      }
    } catch (err) {
      setDataToDelete(null);
      console.error(err);
    }
  }

  return (
    <div>
      {data && (
        <div className=" bg-slate-50 border border-neutral-600 p-6 rounded-xl mb-6">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-3xl font-bold">Redigera {type}</h2>

            <div className="flex flex-row justify-evenly gap-4">
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Titel
                </label>
                <input
                  name="title"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.title}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Andratitel
                </label>
                <input
                  name="secondTitle"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.secondTitle}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="flex flex-row justify-evenly gap-4">
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Författare
                </label>
                <input
                  name="author"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.author}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Språk
                </label>
                <input
                  name="language"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.language}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div>
              <label className="font-bold" htmlFor="">
                Beskrivning
              </label>
              <textarea
                name="description"
                className="p-1 border rounded-lg w-full border-neutral-600"
                type="text"
                value={data.description}
                onChange={(e) => handleChange(e)}
              />
            </div>

            {type === "Ljudbok" && data.reader && (
              <div>
                <label className="font-bold" htmlFor="">
                  Uppläsare
                </label>
                <input
                  name="reader"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.reader}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            )}

            <div className="flex flex-row justify-evenly gap-4">
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Pris
                </label>
                <input
                  name="price"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.price}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Utgivningsdatum (YYYY-MM-DD)
                </label>
                <input
                  name="releaseDate"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.releaseDate}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="flex flex-row justify-evenly gap-4">
              {type === "Ljudbok" && data.time && (
                <div className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="">
                    Tid
                  </label>
                  <input
                    name="time"
                    className="p-1 border rounded-lg w-full border-neutral-600"
                    type="text"
                    value={data.time}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              )}

              {type === "Ljudbok" && data.size && (
                <div className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="">
                    Storlek
                  </label>
                  <input
                    name="size"
                    className="p-1 border rounded-lg w-full border-neutral-600"
                    type="text"
                    value={data.size}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-row justify-evenly gap-4">
              {type === "Bok" && data.pages && (
                <div className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="">
                    Sidor
                  </label>
                  <input
                    name="pages"
                    className="p-1 border rounded-lg w-full border-neutral-600"
                    type="text"
                    value={data.pages}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              )}

              {type === "Bok" && data.weight && (
                <div className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="">
                    Vikt
                  </label>
                  <input
                    name="weight"
                    className="p-1 border rounded-lg w-full border-neutral-600"
                    type="text"
                    value={data.weight}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-row justify-evenly gap-4">
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Förlag
                </label>
                <input
                  name="publisher"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.publisher}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Länk för att köpa
                </label>
                <input
                  name="linkToPurchase"
                  className="p-1 border rounded-lg w-full border-neutral-600"
                  type="text"
                  value={data.linkToPurchase}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div>
              <label className="font-bold" htmlFor="">
                Länk till bild
              </label>
              <input
                name="image"
                className="p-1 border rounded-lg w-full border-neutral-600"
                type="text"
                value={data.image}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <button
                className="py-2 px-3 bg-red-500 rounded hover:bg-red-600 text-white transform duration-300"
                onClick={() => saveData()}
              >
                Spara
              </button>
              <button
                className="py-2 px-3 rounded bg-zinc-500 hover:bg-zinc-600 text-white transform duration-300"
                onClick={() => {
                  setData(initalData);
                  navigate("/admin");
                }}
              >
                Stäng
              </button>
            </div>
            <div>
              <button
                className="py-2 px-3 rounded bg-red-700 hover:bg-red-800 text-white transform duration-300"
                onClick={() => handleDeleteData(id)}
              >
                <Trash2 />
              </button>
            </div>
          </div>
          <div>
            <Modal
              open={openDeleteData}
              onClose={() => setOpenDeleteData(false)}
            >
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
                  <h1 className="text-lg font-bold mb-2">
                    Radera {data.type}?
                  </h1>
                  <p className="text-sm  mb-4">
                    Är du säker på att du vill{" "}
                    <span className="font-semibold">Radera</span> denna{" "}
                    {data.type}?
                  </p>

                  <div className="modal-button-container">
                    <button
                      onClick={() => deleteData()}
                      className="mb-2 modal-button rounded-lg bg-red-500 hover:bg-red-600 text-white transform duration-300"
                    >
                      Radera
                    </button>
                    <button
                      className="modal-button rounded-lg bg-zinc-500 hover:bg-zinc-600 text-white transform duration-300"
                      onClick={() => {
                        setOpenDeleteData(false);
                        setDataToDelete(null);
                      }}
                    >
                      Nej
                    </button>
                  </div>

                  <FaTimes
                    className="cursor-pointer absolute top-0 right-0 m-4"
                    size="22"
                    onClick={() => {
                      setOpenDeleteData(false);
                      setDataToDelete(null);
                    }}
                  />
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
