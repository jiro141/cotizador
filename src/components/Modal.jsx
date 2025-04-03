import React, { useState, useEffect } from "react";
import { Pais } from "../controller/api";
import icono from "../img/location_on.svg";
import iconoOn from "../img/location_on1.svg";
import Separator from "./Separator";
import { userData } from "../controller/api";
const Modal = ({ isOpen, onClose }) => {
  const [countries, setCountries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Obtener el usuario desde el localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const paisId = user?.pais?.[0]; // Tomamos el primer ID del array "pais"
  const userId = user?.id;
  // Variable para el país seleccionado
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Obtener el país que corresponde al paisId desde los datos de los países
  useEffect(() => {
    if (paisId && countries.length > 0) {
      const country = countries.find((c) => c.id === paisId);
      if (country) {
        setSelectedCountry(country.fields.Pais); // Guardamos el nombre del país en el estado
      }
    }
  }, [paisId, countries]); // Se ejecuta cuando `paisId` y `countries` cambian

  useEffect(() => {
    if (isOpen) {
      fetchData(); // Solo se obtiene la data cuando el modal está abierto.
    }
  }, [isOpen]); // El useEffect se ejecuta cuando el modal se abre.

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await Pais(); // Aquí obtienes los datos de los países
      setCountries(response); // Guardamos el arreglo de países
    } catch (err) {
      setError(err); // En caso de error, guardamos el error
    } finally {
      setLoadingData(false); // Finaliza el proceso de carga
    }
  };

  if (!isOpen) return null; // No muestra nada si el modal no está abierto.

  // Ordenamos los países por nombre (alfabéticamente)
  const sortedCountries = countries?.sort((a, b) => {
    const countryA = a?.fields?.Pais.toUpperCase(); // Ignoramos mayúsculas/minúsculas
    const countryB = b?.fields?.Pais.toUpperCase();
    if (countryA < countryB) return -1;
    if (countryA > countryB) return 1;
    return 0; // Si son iguales, no cambia el orden
  });

  // Agrupar los países por su primera letra
  const groupedCountries = sortedCountries.reduce((acc, country) => {
    const firstLetter = country?.fields?.Pais.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(country);
    return acc;
  }, {});

  const handleCountrySelect = async (country) => {
    if (!userId) {
      console.error("No se encontró un ID de usuario válido");
      return;
    }

    try {
      const newPaisId = country.id; // ID del nuevo país seleccionado

      // 1️⃣ **Actualizar el país en Airtable**
      await userData(userId, newPaisId);

      // 2️⃣ **Actualizar localStorage**
      const updatedUser = { ...user, pais: [newPaisId] };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 3️⃣ **Actualizar el estado**
      setSelectedCountry(country.fields.Pais);
      // ❌ 4. Cerrar el modal
      onClose();

      // 🔃 5. Recargar la página
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el país:", error);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <div className="modal-content">
          <div className="modal-body">
            {loadingData ? (
              <p>Loading...</p> // Muestra un texto de carga mientras se obtiene la data.
            ) : error ? (
              <p>Error: {error.message}</p> // Muestra un mensaje de error si ocurre un problema.
            ) : (
              <div className="country-list">
                {Object.keys(groupedCountries).map((letter) => (
                  <div key={letter} className="country-group">
                    <h3 className="country-letter">{letter}</h3>
                    <div className="country-items">
                      {groupedCountries[letter].map((country, index) => (
                        <div
                          key={index}
                          className={`country-item ${
                            selectedCountry === country.fields.Pais
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <img
                            src={
                              selectedCountry === country.fields.Pais && iconoOn
                                ? iconoOn
                                : icono
                            }
                            className="country-icon"
                          />
                          <span className="country-name">
                            {country?.fields?.Pais}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
