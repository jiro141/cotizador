import React, { useState, useEffect } from "react";
import { tipoBeneficio, beneficio } from "../controller/api";

// Íconos de react-icons
import {
  FaUsers,
  FaShoppingCart,
  FaCalendarAlt,
  FaInfoCircle,
  FaBullseye,
  FaBook,
} from "react-icons/fa";
import logo from "../img/cropped-logo.png";

const CategorySelection = ({ onSelectCategories }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Diccionario con títulos exactos
  const iconMap = {
    "Comunidad y Contenido Restringido": <FaUsers />,
    "Comercio Electrónico": <FaShoppingCart />,
    "Reservas y Gestión de Servicios": <FaCalendarAlt />,
    "Información Corporativa y de Marca": <FaInfoCircle />,
    "Conversión y Captura de Leads": <FaBullseye />,
    "Formación y Educación en Línea": <FaBook />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await tipoBeneficio();

        const categoriesWithBenefits = await Promise.all(
          response.map(async (item) => {
            const categoryName = item.nombre || "Categoría desconocida";
            const ids = item.beneficios || [];
            const descripcion = item.descripcion || "";

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
                  return {
                    value: `error-${id}`,
                    label: "Error al cargar",
                    descripcion: null,
                  };
                }
              })
            );

            return {
              nombre: categoryName,
              beneficios: beneficiosData,
              descripcion,
            };
          })
        );

        setCategories(categoriesWithBenefits);
      } catch (error) {
        console.error("Error al cargar beneficios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (categoryName) => {
    const newSelection = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((c) => c !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(newSelection);

    // Mandamos al padre un ARRAY de categorías completas
    const selectedObjects = categories.filter((cat) =>
      newSelection.includes(cat.nombre)
    );

    onSelectCategories(selectedObjects);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={logo} alt="Cargando..." className="spinner" />
      </div>
    );
  }

  return (
    <div className="category-selection">
      <div className="grid3">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className={`card ${
              selectedCategories.includes(cat.nombre) ? "selected" : ""
            }`}
            onClick={() => handleSelect(cat.nombre)}
          >
            <h2 className="title-with-icon">
              <span className="icon">{iconMap[cat.nombre]}</span>
              {cat.nombre}
            </h2>
            <p>{cat?.descripcion || "Sin descripción disponible"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
