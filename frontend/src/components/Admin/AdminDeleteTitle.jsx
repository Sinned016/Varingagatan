import { Box, Modal } from "@mui/material";

export default function AdminDeleteTitle() {
  async function deleteData() {
    const booksCollectionRef = collection(db, "books");
    const audioBooksCollectionRef = collection(db, "audioBooks");

    try {
      // Check if the document exists in the books collection
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
        setTrigger((prev) => !prev);
        return;
      }

      // Check if the document exists in the audiobooks collection
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
        setTrigger((prev) => !prev);
        return;
      }
    } catch (err) {
      setDataToDelete(null);
      console.error(err);
    }
  }

  return (
    <div>
      <div>
        <Modal open={openDeleteData} onClose={() => setOpenDeleteData(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "#333",
              boxShadow: 24,
              p: 4,
              borderRadius: "1em",
              overflow: "auto",
              outline: "none",
            }}
          >
            <h1 className="h3-title text-center">Delete</h1>
            <p className="modal-text">Are you sure you want to delete this?</p>

            <div className="modal-button-container">
              <button
                style={{ marginBottom: ".5em" }}
                className="modal-button bg-green-500 hover:bg-green-600 active:bg-green-700 text-black"
                onClick={() => deleteData()}
              >
                Yes
              </button>
              <button
                className="modal-button bg-red-500 hover:bg-red-600 active:bg-red-700 text-black"
                onClick={() => {
                  setOpenDeleteData(false);
                  setDataToDelete(null);
                }}
              >
                No
              </button>
            </div>

            <FaTimes
              className="modal-close"
              size="25"
              onClick={() => {
                setOpenDeleteData(false);
                setDataToDelete(null);
              }}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
}
