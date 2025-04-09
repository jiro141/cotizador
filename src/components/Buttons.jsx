import React, { useState, useContext, useRef } from "react";
import { MyContext } from "../context/Context";
import img1 from "../img/Recurso 11.svg";
import img2 from "../img/Group 44.svg";
import img3 from "../img/Recurso 22.svg";
import img4 from "../img/Recurso 52.svg";
import img5 from "../img/Group 64.svg";
import img6 from "../img/Group 46.svg";
import img7 from "../img/Group 63.svg";
import img8 from "../img/Group 48.svg";
import img9 from "../img/Group 65 (1).svg"
import img10 from "../img/Group 66.svg"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Buttons() {
  const { state, setState } = useContext(MyContext);
  const [isSliderActive, setIsSliderActive] = useState(false); // Estado para cambiar de grid a slider
  const containerRef = useRef(null);

  // Función para actualizar el estado en el contexto y activar el slider
  const handleButtonClick = (buttonType) => {
    setState(buttonType);
    setIsSliderActive(true); // Activamos el slider cuando se hace clic en un botón
  };

  // Funciones de navegación para el slider
  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div
      className={`button-container-wrapper ${
        isSliderActive ? "slider" : "grid"
      }`}
    >
      {isSliderActive && (
        <button
          className="slider-button slider-button-left"
          onClick={scrollLeft}
        >
          <IoIosArrowBack size={24} color="#ff5722" />
        </button>
      )}
      <div
        className={`button-container ${
          isSliderActive ? "button-container-slider" : "button-container-grid"
        }`}
        ref={containerRef}
      >
        <button
          className={`button ${
            state === "LandingPageClickThrough" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("LandingPageClickThrough")}
        >
          <img src={img9} alt="Landing Page Click Through" />
          <p className="button-text">Landing Page Click through</p>
        </button>
        <button
          className={`button ${state === "LandingBasica" ? "active" : ""}`}
          onClick={() => handleButtonClick("LandingBasica")}
        >
          <img src={img1} alt="Web de Inicio" />
          <p className="button-text">Web de Inicio (Landing básica)</p>
        </button>
        <button
          className={`button ${state === "WebDeReservaciones" ? "active" : ""}`}
          onClick={() => handleButtonClick("WebDeReservaciones")}
        >
          <img src={img2} alt="Web de Reservaciones" />
          <p className="button-text">Web de Reservaciones</p>
        </button>
        <button
          className={`button ${state === "PaginaCorporativa" ? "active" : ""}`}
          onClick={() => handleButtonClick("PaginaCorporativa")}
        >
          <img src={img7} alt="Página Corporativa" />
          <p className="button-text">Página Corporativa</p>
        </button>
        <button
          className={`button ${state === "WebInformativa" ? "active" : ""}`}
          onClick={() => handleButtonClick("WebInformativa")}
        >
          <img src={img10} alt="Web Informativa" />
          <p className="button-text">Web Informativa</p>
        </button>
        <button
          className={`button ${state === "Blog" ? "active" : ""}`}
          onClick={() => handleButtonClick("Blog")}
        >
          <img src={img4} alt="Blog" />
          <p className="button-text">Blog</p>
        </button>
        <button
          className={`button ${state === "PaginaDeMembresia" ? "active" : ""}`}
          onClick={() => handleButtonClick("PaginaDeMembresia")}
        >
          <img src={img6} alt="Página de Membresía" />
          <p className="button-text">Página de Membresía</p>
        </button>
        <button
          className={`button ${state === "Foro" ? "active" : ""}`}
          onClick={() => handleButtonClick("Foro")}
        >
          <img src={img8} alt="Foro" />
          <p className="button-text">Foro</p>
        </button>
        <button
          className={`button ${state === "eCommerce" ? "active" : ""}`}
          onClick={() => handleButtonClick("eCommerce")}
        >
          <img src={img5} alt="eCommerce" />
          <p className="button-text">eCommerce</p>
        </button>
      </div>
      {isSliderActive && (
        <button
          className="slider-button slider-button-right"
          onClick={scrollRight}
        >
          <IoIosArrowForward size={24} color="#ff5722" />
        </button>
      )}
    </div>
  );
}
