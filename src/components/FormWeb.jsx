import React, { useState, useContext } from "react";
import { MyContext } from "../context/Context";
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThreeForm";
import LandingPageClickThrough from "./LandingPageClickThrough";
import MainContent from "../layout/MainContent";
import { useNavigate } from "react-router-dom";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { Stepper, Step } from "react-form-stepper";
import CategorySelection from "./CategorySelection";
const FormWeb = () => {
  const { setFormData, state, step, setStep } = useContext(MyContext);
  // const [showRadar, setShowRadar] = useState(true);
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate("/");
  };

  const handleNext = () => {
    if (step === 1) return setStep(2);
    if (step === 2) return setStep(3);
    if (step === 3) return setStep(4);
    if (step === 3) {
      setFormData(input);
      setStep(5);
    }
  };

  const [input, setInput] = useState({
    tipo_informe: "",
    tipo_producto: "",
    usuarios: "no requiere",
    interfaz_producto: "web",
    tiempo_implementacion: "",
    tamano_equipo: "",
    descripcion_empresa: "",
    descripcion_producto: "",
    hardware: "",
    beneficios_producto: [],
    modulos: "",
    notas: "",
    soporte_digital: false,
    formacion_uso: false,
    integracion_terceros: "No requiere",
    cliente: {
      nombre: "",
      cargo: "",
      rubro: "",
      email: "",
    },
    beneficios_por_categoria: {},
    beneficios: [],
  });

  const renderComponent = () => {
    switch (state) {
      case "LandingPageClickThrough":
      case "LandingBasica":
      case "WebDeReservaciones":
      case "PaginaCorporativa":
      case "WebInformativa":
      case "Blog":
      case "PaginaDeMembresia":
      case "Foro":
      case "eCommerce":
        return <LandingPageClickThrough />;
      default:
        return null;
    }
  };

  // <-- ÚNICO CAMBIO HECHO EN ESTA FUNCIÓN -->
  const handleCheckboxChange = (updatedSelected) => {
    setInput((prev) => ({
      ...prev,
      beneficios: updatedSelected, // este objeto tiene todos los seleccionados por categoría
    }));

    setFormData((prev) => ({
      ...prev,
      beneficios: updatedSelected,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) return setStep(2);
    if (step === 2) return setStep(3);
    if (step === 3) return setStep(4);

    setFormData(input);
    setStep(4);
  };


  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div
      className="calculator-container"
      style={{
        ...(step > 1 ? { margin: "2% 0px 0px 0px" } : {}),
        ...(step === 4 ? { width: "90vw", margin: "4% 0px 0px 0px" } : {}),
      }}
    >
      <div style={{ width: "100%" }}>
        <Stepper
          activeStep={step - 1}
          connectorStyleConfig={{
            activeColor: "#e64a19",
            completedColor: "#70addf",
            disabledColor: "#1A1A1A",
            size: 2,
          }}
          styleConfig={{
            activeBgColor: "#e64a19",
            activeTextColor: "#fff",
            completedBgColor: "#70addf",
            completedTextColor: "#fff",
            inactiveBgColor: "#70addf",
            inactiveTextColor: "#fff",
            size: "2em",
            labelFontSize: "0.2rem",
            fontWeight: 500,
          }}
          onStepClick={() => {}}
        >
          <Step label="Soluciones" />
          <Step label="Beneficios del Producto" />
          <Step label="Producto Sugerido" />
          <Step label="Adicionales" />
        </Stepper>
      </div>

      {/* Botones de navegación */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <a
          onClick={step === 1 ? redirectToHome : handleBack}
          className="atras"
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <IoChevronBackSharp size={40} color="#e64a19" />
        </a>

        {step < 4 && (
          <button
            type="button"
            onClick={handleNext}
            className="adelante"
            style={{ display: "flex", alignItems: "center" }}
          >
            <IoChevronForward size={40} color="#e64a19" />
          </button>
        )}
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        style={{ zIndex: "99999", padding: "0px 50px" }}
        className={step === 2 ? "calculator-content" : ""}
      >
        {step === 1 && (
          <CategorySelection
            onSelectCategories={(selectedCats) => {
              setInput((prev) => {
                const updated = { ...prev.beneficios_por_categoria };

                // Mantener solo las categorías actualmente seleccionadas
                const selectedMap = selectedCats.reduce((acc, cat) => {
                  acc[cat.nombre] = cat.beneficios;
                  return acc;
                }, {});

                // Eliminar las categorías que ya no están seleccionadas
                Object.keys(updated).forEach((cat) => {
                  if (!selectedMap[cat]) {
                    delete updated[cat];
                  }
                });

                return {
                  ...prev,
                  beneficios_por_categoria: {
                    ...updated,
                    ...selectedMap, // agrega/actualiza las categorías seleccionadas
                  },
                };
              });
            }}
          />
        )}
        {step === 2 && (
          <StepTwoForm
            availableBenefits={input.beneficios_por_categoria || {}}
            selectedBenefits={input.beneficios || {}}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            handleBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepThreeForm
            selectedBenefits={input.beneficios}
            handleSubmit={() => setFormData(input)}
            formData={input}
            handleBack={handleBack}
          />
        )}
        {step === 4 && <MainContent />}
      </form>
    </div>
  );
};

export default FormWeb;
