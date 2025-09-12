import React from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function Servicios({
  webEsencial,
  goWebEsencial,
  userTipo,
  smart,
  goToAbout,
  digital,
  informes,
  formData,
  goToInformes
}) {
  const cliente = formData?.cliente || {};



  return (
    <div
      className={`button-container-wrapper grid cuadrado `}
      style={{ flex: "1", minWidth: 0 }}
    >
      <div >
        <button
          className="button"
          onClick={goWebEsencial}

        >
          <img src={webEsencial} alt="Web Esencial" />
          <p className="button-text">Web Esencial</p>
        </button>
      </div>
      <div >
        <button className="button" onClick={goToAbout} >
          <img src={smart} alt="Smart Solutions" />
          <p className="button-text">Smart Solution</p>
        </button>
      </div>
      <div >
        <button className="button" onClick={goToAbout} >
          <img src={digital} alt="Digital Support" />
          <p className="button-text">Support and Development</p>
        </button>
      </div>
      <div >
        <button className="button" onClick={goToInformes} >
          <img src={informes} alt="Informes" />
          <p className="button-text">Informes</p>
        </button>
      </div>
    </div>
  );
}
