import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainContent from "./MainContent";
import SmartSolutions from "./SmartSolutions";
import webEsencial from "../img/sitio-web 1.svg";
import smart from "../img/innovacion 1.svg";
import digital from "../img/soporte-en-linea 1.svg";
import informes from "../img/solicitud 1.svg";
import globo from "../img/globe_location_pin (1).svg";
import Modal from "../components/Modal";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Evita errores si `localStorage` es null
  const userTipo = user?.tipoUser || "";

  const goWebEsencial = () => {
    navigate("/webEsencial");
  };

  const goToAbout = () => {
    navigate("/smarSolution");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir y cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Modal que se muestra al hacer clic en el botón País */}
      <Modal isOpen={isModalOpen} onClose={toggleModal} />

      {/* Botón en la parte superior derecha que abre el modal */}
      {userTipo === "Detip" && (
        <>
          <a onClick={toggleModal} className="boton-pais">
            País
            <img src={globo} alt="Globo de ubicación" />
          </a>
        </>
      )}

      <div className="centrar">
        <h3 className="titulo">Productos</h3>
        <div className="button-container-wrapper grid">
          {/* ✅ Siempre muestra el botón "Web Esencial" */}
          <button className="button" onClick={goWebEsencial}>
            <img src={webEsencial} alt="Web Esencial" />
            <p className="button-text">Web Esencial</p>
          </button>

          {/* ✅ Solo muestra los otros botones si `userTipo` es "Detip" */}
          {userTipo === "Detip" && (
            <>
              <button className="button" onClick={goToAbout}>
                <img src={smart} alt="Smart Solutions" />
                <p className="button-text">Smart Solution</p>
              </button>
              <button className="button" onClick={goToAbout}>
                <img src={digital} alt="Digital Support" />
                <p className="button-text">Digital Support</p>
              </button>
              <button className="button" onClick={goToAbout}>
                <img src={informes} alt="Informes" />
                <p className="button-text">Informes</p>
              </button>
            </>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/webEsencial" element={<MainContent />} />
        <Route path="/smarSolution" element={<SmartSolutions />} />
      </Routes>
    </div>
  );
}
