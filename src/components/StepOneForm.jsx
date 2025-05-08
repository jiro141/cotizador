import React from "react";

const StepOneForm = ({ input, handleChange, handleSubmit, handleBack }) => {
  return (
    <div
      className="custom-form"
      style={{
        minWidth: "800px",
      }}
    >
      <div className="form-group">
        <input
          type="text"
          name="nombre"
          value={input.cliente.nombre}
          onChange={handleChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label className={`form-label ${input.cliente.nombre ? "active" : ""}`}>
          Nombre del Cliente
        </label>
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

      <div className="form-group">
        <input
          type="text"
          name="descripcion_empresa"
          value={input.descripcion_empresa}
          onChange={handleChange}
          className="form-input"
          placeholder=" "
          required
        />
        <label
          className={`form-label ${input.descripcion_empresa ? "active" : ""}`}
        >
          Nombre de la Empresa
        </label>
      </div>

      <div className="form-group">
        <select
          name="tipo_informe"
          value={input.tipo_informe}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Selecciona tipo de informe</option>
          <option value="informe tipo 1">Básico</option>
        </select>
        <label className={`form-label ${input.tipo_informe ? "active" : ""}`}>
          Tipo de Informe
        </label>
      </div>

      <div className="form-group" style={{ gridArea: "area7" }}>
        <textarea
          name="notas"
          value={input.notas}
          onChange={handleChange}
          className="form-input"
          rows="3"
        ></textarea>
        <label className={`form-label ${input.notas ? "active" : ""}`}>
          Notas
        </label>
      </div>

      <div></div>
      <div></div>

      <div className="form-column2">
        <a className="login-olvido" onClick={handleBack}>
          Volver
        </a>
      </div>
      <div className="form-column2">
        <button onClick={handleSubmit} className="quote-button">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default StepOneForm;
