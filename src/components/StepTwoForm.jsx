import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const benefitsByCategory = {
  "Presencia y Visibilidad": [
    "Tener presencia en internet 24/7",
    "Aumentar la visibilidad de la marca",
    "Llegar a nuevos mercados y públicos",
    "Mostrar ubicación y datos de contacto fácilmente",
    "Integrarse con redes sociales y apps externas",
    "Posicionarse mejor en buscadores (SEO)",
  ],
  "Confianza y Relación con el Cliente": [
    "Generar confianza y credibilidad en clientes",
    "Facilitar la comunicación con los clientes",
    "Brindar soporte técnico o atención al cliente",
    "Mostrar portafolios o testimonios",
    "Educar al cliente sobre productos/servicios",
    "Mejorar la experiencia del cliente",
  ],
  "Operaciones y Automatización": [
    "Automatizar procesos repetitivos",
    "Agilizar reservas, citas o pedidos",
    "Gestionar usuarios, clientes o productos desde un panel de control",
    "Tener control y administración de inventario",
    "Centralizar la información del negocio",
    "Facilitar la atención multicanal (WhatsApp, email, chatbot)",
  ],
  "Ventas y Marketing": [
    "Vender productos o servicios en línea",
    "Recibir formularios, cotizaciones o solicitudes",
    "Obtener datos y estadísticas de usuarios",
    "Recolectar correos y construir una base de datos",
    "Enviar correos automatizados o boletines",
    "Aumentar el alcance de campañas publicitarias",
    "Mostrar promociones o novedades",
    "Hacer pruebas A/B y mejorar la conversión",
    "Ahorrar dinero en publicidad y operaciones físicas",
  ],
  "Contenido y Recursos": [
    "Ofrecer contenido descargable (ebooks, catálogos, etc.)",
    "Permitir pagos digitales o suscripciones",
    "Permitir múltiples idiomas si es necesario",
  ],
};

const StepTwoForm = ({
  selectedBenefits,
  handleCheckboxChange,
  handleSubmit,
  handleBack,
}) => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div>
      <div className="benefits-categorized-list">
        {Object.entries(benefitsByCategory).map(([category, benefits]) => (
          <div
            key={category}
            className="section-container3"
            style={{ marginBottom: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "10px 0",
                borderBottom: "1px solid #ccc",
              }}
              onClick={() => toggleCategory(category)}
            >
              <h3 className="category-title" style={{ margin: 0 }}>
                {category}
              </h3>
              <span style={{ marginLeft: "8px" }}>
                {openCategory === category ? (
                  <IoIosArrowUp size={24} color="#ff5722" />
                ) : (
                  <IoIosArrowDown size={24} />
                )}
              </span>
            </div>

            {openCategory === category && (
              <div className="benefits-grid" style={{ marginTop: "10px" }}>
                {benefits.map((benefit, idx) => {
                  const benefitId = `benefit-${category}-${idx}`;
                  return (
                    <div
                      key={benefitId}
                      className="checkbox-wrapper-24"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={benefitId}
                        value={benefit}
                        checked={selectedBenefits.includes(benefit)}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={benefitId}>
                        <span></span>
                        {benefit}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="form-row">
        <div className="form-column2">
          <a className="login-olvido" onClick={handleBack}>
            Volver
          </a>
        </div>
        <div className="form-column">
          <button onClick={handleSubmit} className="quote-button">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepTwoForm;
