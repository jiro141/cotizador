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
  const isClienteIncompleto =
    !cliente.nombre || !cliente.email || !cliente.cargo;
  const isDisabled = isClienteIncompleto || userTipo !== 1;

  const tooltipProps = isClienteIncompleto
    ? {
        "data-tooltip-id": "cliente-tooltip",
        "data-tooltip-variant": "light",
        "data-tooltip-content": "Por favor, cargar datos del cliente",
      }
    : {};

  return (
    <div
      className={`button-container-wrapper grid cuadrado `}
      style={{ flex: "1", minWidth: 0 }}
    >
      <div {...tooltipProps}>
        <button
          className="button"
          onClick={goWebEsencial}
          disabled={isClienteIncompleto}
        >
          <img src={webEsencial} alt="Web Esencial" />
          <p className="button-text">Web Esencial</p>
        </button>
      </div>
      <div {...tooltipProps}>
        <button className="button" onClick={goToAbout} disabled={isDisabled}>
          <img src={smart} alt="Smart Solutions" />
          <p className="button-text">Smart Solution</p>
        </button>
      </div>
      <div {...tooltipProps}>
        <button className="button" onClick={goToAbout} disabled={isDisabled}>
          <img src={digital} alt="Digital Support" />
          <p className="button-text">Support and Development</p>
        </button>
      </div>
      <div {...tooltipProps}>
        <button className="button" onClick={goToInformes} disabled={isDisabled}>
          <img src={informes} alt="Informes" />
          <p className="button-text">Informes</p>
        </button>
      </div>

      {/* Renderiza solo un tooltip compartido */}
      {isClienteIncompleto && <Tooltip id="cliente-tooltip" place="top" />}
    </div>
  );
}
