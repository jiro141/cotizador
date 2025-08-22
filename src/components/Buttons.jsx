import React, { useContext, useRef } from "react";
import img1 from "../img/Recurso 11.svg";
import img2 from "../img/Group 44.svg";
import img3 from "../img/Group 65 (1).svg";
import img4 from "../img/Recurso 52.svg";
import img5 from "../img/Group 64.svg";
import img6 from "../img/Group 46.svg";
import img7 from "../img/Group 63.svg";
import img8 from "../img/Group 48.svg";
import img9 from "../img/Group 66.svg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MyContext } from "../context/Context";

export default function Buttons() {
  const { state, setState, step, setStep } = useContext(MyContext);
  const containerRef = useRef(null);

  const handleButtonClick = (data) => {
    setState(data);

    // ✅ Solo cambiar a step 3 si aún no estás en él
    if (step !== 3) {
      setStep(3);
    }
  };

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleKey = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      callback();
    }
  };

  return (
    <div className="button-container-wrapper slider">
      <div
        className="slider-button slider-button-left"
        role="button"
        tabIndex={0}
        onClick={scrollLeft}
        onKeyDown={(e) => handleKey(e, scrollLeft)}
      >
        <IoIosArrowBack size={24} color="#ff5722" />
      </div>

      <div className="button-container button-container-slider" ref={containerRef}>
        {[
          { key: "LandingPageClickThrough", img: img3, text: "Landing Page Click through" },
          { key: "LandingBasica", img: img1, text: "Web de Inicio (Landing básica)" },
          { key: "WebDeReservaciones", img: img2, text: "Web de Reservaciones" },
          { key: "PaginaCorporativa", img: img7, text: "Página Corporativa" },
          { key: "WebInformativa", img: img9, text: "Web Informativa" },
          { key: "Blog", img: img4, text: "Blog" },
          { key: "PaginaDeMembresia", img: img6, text: "Página de Membresía" },
          { key: "AulaVirtual", img: img8, text: "Aula Virtual" },
          { key: "eCommerce", img: img5, text: "eCommerce" },
        ].map(({ key, img, text }) => (
          <div
            key={key}
            className={`button ${state === key ? "active" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => handleButtonClick(key)}
            onKeyDown={(e) => handleKey(e, () => handleButtonClick(key))}
          >
            <img src={img} alt={text} />
            <p className="button-text">{text}</p>
          </div>
        ))}
      </div>

      <div
        className="slider-button slider-button-right"
        role="button"
        tabIndex={0}
        onClick={scrollRight}
        onKeyDown={(e) => handleKey(e, scrollRight)}
      >
        <IoIosArrowForward size={24} color="#ff5722" />
      </div>
    </div>
  );
}
