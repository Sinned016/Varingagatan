import { useNavigate, useParams } from "react-router-dom";
import useAuthState from "../useAuthState";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminEdit() {
  let { type, id } = useParams();
  const navigate = useNavigate();
  const { signedInUser, isAdmin, loading } = useAuthState();
  const [initalData, setInitialData] = useState(null);
  const [data, setData] = useState(null);
  const [description, setDescription] = useState(true);
  const [openDeleteData, setOpenDeleteData] = useState(false);
  console.log(data);

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
        if (type === "Bok") {
          fetchedData = await getDoc(bookDocRef);
        } else if (type === "Ljudbok") {
          fetchedData = await getDoc(audioBookDocRef);
        }

        if (fetchedData && fetchedData.exists()) {
          const data = fetchedData.data();
          setInitialData(data);
          setData(data);
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

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="bg-slate-50 p-6">
      {data && (
        <div className="">
          <div className="flex flex-col sm:flex-row mb-6">
            <div className="mr-6 flex-shrink-0 mb-4 sm:mb-0 sm:pb-10">
              <img
                className={
                  data.type === "Bok"
                    ? " h-72 md:h-96 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                    : "w-full max-w-52 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                }
                src={data.image}
                alt=""
              />

              <button className="mt-5 px-3 py-2 bg-red-500 hover:bg-red-600 rounded text-white w-full mb-4">
                Radera
              </button>
            </div>

            {/* Lägg till information om ljudböcker i ternaries här */}
            <div className="flex flex-col flex-grow">
              <h1 className="text-4xl font-semibold">{data.title}</h1>
              <div className="flex flex-row">
                <p className="mr-2">{data.author}</p>
                <p>{data.releaseDate}</p>
              </div>
              <p className="font-semibold text-lg">{data.price} kr</p>

              <div className="flex flex-row justify-evenly mt-4">
                <button
                  className={description && "font-semibold"}
                  onClick={() => setDescription(true)}
                >
                  Beskrivning
                </button>
                <button
                  className={!description && "font-semibold"}
                  onClick={() => setDescription(false)}
                >
                  Specifikationer
                </button>
              </div>

              <div className="border mt-2 border-muted-foreground"></div>

              {description && (
                <div className="mt-5">
                  <p>{data.description}</p>
                </div>
              )}

              {!description && (
                <div className="mt-5 flex flex-row justify-between">
                  <div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Format:</p>
                      <p>{data.type}</p>
                    </div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Språk:</p>
                      <p>{data.language}</p>
                    </div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Antal sidor:</p>
                      <p>{data.pages}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Pris:</p>
                      <p>{data.price} kr</p>
                    </div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Vikt:</p>
                      <p>{data.weight}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Utgivningsdatum:</p>
                      <p>{data.releaseDate}</p>
                    </div>
                    <div className="flex flex-row">
                      <p className="font-semibold mr-1">Utgivare:</p>
                      <p>{data.publisher}</p>
                    </div>
                  </div>
                </div>
              )}

              <div></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-3xl font-bold">Redigera {type}</h2>

            <div className="flex flex-row justify-evenly gap-4">
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Titel
                </label>
                <input
                  name="title"
                  className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
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
                className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
                  type="text"
                  value={data.price}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="">
                  Utgivningsdatum
                </label>
                <input
                  name="releaseDate"
                  className="p-1 border rounded-xl w-full"
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
                    className="p-1 border rounded-xl w-full"
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
                    className="p-1 border rounded-xl w-full"
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
                    className="p-1 border rounded-xl w-full"
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
                    className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
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
                  className="p-1 border rounded-xl w-full"
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
                className="p-1 border rounded-xl w-full"
                type="text"
                value={data.image}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="py-2 px-3 bg-red-500 rounded hover:bg-red-600 text-white"
              onClick={() => saveData()}
            >
              Spara
            </button>
            <button
              className="py-2 px-3 rounded bg-zinc-500 hover:bg-zinc-600 text-white"
              onClick={() => {
                setData(initalData);
                navigate("/admin");
              }}
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
