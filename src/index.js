import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MyProvider } from "./context/Context";
import { BrowserRouter } from "react-router-dom"; // Asegúrate de importar BrowserRouter

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve tu aplicación en BrowserRouter */}
      <MyProvider>
        <App />
      </MyProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
