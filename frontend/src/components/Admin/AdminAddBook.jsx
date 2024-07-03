import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { addContentToDatabase } from "../../functions/addContentToDatabase";

export default function AdminAddBook({ addBook, setAddBook, setTrigger }) {
  const initialFormValues = {
    title: "", // required
    secondTitle: "",
    author: "", // required
    description: "", // required
    language: "", // required
    price: "", // required
    pages: "",
    weight: "",
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
    price: false,
    linkToPurchase: false,
    image: false,
    pages: false,
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddBook() {
    const newErrors = {
      title: formValues.title === "",
      author: formValues.author === "",
      description: formValues.description === "",
      language: formValues.language === "",
      price: formValues.price === "",
      linkToPurchase: formValues.linkToPurchase === "",
      image: formValues.image === "",
      pages: formValues.pages === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    } else {
      addContentToDatabase("books", formValues);

      setAddBook(false);
      setFormValues(initialFormValues);
      setErrors(initialErrors);
      setTrigger((prev) => !prev);
    }
  }

  return (
    <div>
      <Modal
        open={addBook}
        onClose={() => {
          setAddBook(false);
          setFormValues(initialFormValues);
          setErrors(initialErrors);
        }}
      >
        <div className="admin-add-book">
          <h1 style={{ textAlign: "center", marginTop: ".5em", marginBottom: ".5em" }}>Add New Book</h1>

          <div className="admin-add-content">
            <label htmlFor="">Title</label>
            {/* {errors.title && <p>Please add a title</p>} */}
            <input
              className={errors.title ? "error-input" : "admin-content-input"}
              name="title"
              type="text"
              placeholder="Title..."
              value={formValues.title}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Second Title</label>
            <input
              className="admin-content-input"
              name="secondTitle"
              type="text"
              placeholder="Second title..."
              value={formValues.secondTitle}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Author</label>
            <input
              className={errors.author ? "error-input" : "admin-content-input"}
              name="author"
              type="text"
              placeholder="Author..."
              value={formValues.author}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Description</label>
            <textarea
              className={errors.description ? "error-input" : "admin-content-input"}
              name="description"
              type="text"
              placeholder="Description..."
              value={formValues.description}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Language</label>
            <input
              className={errors.language ? "error-input" : "admin-content-input"}
              name="language"
              type="text"
              placeholder="Language..."
              value={formValues.language}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Price</label>
            <input
              className={errors.price ? "error-input" : "admin-content-input"}
              name="price"
              type="text"
              placeholder="Price..."
              value={formValues.price}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Pages</label>
            <input
              className={errors.pages ? "error-input" : "admin-content-input"}
              name="pages"
              type="text"
              placeholder="Pages..."
              value={formValues.pages}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Weight</label>
            <input
              className="admin-content-input"
              name="weight"
              type="text"
              placeholder="Weight..."
              value={formValues.weight}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Release Date (YYYY-MM-DD)</label>
            <input
              className="admin-content-input"
              name="releaseDate"
              type="text"
              placeholder="Release date..."
              value={formValues.releaseDate}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Publisher</label>
            <input
              className="admin-content-input"
              name="publisher"
              type="text"
              placeholder="Publisher..."
              value={formValues.publisher}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Link to Purchase</label>
            <input
              className={errors.linkToPurchase ? "error-input" : "admin-content-input"}
              name="linkToPurchase"
              type="text"
              placeholder="Link to purchase..."
              value={formValues.linkToPurchase}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="">Link to Image of Book</label>
            <input
              className={errors.image ? "error-input" : "admin-content-input"}
              name="image"
              type="text"
              placeholder="Link to book image..."
              value={formValues.image}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="admin-add-buttons">
            <button
              className="admin-add-cancel"
              onClick={() => {
                setAddBook(false);
                setFormValues(initialFormValues);
                setErrors(initialErrors);
              }}
            >
              Cancel
            </button>
            <button className="admin-add-confirm" onClick={handleAddBook}>
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
