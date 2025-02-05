import { useNavigate, useParams } from "react-router-dom";
import useAuthState from "../useAuthState";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Box, Trash2 } from "lucide-react";
import AdminEditInputs from "./AdminEditInputs";
import { Modal } from "@mui/material";
import { FaTimes } from "react-icons/fa";

export default function AdminEdit() {
  let { type, id } = useParams();
  const navigate = useNavigate();
  const { signedInUser, isAdmin, loading } = useAuthState();
  const [initalData, setInitialData] = useState(null);
  const [data, setData] = useState(null);
  const [description, setDescription] = useState(true);

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

  return (
    <div className="p-6 sm:p-0 sm:pt-6">
      {data && (
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

            <a
              href={data.linkToPurchase}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="mt-5 px-3 py-2 bg-red-500 hover:bg-red-600 rounded text-white w-full mb-4 transform duration-300">
                Köp {type === "Bok" ? "boken" : "ljudboken"}
              </button>
            </a>
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
          </div>
        </div>
      )}

      <AdminEditInputs data={data} setData={setData} initalData={initalData} />
    </div>
  );
}
