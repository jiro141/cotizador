import React, { useState, useEffect, useContext } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { tipoBeneficio, beneficio } from "../controller/api";
import logo from "../img/cropped-logo.png";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Separator from "./Separator";
import { MyContext } from "../context/Context";
const StepTwoForm = ({
  selectedBenefits,
  handleCheckboxChange,
  handleSubmit,
  handleBack,
}) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [benefitsByCategory, setBenefitsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const { setFormData, formData } = useContext(MyContext);
  const tipoBene = async () => {
    try {
      const response = await tipoBeneficio();
      const result = {};

      for (const item of response) {
        const category = item.nombre || "Categoría desconocida";
        const ids = item.beneficios || [];

        const beneficiosData = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await beneficio(id);
              return {
                value: res.name || "Nombre desconocido",
                label: res.name || "Nombre desconocido",
                descripcion: res.descripcion || null,
                puntos: res.puntaje || [],
              };
            } catch (error) {
              console.warn(`Error al cargar beneficio ID ${id}:`, error);
              return {
                value: `error-${id}`,
                label: "Error al cargar",
                descripcion: null,
              };
            }
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
          <div key={category} className="section-container3">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleCategory(category)}
            >
              <h3 className="category-title">{category}</h3>
              <span>
                {openCategory === category ? (
                  <IoIosArrowUp size={24} color="#ff5722" />
                ) : (
                  <IoIosArrowDown size={24} />
                )}
              </span>
            </div>
            <Separator />
            {openCategory === category && (
              <div
                className="benefits-grid"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#2C2C2C",
                  border: "1px solid #ccc",
                  padding: "15px",
                  zIndex: "9999",
                  width: "100%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                }}
              >
                {benefits.map((benefit, idx) => {
                  const benefitId = `benefit-${category}-${idx}`;
                  // 🔍 Check if the benefit is selected (by value) in that category
                  const isChecked = Array.isArray(selectedBenefits?.[category])
                    ? selectedBenefits[category].some(
                        (b) => b.value === benefit.value
                      )
                    : false;
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
                        value={benefit.value}
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = isChecked
                            ? selectedBenefits[category].filter(
                                (b) => b.value !== benefit.value
                              )
                            : [...(selectedBenefits[category] || []), benefit];
                          handleCheckboxChange(
                            category,
                            updated,
                            updated // si usas un segundo array para display, lo puedes separar aquí
                          );
                        }}
                      />
                      <label
                        htmlFor={benefitId}
                        {...(benefit.descripcion && {
                          "data-tooltip-id": benefitId,
                          "data-tooltip-content": benefit.descripcion,
                        })}
                      >
                        <span></span>
                        {benefit.label}
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
    </div>
  );
};

export default StepTwoForm;
