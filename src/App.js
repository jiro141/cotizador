import "./App.css";
import { useContext } from "react";
import { MyContext } from "./context/Context";
import Buttons from "./components/Buttons";
import LandingPageClickThrough from "./components/LandingPageClickThrough";
function App() {
  const { state } = useContext(MyContext);

  const renderComponent = () => {
    switch (state) {
      case "LandingPageClickThrough":
        return <LandingPageClickThrough />;
      case "LandingBasica":
        return <LandingPageClickThrough />;
      case "WebDeReservaciones":
        return <LandingPageClickThrough />;
      case "PaginaCorporativa":
        return <LandingPageClickThrough />;
      case "WebInformativa":
        return <LandingPageClickThrough />;
      case "Blog":
        return <LandingPageClickThrough />;
      case "PaginaDeMembresia":
        return <LandingPageClickThrough />;
      case "Foro":
        return <LandingPageClickThrough />;
      case "eCommerce":
        return <LandingPageClickThrough />;
      default:
        return <p></p>;
    }
  };
  return (
    <>
      <h3 className="titulo">¿Que servicio estas Buscando?</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Buttons />
      </div>
      <div>{renderComponent()}</div>
      <div style={{ textAlign: "center" }}>
        <h3 className="titulo" style={{ fontSize: "20px" }}>
          ¿Necesitas ayuda para saber que es lo mejor para ti??
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

export default App;
