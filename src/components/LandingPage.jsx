import { useEffect, useState } from "react";
import {db} from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";


export default function LandingPage() {

    const [books, setbooks] = useState([]);

    const booksCollectionRef = collection(db, "books")
  
    useEffect(() =>  {
      async function getBooks() {
        try {
          const data = await getDocs(booksCollectionRef)
          const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
          console.log(filteredData)
          setbooks(filteredData);
        } catch(err) {
          console.error(err)
        }
      }
  
      getBooks();
    }, [booksCollectionRef])
  

    console.log(books)
    
  return (
    <>
        <h1>Väringasagan</h1>
    </>
  )
}
