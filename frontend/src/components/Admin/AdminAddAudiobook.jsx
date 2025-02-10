import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { addContentToDatabase } from "../../functions/addContentToDatabase";
import AdminNav from "./AdminNav";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminAddAudiobook() {
  const initialFormValues = {
    title: "", // required
    secondTitle: "",
    author: "", // required
    description: "", // required
    language: "", // required
    reader: "", // required
    price: "", // required
    time: "",
    size: "",
    releaseDate: "",
    publisher: "",
    linkToPurchase: "", // required
    image: "", // required
  };

  const initialErrors = {
    title: false,
    author: false,
    description: false,
    language: false,
    reader: false,
    price: false,
    linkToPurchase: false,
    image: false,
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  const [openAddAudiobbook, setOpenAddAudiobook] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddAudiobook() {
    const newErrors = {
      title: formValues.title === "",
      author: formValues.author === "",
      description: formValues.description === "",
      language: formValues.language === "",
      reader: formValues.reader === "",
      price: formValues.price === "",
      linkToPurchase: formValues.linkToPurchase === "",
      image: formValues.image === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setOpenAddAudiobook(false);
      return;
    } else {
      addContentToDatabase("audioBooks", formValues);
      setFormValues(initialFormValues);
      setErrors(initialErrors);
      navigate("/admin");
    }
  }

  return (
    <div className="p-6 sm:p-0 sm:pt-6">
      <AdminNav />

      <div className="flex flex-col gap-2 mb-6 bg-slate-50 border border-neutral-600 p-6 rounded-xl">
        <h1 className="text-3xl font-bold">Lägg till ljudbok</h1>
        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Titel*
            </label>
            {/* {errors.title && <p>Please add a title</p>} */}
            <input
              className={
                errors.title
                  ? "p-1 border rounded-lg w-full border-red-500"
                  : "p-1 border rounded-lg w-full border-neutral-600"
              }
              name="title"
              type="text"
              value={formValues.title}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Andratitel
            </label>
            <input
              className="p-1 border rounded-lg w-full border-neutral-600"
              name="secondTitle"
              type="text"
              value={formValues.secondTitle}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Författare*
            </label>
            <input
              className={
                errors.author
                  ? "p-1 border rounded-lg w-full border-red-500"
                  : "p-1 border rounded-lg w-full border-neutral-600"
              }
              name="author"
              type="text"
              value={formValues.author}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Språk*
            </label>
            <input
              className={
                errors.language
                  ? "p-1 border rounded-lg w-full border-red-500"
                  : "p-1 border rounded-lg w-full border-neutral-600"
              }
              name="language"
              type="text"
              value={formValues.language}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="" className="font-bold">
            Beskrivning*
          </label>
          <textarea
            className={
              errors.description
                ? "p-1 border rounded-lg w-full border-red-500"
                : "p-1 border rounded-lg w-full border-neutral-600"
            }
            name="description"
            type="text"
            value={formValues.description}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div>
          <label htmlFor="" className="font-bold">
            Uppläsare*
          </label>
          <input
            className={
              errors.reader
                ? "p-1 border rounded-lg w-full border-red-500"
                : "p-1 border rounded-lg w-full border-neutral-600"
            }
            name="reader"
            type="text"
            value={formValues.reader}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Pris*
            </label>
            <input
              className={
                errors.price
                  ? "p-1 border rounded-lg w-full border-red-500"
                  : "p-1 border rounded-lg w-full border-neutral-600"
              }
              name="price"
              type="text"
              value={formValues.price}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Utgivningsdatum (YYYY-MM-DD)
            </label>
            <input
              className="p-1 border rounded-lg w-full border-neutral-600"
              name="releaseDate"
              type="text"
              value={formValues.releaseDate}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Tid
            </label>
            <input
              className={"p-1 border rounded-lg w-full border-neutral-600"}
              name="time"
              type="text"
              value={formValues.time}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Storlek
            </label>
            <input
              className="p-1 border rounded-lg w-full border-neutral-600"
              name="size"
              type="text"
              value={formValues.size}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Förlag
            </label>
            <input
              className="p-1 border rounded-lg w-full border-neutral-600"
              name="publisher"
              type="text"
              value={formValues.publisher}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="" className="font-bold">
              Länk för att köpa*
            </label>
            <input
              className={
                errors.linkToPurchase
                  ? "p-1 border rounded-lg w-full border-red-500"
                  : "p-1 border rounded-lg w-full border-neutral-600"
              }
              name="linkToPurchase"
              type="text"
              value={formValues.linkToPurchase}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="" className="font-bold">
            Länk till bild*
          </label>
          <input
            className={
              errors.image
                ? "p-1 border rounded-lg w-full border-red-500"
                : "p-1 border rounded-lg w-full border-neutral-600"
            }
            name="image"
            type="text"
            value={formValues.image}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setOpenAddAudiobook(true)}
            className="py-2 px-3 bg-green-500 rounded hover:bg-green-600 text-white transform duration-300"
          >
            Lägg till
          </button>
          <button
            className="py-2 px-3 bg-zinc-500 rounded hover:bg-zinc-600 text-white transform duration-300"
            onClick={() => {
              setFormValues(initialFormValues);
              setErrors(initialErrors);
            }}
          >
            Nollställ
          </button>
        </div>
      </div>

      <div>
        <Modal
          open={openAddAudiobbook}
          onClose={() => setOpenAddAudiobook(false)}
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
              <h1 className="text-lg font-bold mb-2">Lägg till ljudbok?</h1>
              <p className="text-sm  mb-4">
                Är du säker på att du vill{" "}
                <span className="font-semibold">lägga till</span> denna ljudbok?
              </p>

              <div className="modal-button-container">
                <button
                  onClick={() => handleAddAudiobook()}
                  className="mb-2 modal-button rounded-lg bg-green-500 hover:bg-green-600 text-white transform duration-300"
                >
                  Lägg till
                </button>
                <button
                  className="modal-button rounded-lg bg-zinc-500 hover:bg-zinc-600 text-white transform duration-300"
                  onClick={() => {
                    setOpenAddAudiobook(false);
                  }}
                >
                  Nej
                </button>
              </div>

              <FaTimes
                className="cursor-pointer absolute top-0 right-0 m-4"
                size="22"
                onClick={() => {
                  setOpenAddAudiobook(false);
                }}
              />
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
