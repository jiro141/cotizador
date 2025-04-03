import React, { useContext } from "react";
import { MyContext } from "../context/Context";
import Buttons from "../components/Buttons";
import LandingPageClickThrough from "../components/LandingPageClickThrough";
import FormWeb from "../components/FormWeb";

function MainContent() {
  const { state, formData } = useContext(MyContext);

  const renderComponent = () => {
    switch (state) {
      case "LandingPageClickThrough":
      case "LandingBasica":
      case "WebDeReservaciones":
      case "PaginaCorporativa":
      case "WebInformativa":
      case "Blog":
      case "PaginaDeMembresia":
      case "Foro":
      case "eCommerce":
        return <LandingPageClickThrough formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <h2 className="titulo">Formulario Web Esencial</h2>
      {/* Mostrar formulario previo si no hay datos */}
      {!formData ? (
        <FormWeb />
      ) : (
        <>
          {" "}
          <h3 className="titulo">¿Qué servicio estás buscando?</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Buttons />
          </div>
          <div>{renderComponent()}</div>
        </>
      )}
      <div style={{ textAlign: "center" }}>
        <h3 className="titulo" style={{ fontSize: "20px" }}>
          ¿Necesitas ayuda para saber qué es lo mejor para ti?
        </h3>
        <button
          className="quote-button"
          onClick={() =>
            window.open("https://calendly.com/detipventas", "_blank")
          }
        >
          Agendar Asesoría
        </button>
      </div>
    </>
  );
}

export default MainContent;
