import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
import globo from "../img/globe_location_pin (1).svg";
export default function Header({ toggleModal, userTipo }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="header">
      <div >
        <img
          src="https://detipcompany.com/wp-content/uploads/2024/10/cropped-PropuestaLogo.png"
          alt="logo detip"
          className="imagen"
        />
      </div>
      <div className="boton-pais">
        {userTipo === "Detip" && (
          <a onClick={toggleModal}>
            País
            <img src={globo} alt="Globo de ubicación" />
          </a>
        )}
        <a onClick={handleLogout}>
          Cerrar sesión
          <BiLogOutCircle size={30} color="#FFFF" />
        </a>
      </div>
    </div>
  );
}
