import React, { useState, useEffect } from "react";
import { tipoBeneficio, beneficio } from "../controller/api";
import logo from "../img/cropped-logo.png";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Separator from "./Separator";

const StepTwoForm = ({
  selectedBenefits,
  handleCheckboxChange,
  handleSubmit,
  handleBack,
}) => {
  const [benefitsByCategory, setBenefitsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const animatedComponents = makeAnimated();
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

  const handleSelectChange = (category) => (selectedOptions) => {
    const values = selectedOptions.map((opt) => opt.value);
    handleCheckboxChange(category, values, selectedOptions);
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
            <h3 className="category-title">{category}</h3>
            <Select
              options={benefits}
              closeMenuOnSelect={false}
              components={animatedComponents}
              placeholder={`Selecciona beneficios de "${category}"`}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleSelectChange(category)}
              menuPortalTarget={document.body}
              value={benefits.filter((opt) =>
                (selectedBenefits[category] || []).includes(opt.value)
              )}
              isMulti
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999, // por encima de todo
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#2c2c2c", // fondo sólido real
                  border: "1px solid #444",
                  zIndex: 9999,
                }),
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#2c2c2c",
                  borderColor: "#444",
                  color: "#ff5722",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? "#70addf" : "#2c2c2c",
                  color: "#fff",
                  cursor: "pointer",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#70addf",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "#000",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#ccc",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#000",
                }),
              }}
            />
            {/* <Separator /> */}
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
