import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Crear el contexto
export const MyContext = createContext(null);

// Provider
export const MyProvider = ({ children }) => {
  const [state, setState] = useState("Valor inicial");
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate(); // Hook para navegar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Evita errores si `localStorage` es null
  const userTipo = user?.tipoUser || "";
  // Función para abrir y cerrar el modal
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Función para redirigir a la ruta raíz
  const redirectToHome = () => {
    navigate("/"); // Redirige a la ruta '/'
  };

  return (
    <MyContext.Provider
      value={{
        state,
        setState,
        formData,
        setFormData,
        redirectToHome,
        setIsModalOpen,
        isModalOpen,
        toggleModal,
        userTipo
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
