import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import "./styles/styles.css";
import "./styles/header.css";
import "./styles/register.css";
import "./styles/home.css";
import "./styles/books.css";
import "./styles/about.css";
import "./styles/admin.css";
import "./styles/footer.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Home from "./components/Home.jsx";
import Bookinfo from "./components/Bookinfo.jsx";
import AudioBookinfo from "./components/AudioBookinfo.jsx";
import Books from "./components/Books.jsx";
import AudioBooks from "./components/AudioBooks.jsx";
import SearchPage from "./components/SearchPage.jsx";
import About from "./components/About.jsx";
import AdminHome from "./components/Admin/AdminHome.jsx";
import AdminEdit from "./components/Admin/AdminEdit.jsx";
import AdminAddBook from "./components/Admin/AdminAddBook.jsx";
import AdminAddAudiobook from "./components/Admin/AdminAddAudiobook.jsx";

export const pages = [
  { path: "/login", label: "Login", element: <Login /> },
  { path: "/register", label: "Register", element: <Register /> },
  { path: "/", label: "Home", element: <Home /> },
  { path: "/books", label: "Books", element: <Books /> },
  { path: "/audioBooks", label: "Audiobooks", element: <AudioBooks /> },
  { path: "/book/:id", label: "Book", element: <Bookinfo /> },
  { path: "/audioBook/:id", label: "Audiobook", element: <AudioBookinfo /> },
  { path: "/books/search", label: "Search", element: <SearchPage /> },
  { path: "/about", label: "About", element: <About /> },
  { path: "/admin", label: "Admin", element: <AdminHome /> },
  {
    path: "/admin/:type/:id",
    label: "Admin edit title",
    element: <AdminEdit />,
  },
  {
    path: "/admin/add-book",
    label: "Admin add book",
    element: <AdminAddBook />,
  },
  {
    path: "/admin/add-audiobook",
    label: "Admin add audiobook",
    element: <AdminAddAudiobook />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: pages,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
