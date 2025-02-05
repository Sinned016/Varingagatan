import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export async function addContentToDatabase(typeOfBook, formValues) {
  const booksCollectionRef = collection(db, "books");
  const audioBooksCollectionRef = collection(db, "audioBooks");

  try {
    if (typeOfBook === "books") {
      const bookData = {
        ...formValues,
        type: "Bok",
      };

      await addDoc(booksCollectionRef, bookData);
    } else if (typeOfBook === "audioBooks") {
      const audioBookData = {
        ...formValues,
        type: "Ljudbok",
      };

      await addDoc(audioBooksCollectionRef, audioBookData);
    }
  } catch (err) {
    console.error(err);
  }
}
