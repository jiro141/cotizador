import React, { useState, useContext } from "react";
import { MyContext } from "../context/Context";
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThreeForm";
import LandingPageClickThrough from "./LandingPageClickThrough";
import MainContent from "../layout/MainContent";
import { useNavigate } from "react-router-dom";
import { IoChevronBackSharp, IoChevronForward } from "react-icons/io5";
import { Stepper, Step } from "react-form-stepper";

const FormWeb = () => {
  const { setFormData, state, step, setStep } = useContext(MyContext);
  const [showRadar, setShowRadar] = useState(true);
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate("/");
  };

  const handleNext = () => {
    if (step === 1) return setStep(2);
    if (step === 2) return setStep(3);
    if (step === 3) {
      setFormData(input);
      setStep(4);
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
  const handleCheckboxChange = (
    category,
    selectedBenefitObjects,
    selectedOptions
  ) => {
    const selectedNames = selectedOptions.map((b) => b.value);
    const otros = input.beneficios_producto.filter(
      (benefit) =>
        !input.beneficios_por_categoria?.[category]
          ?.map((b) => b.value)
          .includes(benefit)
    );

    const beneficios_por_categoria = {
      ...input.beneficios_por_categoria,
      [category]: selectedBenefitObjects,
    };

    const beneficios_por_categoria_display = {
      ...input.beneficios,
      [category]: selectedOptions,
    };

    // Cambia input
    setInput((prev) => ({
      ...prev,
      beneficios_producto: [...otros, ...selectedNames],
      beneficios_por_categoria,
      beneficios: beneficios_por_categoria_display,
    }));

    // <-- ADICIÓN: actualiza también en formData del contexto -->
    setFormData((prev) => ({
      ...prev,
      beneficios_producto: [...otros, ...selectedNames],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) return setStep(2);
    if (step === 2) return setStep(3);
    setFormData(input);
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="calculator-container">
      <div style={{ width: "100%" }}>
        <Stepper
          activeStep={step - 1}
          connectorStyleConfig={{
            activeColor: "#e64a19",
            completedColor: "#70addf",
            disabledColor: "#bdbdbd",
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

        {step < 3 && (
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
        style={{ zIndex: "99999" }}
        className={step === 1 ? "calculator-content" : ""}
      >
        {step === 1 && (
          <StepTwoForm
            selectedBenefits={input.beneficios_por_categoria || {}}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            handleBack={handleBack}
          />
        )}
        {step === 2 && (
          <StepThreeForm
            selectedBenefits={input.beneficios}
            handleSubmit={() => setFormData(input)}
            formData={input}
            handleBack={handleBack}
          />
        )}
        {step === 3 && <MainContent />}
      </form>
    </div>
  );
};

export default FormWeb;
