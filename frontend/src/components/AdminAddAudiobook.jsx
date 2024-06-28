import { Box, Modal } from "@mui/material";

export default function AdminAddAudiobook({}) {
  return (
    <div>
      <Modal open={openNewData} onClose={() => setOpenNewData(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: 600,
            bgcolor: "#333",
            boxShadow: 24,
            p: 4,
            borderRadius: "1em",
            overflow: "auto",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: ".5em" }}>Add New Content</h1>

          <div className="admin-add-content">
            <label htmlFor="">Title</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Title..." />

            <label htmlFor="">Second Title</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Second title..." />

            <label htmlFor="">Author</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Author..." />

            <label htmlFor="">Description</label>
            <textarea style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Description..." />

            <label htmlFor="">Type</label>
            <select name="" id="" style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Type...">
              <option value="book">Book</option>
              <option value="audioBook">Audiobook</option>
            </select>

            <label htmlFor="">Language</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Language..." />

            <label htmlFor="">Price</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Price..." />

            <label htmlFor="">Pages</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Pages..." />

            <label htmlFor="">Weight</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Weight..." />

            <label htmlFor="">Release Date</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Release date..." />

            <label htmlFor="">Publisher</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Publisher..." />

            <label htmlFor="">Link to Purchase</label>
            <input style={{ padding: ".3em", width: "100%" }} type="text" placeholder="Link to purchase..." />
          </div>

          <div className="admin-add-buttons">
            <button className="admin-add-cancel">Cancel</button>
            <button className="admin-add-confirm">Add</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
