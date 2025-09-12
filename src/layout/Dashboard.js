import React, { useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainContent from "./MainContent";
import SmartSolutions from "./SmartSolutions";
import webEsencial from "../img/sitio-web 1.svg";
import smart from "../img/innovacion 1.svg";
import digital from "../img/soporte-en-linea 1.svg";
import informes from "../img/solicitud 1.svg";
import Modal from "../components/Modal";
import Header from "../components/Header";
import StepOneForm from "../components/StepOneForm";
import { MyContext } from "../context/Context";
import { Stepper, Step } from "react-form-stepper";
import Servicios from "../components/Servicios";
import Informes from "../components/Informes";
export default function Dashboard() {
  const navigate = useNavigate();
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

  const {
    setIsModalOpen,
    isModalOpen,
    toggleModal,
    userTipo,
    setFormData,
    formData,
  } = useContext(MyContext);

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
  const goWebEsencial = () => {
    navigate("/webEsencial");
  };

  const goToAbout = () => {
    navigate("/smarSolution");
  };
  const goToInformes = () => {
    navigate("/Informes");
  };

  return (
    <div className="dashboard">
      <Modal isOpen={isModalOpen} onClose={toggleModal} />
      <div className="centrar">
        <div
          style={{
            display: "flex",
            padding: "50px",
            gap: "20px", // mejora espaciado entre divs
          }}
        >
          <div
            style={{
              flex: "1 1 0", // <- garantiza que crece y se reduce por igual
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: "0px 10px",
              borderRadius: "8px",
              zIndex: 99,
              minWidth: 600, // <- evita que crezca por contenido
            }}
          >
            <StepOneForm
              input={input}
              handleChange={handleChange}
              setFormData={setFormData} 
            />
          </div>
          <Servicios
            formData={formData}
            webEsencial={webEsencial}
            goWebEsencial={goWebEsencial}
            userTipo={userTipo}
            smart={smart}
            goToAbout={goToAbout}
            goToInformes={goToInformes}
            digital={digital}
            informes={informes}
          />
        </div>
      </div>

      <Routes>
        <Route path="/webEsencial" element={<MainContent />} />
        <Route path="/smarSolution" element={<SmartSolutions />} />
         <Route path="/Informes" element={<Informes />} />
      </Routes>
    </div>
  );
}
