import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <div className="bg-red-500 text-white p-4">
      Esto debería tener un fondo rojo.
    </div>
  </StrictMode>
);
