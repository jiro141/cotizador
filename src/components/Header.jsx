import React from "react";
import { useLocation, Link } from "react-router-dom"; // 👈 Importamos Link
import { BiLogOutCircle } from "react-icons/bi";
import globo from "../img/globe_location_pin (1).svg";

export default function Header({ toggleModal, userTipo }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="header">
      <div>
        {/* 👇 Usamos Link para navegar sin recarga */}
        <Link to="/">
          <img
            src="https://detipcompany.com/wp-content/uploads/2024/10/cropped-PropuestaLogo.png"
            alt="logo detip"
            className="imagen"
          />
        </Link>
      </div>
      <div className="boton-pais">
        {userTipo === 1 && location.pathname === "/" && (
          <a onClick={toggleModal}>
            País
            <img src={globo} alt="Globo de ubicación" />
          </a>
        )}
        <a onClick={handleLogout}>
          Cerrar sesión
          <BiLogOutCircle size={25} color="#FFFF" />
        </a>
      </div>
    </div>
  );
}
