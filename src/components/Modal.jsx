import React, { useState, useEffect } from "react";
import { Pais } from "../controller/api";
import icono from "../img/location_on.svg";
import iconoOn from "../img/location_on1.svg";
import Separator from "./Separator";
import { userData } from "../controller/api";
import globo from "../img/globe_location_pin (1).svg";

const Modal = ({ isOpen, onClose }) => {
  const [countries, setCountries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const paisId = user?.pais;
  const userId = user?.id;
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (paisId && countries.length > 0) {
      const country = countries.find((c) => c.id === paisId);
      if (country) {
        setSelectedCountry(country.nombre);
      }
    }
  }, [paisId, countries]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await Pais();
      setCountries(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const filteredCountries = countries.filter((c) =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCountries = filteredCountries.sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );

  const groupedCountries = sortedCountries.reduce((acc, country) => {
    const firstLetter = country.nombre.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(country);
    return acc;
  }, {});

  const handleCountrySelect = async (country) => {
    if (!userId) {
      console.error("No se encontró un ID de usuario válido");
      return;
    }

    try {
      const newPaisId = country.id;
      await userData(userId, newPaisId);

      const updatedUser = { ...user, pais: newPaisId };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSelectedCountry(country.nombre);
      onClose();
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
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              <>
                {/* 🔍 Campo de búsqueda */}
                <input
                  type="text"
                  className="search-input"
                  placeholder={"Buscar país..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="country-list">
                  {Object.keys(groupedCountries).map((letter) => (
                    <div key={letter} className="country-group">
                      <h3 className="country-letter">{letter}</h3>
                      <div className="country-items">
                        {groupedCountries[letter].map((country) => (
                          <div
                            key={country.id}
                            className={`country-item ${
                              selectedCountry === country.nombre ? "selected" : ""
                            }`}
                            onClick={() => handleCountrySelect(country)}
                          >
                            <img
                              src={
                                selectedCountry === country.nombre
                                  ? iconoOn
                                  : icono
                              }
                              className="country-icon"
                              alt="icono"
                            />
                            <span className="country-name">{country.nombre}</span>
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
