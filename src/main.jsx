import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Home from "./components/Home.jsx";
import Bookinfo from "./components/Bookinfo.jsx";

export const pages = [
  { path: "/login", label: "Login", element: <Login /> },
  { path: "register", label: "Register", element: <Register /> },
  { path: "/", label: "Home", element: <Home /> },
  { path: "book/:id", label: "Book", element: <Bookinfo /> },
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
