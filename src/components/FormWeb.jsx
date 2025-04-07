import React, { useState, useContext } from "react";
import { MyContext } from "../context/Context";

const FormWeb = () => {
  const { setFormData } = useContext(MyContext);
  const [step, setStep] = useState(1);

  const [input, setInput] = useState({
    tipo_informe: "",
    tipo_producto: "",
    usuarios: "no requiere",
    interfaz_producto: "web",
    tiempo_implementacion: "",
    tamano_equipo: "",
    descripcion_empresa: "",
    descripcion_producto: "",
    hardware: "",
    beneficios_producto: "",
    modulos: "",
    notas: "",
    soporte_digital: false,
    formacion_uso: false,
    integracion_terceros: "No requiere",
    cliente: {
      nombre: "",
      cargo: "",
      rubro: "",
      email: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si es cliente.*
    if (["nombre", "cargo", "rubro", "email"].includes(name)) {
      setInput((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          [name]: value,
        },
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(input); // Guardar todo el formulario en contexto
  };

  return (
    <div className="calculator-container full">
      <form onSubmit={handleSubmit} className="custom-form calculator-content">
        {step === 1 && (
          <>
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
              <label
                className={`form-label ${input.cliente.nombre ? "active" : ""}`}
              >
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
              <label
                className={`form-label ${input.cliente.cargo ? "active" : ""}`}
              >
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
              <label
                className={`form-label ${input.cliente.rubro ? "active" : ""}`}
              >
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
              <label
                className={`form-label ${input.cliente.email ? "active" : ""}`}
              >
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
                className={`form-label ${
                  input.descripcion_empresa ? "active" : ""
                }`}
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
                <option value="informe tipo 1">Basico</option>
                {/* <option value="informe tipo 2">informe tipo 2</option>
                <option value="informe tipo 3">informe tipo 3</option> */}
              </select>
              <label
                className={`form-label ${input.tipo_informe ? "active" : ""}`}
              >
                Tipo de Informe
              </label>
            </div>

            <div className="form-group">
              <textarea
                name="beneficios_producto"
                value={input.beneficios_producto}
                onChange={handleChange}
                className="form-input"
                rows="3"
              ></textarea>
              <label
                className={`form-label ${
                  input.beneficios_producto ? "active" : ""
                }`}
              >
                Beneficios del Producto
              </label>
            </div>

            <div className="form-group">
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

            <button type="submit" className="quote-button">
              Siguiente
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default FormWeb;
