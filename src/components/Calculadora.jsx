import React, { useState } from "react";
import { GoPlusCircle } from "react-icons/go";

export default function Calculadora({
  data,
  selectedServicios,
  selectedSecciones,
  selectedPaginas,
  selectedFunciones,
  selectedSeccionesMax,
  maxValue,
  limitReached,
  onCheckboxChange,
}) {
  console.log(selectedPaginas, "cantiadda");

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
            <div>
              <h3>
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
            <div>
              <h3>
                <strong>Secciones adicionales</strong>
              </h3>
              <ul className="items-list">
                {selectedSeccionesMax.map((item) => (
                  <li
                    key={`max-seccion-${item.ID}`}
                    className="item-name flex justify-center	"
                  >
                    {item.name}
                    <GoPlusCircle
                      style={{ marginLeft: 8 }}
                      color="#70ADDF"
                      size={21}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3>
            <strong>
              {selectedPaginas.length > 0 ? "Paginas Adicionales" : ""}
            </strong>
          </h3>
          <ul className="items-list">
            {selectedPaginas.length > 0 ? (
              // Agrupa los elementos por ID para calcular las repeticiones
              Object.entries(
                selectedPaginas.reduce((acc, item) => {
                  acc[item.ID] = acc[item.ID] || { ...item, count: 0 };
                  acc[item.ID].count += 1;
                  return acc;
                }, {})
              ).map(([id, item]) => (
                <li key={`pagina-${id}`} className="item-name">
                  {item.name ? item.name : item.paginas} {" "}
                  {item.count > 1 ? `x${item.count}` : ""}
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>

          <h3>
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

          <p className="total">Total: ${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
