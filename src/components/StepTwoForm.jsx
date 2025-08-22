import React, { useState, useEffect } from "react";
import logo from "../img/cropped-logo.png";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const StepTwoForm = ({
  availableBenefits, // { "Comercio Electrónico": [todos los beneficios...] }
  selectedBenefits,  // { "Comercio Electrónico": [solo checkeados] }
  handleCheckboxChange,
  handleSubmit,
  handleBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const categories = Object.keys(availableBenefits || {});
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [availableBenefits]);

  if (!availableBenefits || Object.keys(availableBenefits).length === 0) {
    return (
      <div className="spinner-container">
        <img src={logo} alt="Cargando..." className="spinner" />
        <p style={{ color: "#fff" }}>No hay categorías seleccionadas.</p>
      </div>
    );
  }

  const categories = Object.keys(availableBenefits);

  return (
    <div className="benefits-box">
      <div className="benefits-row">
        {/* Menú de Categorías */}
        <div className="benefits-menu">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`benefits-menu-item ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span className="benefits-menu-title">{cat}</span>
              <span className="benefits-menu-arrow">
                {selectedCategory === cat ? (
                  <span className="arrow-orange">
                    <MdArrowForwardIos />
                  </span>
                ) : (
                  <span className="arrow-gray">
                    <MdArrowBackIos />
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Panel de beneficios */}
        <div className="benefits-list">
          {(availableBenefits[selectedCategory] || []).map((benefit, idx) => {
            const benefitId = `benefit-${selectedCategory}-${idx}`;

            // checked depende solo de selectedBenefits
            const isChecked = Array.isArray(selectedBenefits?.[selectedCategory])
              ? selectedBenefits[selectedCategory].some(
                  (b) => b.value === benefit.value
                )
              : false;

            return (
              <div className="checkbox-wrapper-24" key={benefitId}>
                <input
                  type="checkbox"
                  id={benefitId}
                  checked={isChecked}
                  onChange={() => {
                    // copiar todas las categorías ya seleccionadas
                    const updatedAll = { ...selectedBenefits };

                    // copiar la lista de esta categoría
                    const currentCat = updatedAll[selectedCategory] || [];

                    // actualizar solo esta categoría
                    updatedAll[selectedCategory] = isChecked
                      ? currentCat.filter((b) => b.value !== benefit.value)
                      : [...currentCat, benefit];

                    // pasar al padre el objeto completo actualizado
                    handleCheckboxChange(updatedAll);
                  }}
                />
                <label
                  htmlFor={benefitId}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                  data-tooltip-id={`tooltip-${benefitId}`}
                >
                  <span></span>
                  {benefit.descripcion ? (
                    <>
                      {benefit.label}
                      <Tooltip
                        id={`tooltip-${benefitId}`}
                        style={{ backgroundColor: "#fff", color: "#000" }}
                      >
                        {benefit.descripcion}
                      </Tooltip>
                    </>
                  ) : (
                    benefit.label
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepTwoForm;
