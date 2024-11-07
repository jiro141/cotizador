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
        return <div>2</div>;
      case "WebDeReservaciones":
        return <div>3</div>;
      case "PaginaCorporativa":
        return <div>4</div>;
      case "WebInformativa":
        return <div>5</div>;
      case "Blog":
        return <div>6</div>;
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
        <button className="quote-button">Agendar Asesoria</button>
      </div>
    </>
  );
}

export default App;
