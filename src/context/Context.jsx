import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Crear el contexto
export const MyContext = createContext(null);

// Provider
export const MyProvider = ({ children }) => {
  const [state, setState] = useState("Valor inicial");
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();  // Hook para navegar

  // Función para redirigir a la ruta raíz
  const redirectToHome = () => {
    navigate("/"); // Redirige a la ruta '/'
  };

  return (
    <MyContext.Provider value={{ state, setState, formData, setFormData, redirectToHome }}>
      {children}
    </MyContext.Provider>
  );
};
