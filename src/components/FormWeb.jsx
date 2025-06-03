import React, { useState, useContext } from "react";
import { MyContext } from "../context/Context";
import StepOneForm from "./StepOneForm";
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThreeForm";
import Buttons from "./Buttons";
import LandingPageClickThrough from "./LandingPageClickThrough";
import MainContent from "../layout/MainContent";

const FormWeb = () => {
  const [step, setStep] = useState(1);
  const { setFormData, state } = useContext(MyContext);
  const [showRadar, setShowRadar] = useState(true);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["nombre", "cargo", "rubro", "email"].includes(name)) {
      setInput((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          [name]: value,
        },
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

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

    setInput((prev) => ({
      ...prev,
      beneficios_producto: [...otros, ...selectedNames],
      beneficios_por_categoria,
      beneficios: beneficios_por_categoria_display,
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
      <h2
        className="titulo2"
        style={{
          padding: "10px",
        }}
      >
        Formulario Web Esencial
      </h2>
      <form
        onSubmit={handleSubmit}
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
          <div>
            <div>
              {" "}
              <StepThreeForm
                selectedBenefits={input.beneficios}
                handleSubmit={() => setFormData(input)}
                formData={input}
                handleBack={handleBack}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormWeb;
