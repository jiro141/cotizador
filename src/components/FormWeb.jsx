import React, { useState, useContext } from "react";
import { Stepper, Step } from "react-form-stepper";
import { MyContext } from "../context/Context";
import StepOneForm from "./StepOneForm";
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThreeForm";

// import StepThreeForm from "./StepThreeForm"; <-- cuando lo crees

const FormWeb = () => {
  const { setFormData } = useContext(MyContext);
  const [step, setStep] = useState(1);

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
  });

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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setInput((prev) => {
      const updatedBenefits = checked
        ? [...prev.beneficios_producto, value]
        : prev.beneficios_producto.filter((benefit) => benefit !== value);

      return {
        ...prev,
        beneficios_producto: updatedBenefits,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      setFormData(input);
      console.log("Formulario final enviado:", input);
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  return (
    <div className="calculator-container  full">
      <form onSubmit={handleSubmit} className="calculator-content">
        <Stepper
          activeStep={step - 1}
          style={{ marginBottom: "20px", width: "800px" }}
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
            labelFontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          <Step label="Información del cliente" />
          <Step label="Beneficios del producto" />
          <Step label="Análisis gráfico" />
        </Stepper>
        {step === 1 && (
          <StepOneForm
            input={input}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleBack={handleBack}
          />
        )}
        {step === 2 && (
          <StepTwoForm
            selectedBenefits={input.beneficios_producto}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            handleBack={handleBack}
          />
        )}
        {step === 3 && (
          <div>
            {step === 3 && (
              <>
                <StepThreeForm
                  selectedBenefits={input.beneficios_producto}
                  handleSubmit={() => {
                    setFormData(input);
                  }}
                  formData={input}
                  handleBack={handleBack}
                />
                <div
                  className="form-row calculator-container "
                  style={{ display: "flex", flexDirection: "row", padding:'20px' }}
                >
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
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormWeb;
