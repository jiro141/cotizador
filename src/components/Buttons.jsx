import React, { useContext, useRef, useState, useEffect } from "react";
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
  const [showArrows, setShowArrows] = useState(false);

  const handleButtonClick = (data) => {
    setState(data);
    if (step !== 4) {
      setStep(4);
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

  // Detecta si hace falta mostrar flechas
  useEffect(() => {
    const checkScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      // ¿El contenido real es más ancho que el contenedor visible?
      setShowArrows(el.scrollWidth > el.clientWidth + 2); // +2 por seguridad en bordes
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Por si los botones pueden cambiar dinámicamente, checa después de renderizar
  useEffect(() => {
    setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      setShowArrows(el.scrollWidth > el.clientWidth + 2);
    }, 30);
  }, [state]); // Puedes agregar dependencias según tus props

  return (
    <div
      className="button-container-wrapper slider calculator-container"
      style={{ position: "relative" }}
    >
      {showArrows && (
        <div
          className="slider-button slider-button-left"
          role="button"
          tabIndex={0}
          onClick={scrollLeft}
          onKeyDown={(e) => handleKey(e, scrollLeft)}
        >
          <IoIosArrowBack size={24} color="#ff5722" />
        </div>
      )}

      <div
        className="button-container button-container-slider"
        ref={containerRef}
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Tus botones */}
        {[
          {
            key: "LandingPageClickThrough",
            img: img3,
            text: "Landing Page",
          },
          {
            key: "LandingBasica",
            img: img1,
            text: "Web de Inicio",
          },

          { key: "PaginaCorporativa", img: img7, text: "Web Corporativa" },
          { key: "WebInformativa", img: img9, text: "Web Informativa" },
          { key: "Blog", img: img4, text: "Blog" },
          {
            key: "WebDeReservaciones",
            img: img2,
            text: "Web de Reservaciones",
          },
          { key: "PaginaDeMembresia", img: img6, text: "Web de Membresía" },
          { key: "AulaVirtual", img: img8, text: "Aula Virtual" },
          { key: "eCommerce", img: img5, text: "eCommerce" },
        ].map(({ key, img, text }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              key={key}
              className={`button ${state === key ? "active" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => handleButtonClick(key)}
              onKeyDown={(e) => handleKey(e, () => handleButtonClick(key))}
              style={{
                width: "80px",
                height: "80px",
              }}
            >
              <img src={img} alt={text} />
            </div>
            <p
              style={{
                padding: "0px",
                marginTop: "10px",
              }}
              className="button-text"
            >
              {text}
            </p>
          </div>
        ))}
      </div>

      {showArrows && (
        <div
          className="slider-button slider-button-right"
          role="button"
          tabIndex={0}
          onClick={scrollRight}
          onKeyDown={(e) => handleKey(e, scrollRight)}
        >
          <IoIosArrowForward size={24} color="#ff5722" />
        </div>
      )}
    </div>
  );
}
