import React, { useContext } from "react";
import { MyContext } from "../context/Context";
import Buttons from "../components/Buttons";
import LandingPageClickThrough from "../components/LandingPageClickThrough";
import FormWeb from "../components/FormWeb";
import { IoChevronBackCircle } from "react-icons/io5";
function MainContent() {
  const { state, formData, redirectToHome } = useContext(MyContext);

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
      {" "}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Buttons />
      </div>
      <div>{renderComponent()}</div>
    </>
  );
}

export default MainContent;
