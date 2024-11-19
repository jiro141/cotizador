import React, { useState, useEffect, useContext } from "react";
import { GoPlusCircle } from "react-icons/go";
import { MyContext } from "../context/Context";
import { postCotizacion } from "../controller/api";
import toast, { Toaster } from "react-hot-toast";
export default function Calculadora({
  data,
  selectedServicios,
  selectedSecciones,
  selectedPaginas,
  selectedFunciones,
  selectedSeccionesMax,
  maxValue,
  limitReached,
  exceededPaginas,
  onCheckboxChange,
}) {
  const { state } = useContext(MyContext);
  // Calcular el precio total y convertir "precio" de string a número
  const totalServicios = selectedServicios.reduce(
    (sum, item) => sum + parseFloat(item?.precio?.replace("$", "") || 0),
    0
  );
  const totalSecciones = selectedSecciones.reduce(
    (sum, item) => sum + parseFloat(item?.precio?.replace("$", "") || 0),
    0
  );
  const totalPaginas = selectedPaginas.reduce(
    (sum, item) => sum + parseFloat(item?.precio?.replace("$", "") || 0),
    0
  );
  const totalPaginasExtra = exceededPaginas.reduce(
    (sum, item) => sum + parseFloat(item?.precio?.replace("$", "") || 0),
    0
  );
  const totalFunciones = selectedFunciones.reduce(
    (sum, item) => sum + parseFloat(item?.precio?.replace("$", "") || 0),
    0
  );
  const total =
    totalServicios +
    totalSecciones +
    totalPaginas +
    totalFunciones +
    totalPaginasExtra;
  const [formData, setFormData] = useState({
    Producto: "",
    funciones_mensuales: "",
    secciones: "",
    paginas: "",
    Funciones: "",
    secciones_extra: "",
    paginas_extra: "",
    total: 0,
  });

  useEffect(() => {
    setFormData({
      Producto: state || "", // Asegura que `state` tenga un valor predeterminado si es null o undefined
      funciones_mensuales: (selectedServicios || [])
        .map((item) => item.fields?.Producto || "")
        .join(", "), // Convierte el arreglo en un string separado por comas
      secciones: (selectedSecciones || [])
        .map((item) => item.name || "")
        .join(", "),
      Funciones: (selectedFunciones || [])
        .map((item) => item.name || "")
        .join(", "),
      secciones_extra: (selectedSeccionesMax || [])
        .map((item) => item.name || "")
        .join(", "),
      paginas_extra: Object.entries(
        (exceededPaginas || []).reduce((acc, item) => {
          const name = item.name || item.paginas || "";
          acc[name] = (acc[name] || 0) + 1; // Cuenta las repeticiones
          return acc;
        }, {})
      )
        .map(([name, count]) => (count > 1 ? `${name} x${count}` : name)) // Agrega "x2, x3" si hay repeticiones
        .join(", "), // Convierte el resultado en un string separado por comas,

      paginas: Object.entries(
        (selectedPaginas || []).reduce((acc, item) => {
          const name = item.name || item.paginas || "";
          acc[name] = (acc[name] || 0) + 1; // Cuenta las repeticiones
          return acc;
        }, {})
      )
        .map(([name, count]) => (count > 1 ? `${name} x${count}` : name)) // Agrega "x2, x3" si hay repeticiones
        .join(", "), // Convierte el resultado en un string separado por comas,

      total: total || 0, // Asegura que `total` sea un número, incluso si es undefined
    });
  }, [
    state,
    selectedServicios,
    selectedSecciones,
    selectedPaginas,
    selectedFunciones,
    selectedSeccionesMax,
    exceededPaginas,
    total,
  ]);

  const handleSubmit = async () => {
    try {
      const response = await postCotizacion(formData); // Llama a tu función API
      console.log("Respuesta del servidor:", response);
      if (response) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      // Mostrar mensaje de éxito con estilo personalizado
      toast("Cotización enviada exitosamente", {
        icon: "🚀",
        style: {
          borderRadius: "10px",
          background: "#2C2C2C",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error al enviar la cotización:", error);

      // Mostrar mensaje de error con estilo personalizado
      toast("Ocurrió un error al enviar la cotización. Inténtalo nuevamente.", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="calculator-container">
      <Toaster />
      <div className="calculator-content">
        <div className="price-section">
          <h3 className="price-title">Sencillo</h3> {/* Clase añadida */}
          <p className="price">${total.toFixed(2)}</p>
          <button className="quote-button" onClick={handleSubmit}>
            Enviar cotización
          </button>
        </div>
        <div className="items-section">
          <h3 className="section-title">
            <strong>
              {selectedServicios.length > 0 ? "Servicios Mensuales" : ""}
            </strong>
          </h3>
          <ul className="items-list">
            {selectedServicios.length > 0 ? (
              selectedServicios.map((item) => (
                <li key={`servicio-${item.fields.ID}`} className="item-name">
                  {item.fields.Producto}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
          {selectedSecciones.length > 0 && (
            <div className="secciones-container">
              {" "}
              {/* Clase añadida */}
              <h3 className="section-title">
                <strong>Secciones</strong>
              </h3>
              <ul className="items-list">
                {selectedSecciones.map((item, index) => {
                  return (
                    <li key={`seccion-${item.ID}`} className="item-name">
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {limitReached && selectedSeccionesMax.length > 0 && (
            <div className="extra-sections-container">
              {" "}
              {/* Clase añadida */}
              <h3 className="section-title">
                <strong>Secciones Extra</strong>
              </h3>
              <ul className="items-list">
                {selectedSeccionesMax.map((item) => (
                  <li
                    key={`max-seccion-${item.ID}`}
                    className="item-name extra-item flex justify-center"
                  >
                    {item.name}
                    <GoPlusCircle className="icon-extra-section" />{" "}
                    {/* Clase añadida */}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h3 className="section-title">
            <strong>
              {selectedPaginas.length > 0 ? "Paginas Adicionales" : ""}
            </strong>
          </h3>
          <ul className="items-list">
            {selectedPaginas.length > 0 ? (
              Object.entries(
                selectedPaginas.reduce((acc, item) => {
                  acc[item.ID] = acc[item.ID] || { ...item, count: 0 };
                  acc[item.ID].count += 1;
                  return acc;
                }, {})
              ).map(([id, item]) => (
                <li key={`pagina-${id}`} className="item-name">
                  {item.name ? item.name : item.paginas}{" "}
                  {item.count > 1 ? `x${item.count}` : ""}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
          {exceededPaginas.length > 0 && (
            <>
              <h3 className="section-title">
                <strong>
                  {exceededPaginas.length > 0 ? "Paginas Extra" : ""}
                </strong>
              </h3>
              <ul className="items-list">
                {Object.entries(
                  exceededPaginas.reduce((acc, item) => {
                    acc[item.ID] = acc[item.ID] || { ...item, count: 0 };
                    acc[item.ID].count += 1;
                    return acc;
                  }, {})
                ).map(([id, item]) => (
                  <li key={`pagina-${id}`} className="item-name extra-item">
                    {item.name ? item.name : item.paginas}{" "}
                    {item.count > 1 ? `x${item.count}` : " "}{" "}
                    <GoPlusCircle className="icon-extra-page" />{" "}
                    {/* Clase añadida */}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 className="section-title">
            <strong>
              {selectedFunciones.length > 0 ? "Funciones Adicionales" : ""}
            </strong>
          </h3>
          <ul className="items-list">
            {selectedFunciones.length > 0 ? (
              selectedFunciones.map((item) => (
                <li key={`pagina-${item.ID}`} className="item-name">
                  {item.name}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
          <p className="total-price">Total: ${total.toFixed(2)}</p>{" "}
          {/* Clase añadida */}
        </div>
      </div>
    </div>
  );
}
