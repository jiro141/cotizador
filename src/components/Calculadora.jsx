import React from "react";

export default function Calculadora({
  data,
  selectedServicios,
  selectedSecciones,
  selectedPaginas,
  selectedFunciones,
  onCheckboxChange,
}) {
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
  const totalFunciones = selectedFunciones.reduce(
    (sum, item) => sum + parseFloat(item?.precio?.replace("$", "") || 0),
    0
  );
  const total = totalServicios + totalSecciones + totalPaginas + totalFunciones;

  return (
    <div className="calculator-container">
      <div className="calculator-content">
        <div className="price-section">
          <h3>Sencillo</h3>
          <p className="price">${total.toFixed(2)}</p>
          <button className="quote-button">Enviar cotización</button>
        </div>
        <div className="items-section">
          <h3>
            {" "}
            <strong>
              {selectedServicios.length > 0 ? "Servicios Mensuales" : ""}
            </strong>{" "}
          </h3>
          <ul className="items-list">
            {selectedServicios.length > 0 ? (
              selectedServicios.map((item) => (
                <li key={`servicio-${item.fields.ID}`} className="item-name">
                  {item.fields.Producto}{" "}
                  {/* Ajustado para usar 'Producto' en lugar de 'name' */}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>

          <h3>
            {" "}
            <strong>
              {selectedSecciones.length > 0 ? "Secciones" : ""}
            </strong>{" "}
          </h3>
          <ul className="items-list">
            {selectedSecciones.length > 0 ? (
              selectedSecciones.map((item) => (
                <li key={`seccion-${item.ID}`} className="item-name">
                  {item.name}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
          <h3>
            {" "}
            <strong>
              {selectedPaginas.length > 0 ? "Paginas Adicionales" : ""}
            </strong>{" "}
          </h3>
          <ul className="items-list">
            {selectedPaginas.length > 0 ? (
              selectedPaginas.map((item) => (
                <li key={`pagina-${item.ID}`} className="item-name">
                  {item.name}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
          <h3>
            {" "}
            <strong>
              {selectedFunciones.length > 0 ? "Funciones Adicionales" : ""}
            </strong>{" "}
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
          <p className="total">Total: ${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
