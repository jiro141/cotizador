import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { tipoBeneficio, beneficio } from "../controller/api";
import logo from "../img/cropped-logo.png";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Separator from "./Separator";
const StepTwoForm = ({
  selectedBenefits,
  handleCheckboxChange,
  handleSubmit,
  handleBack,
}) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [benefitsByCategory, setBenefitsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const tipoBene = async () => {
    try {
      const response = await tipoBeneficio();
      const result = {};

      for (const item of response) {
        const category = item?.fields?.Name;
        const ids = item?.fields?.Beneficio;

        const beneficiosData = await Promise.all(
          ids?.map(async (id) => {
            const res = await beneficio(id);
            return {
              name: res.fields?.Name || "Nombre desconocido",
              descripcion: res.fields?.descripcion || null,
            };
          })
        );

        result[category] = beneficiosData;
      }

      setBenefitsByCategory(result);
    } catch (error) {
      console.error("Error al cargar beneficios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tipoBene();
  }, []);

  const toggleCategory = (category) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={logo} alt="Cargando..." className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="benefits-categorized-list">
        {Object.entries(benefitsByCategory).map(([category, benefits]) => (
          <div
            key={category}
            className="section-container3"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "10px 0",
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
            <Separator />
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
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={benefitId}
                        value={benefit.name}
                        checked={selectedBenefits.includes(benefit.name)}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor={benefitId}
                        {...(benefit.descripcion && {
                          "data-tooltip-id": benefitId,
                          "data-tooltip-content": benefit.descripcion,
                        })}
                      >
                        <span></span>
                        {benefit.name}
                      </label>
                      {benefit.descripcion && (
                        <Tooltip id={benefitId} place="top" variant="light" />
                      )}
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
