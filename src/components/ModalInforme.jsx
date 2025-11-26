import React, { useState, useEffect } from "react";
import { FcDocument } from "react-icons/fc";

export default function ModalInforme({ isOpen, onClose, data }) {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => setVisible(false), 300); // coincide con fadeOut
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${closing ? "closing" : ""}`}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        <div className="modal-content">
          <h2>Documento creado</h2>
          {data ? (
            <div className="modal-details">
              <p>
                <b>Cliente:</b> {data.cliente}
              </p>
              <p>
                <b>Empresa:</b> {data.empresa}
              </p>
              <p>
                <b>Fecha de creación:</b>{" "}
                {new Date(data.fecha_creacion).toLocaleString()}
              </p>
              <p>
                <b>Enlace:</b>{" "}
                <a href={data.link} target="_blank" rel="noopener noreferrer">
                  <div className="modal-icon">
                    <FcDocument />
                  </div>
                </a>
              </p>
            </div>
          ) : (
            <p>Cargando información...</p>
          )}
        </div>
      </div>
    </div>
  );
}
