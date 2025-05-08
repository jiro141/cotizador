import React, { useContext, useState } from "react";
import { MyContext } from "../context/Context";
import Buttons from "../components/Buttons";
import LandingPageClickThrough from "../components/LandingPageClickThrough";
import FormWeb from "../components/FormWeb";
import { IoChevronBackSharp } from "react-icons/io5";

function MainContent() {
  const { state, formData, redirectToHome } = useContext(MyContext);
  const [step, setStep] = useState(1); // 🔥 Ahora el padre controla el paso
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
      <a
        onClick={() => {
          if (step === 4) {
            setStep(3);
          } else {
            redirectToHome();
          }
        }}
        className="atras"
      >
        <IoChevronBackSharp size={30} color="#FFFF" />
      </a>

      <h2
        className="titulo"
        style={{
          padding: "20px",
        }}
      >
        Formulario Web Esencial
      </h2>
      <>
        {step <= 3 && <FormWeb step={step} setStep={setStep} />}
        {step === 4 && (
          <>
            <h3 className="titulo2">¿Qué servicio estás buscando?</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Buttons />
            </div>
            <div>{renderComponent()}</div>
          </>
        )}
      </>
    </>
  );
}

export default MainContent;
