import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from './components/LandingPage.jsx';
import Auth from './components/auth.jsx';

export const pages = [
  {path: "/", label: "LandingPage", element: <LandingPage />},
  {path: "auth", label: "Auth", element: <Auth /> },
]

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: pages,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
