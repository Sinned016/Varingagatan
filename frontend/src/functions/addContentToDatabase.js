import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export async function addContentToDatabase(typeOfBook, formValues) {
    const booksCollectionRef = collection(db, "books");
    const audioBooksCollectionRef = collection(db, "audioBooks");

    try {
        if (typeOfBook === "books") {
            const bookData = {
                ...formValues,
                type: 'Book',
            };

            await addDoc(booksCollectionRef, bookData)
        } else if (typeOfBook === "audioBooks") {
            const audioBookData = {
                ...formValues,
                type: 'Audiobook',
            };

            await addDoc(audioBooksCollectionRef, audioBookData)
        }
    } catch (err) {
        console.error(err);
    }
}