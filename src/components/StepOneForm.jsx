import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getClientes } from "../controller/api";

const StepOneForm = ({ input, handleChange, setFormData }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [suggestions, setSuggestions] = useState([]);
  const [searchField, setSearchField] = useState(null);
  const [query, setQuery] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (query.length < 2 || !searchField || !isHome) {
      setSuggestions([]);
      setDropdownVisible(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await getClientes(query);
        setSuggestions(results);
        setDropdownVisible(true);
      } catch (err) {
        setSuggestions([]);
        setDropdownVisible(false);
      }
    }, 300);
  }, [query, searchField, isHome]);

  const handleSuggestionClick = (suggestion) => {
    const updatedInput = {
      ...input,
      cliente: {
        nombre: suggestion.nombre,
        cargo: suggestion.cargo,
        rubro: suggestion.rubro || "",
        email: suggestion.email,
      },
      descripcion_empresa: suggestion.descripcion_empresa,
    };

    handleChange({
      target: { name: "nombre", value: updatedInput.cliente.nombre },
    });
    handleChange({
      target: { name: "cargo", value: updatedInput.cliente.cargo },
    });
    handleChange({
      target: { name: "rubro", value: updatedInput.cliente.rubro },
    });
    handleChange({
      target: { name: "email", value: updatedInput.cliente.email },
    });
    handleChange({
      target: {
        name: "descripcion_empresa",
        value: updatedInput.descripcion_empresa,
      },
    });


    setFormData(updatedInput);

    setDropdownVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if ((name === "nombre" || name === "descripcion_empresa") && isHome) {
      setSearchField(name);
      setQuery(value);
    }

    handleChange(e);
  };

  const renderSuggestions = () => {
    if (!isDropdownVisible || suggestions.length === 0) return null;
    return (
      <ul className="autocomplete-dropdown">
        {suggestions.map((sug, idx) => (
          <li key={idx} onClick={() => handleSuggestionClick(sug)}>
            {searchField === "nombre" ? sug.nombre : sug.descripcion_empresa}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className="custom-form"
      style={{ minWidth: isHome ? undefined : "800px" }}
    >
      <div className="form-group" style={{ position: "relative" }}>
        <input
          type="text"
          name="nombre"
          value={input.cliente.nombre}
          onChange={handleInputChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label className={`form-label ${input.cliente.nombre ? "active" : ""}`}>
          Nombre del Cliente
        </label>
        {searchField === "nombre" && renderSuggestions()}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="cargo"
          value={input.cliente.cargo}
          onChange={handleChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label className={`form-label ${input.cliente.cargo ? "active" : ""}`}>
          Cargo
        </label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="rubro"
          value={input.cliente.rubro}
          onChange={handleChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label className={`form-label ${input.cliente.rubro ? "active" : ""}`}>
          Rubro
        </label>
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          value={input.cliente.email}
          onChange={handleChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label className={`form-label ${input.cliente.email ? "active" : ""}`}>
          Correo Electrónico
        </label>
      </div>

      <div className="form-group" style={{ position: "relative" }}>
        <input
          type="text"
          name="descripcion_empresa"
          value={input.descripcion_empresa}
          onChange={handleInputChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label
          className={`form-label ${input.descripcion_empresa ? "active" : ""}`}
        >
          Nombre de la Empresa
        </label>
        {searchField === "descripcion_empresa" && renderSuggestions()}
      </div>
    </div>
  );
};

export default StepOneForm;
