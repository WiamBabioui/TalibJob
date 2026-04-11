import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';
// ✅ Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Bootstrap JS (OBLIGATOIRE pour le menu)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);