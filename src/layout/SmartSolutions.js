import React, { useEffect, useState } from "react";
import { createHtmlFile1 } from "./documents/Informe1";
import logo from "../img/banner.png";
import logo2 from "../img/cropped-logo.png";
import frente from "../img/frente.png";
import toast, { Toaster } from "react-hot-toast";
export default function SmartSolutions() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo_informe: "",
    tipo_producto: "",
    usuarios: "",
    interfaz_producto: "",
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
    integracion_terceros: "",
    cliente: {
      nombre: "",
      cargo: "",
      rubro: "",
      email: "",
    },
  });
  const loadingPhrases = [
    "Encendiendo motores principales...",
    "Ajustando los cinturones de seguridad intergalácticos...",
    "Calculando coordenadas estelares...",
    "Pidiendo permiso a la torre de control de datos...",
    "Cargando combustible digital extra premium...",
    "Última revisión de los sistemas del informe...",
    "Sincronizando con la base de datos lunar...",
    "Iniciando cuenta regresiva para el despegue...",
    "Alineando los satélites de conocimiento...",
    "Ignición en 3... 2... 1...",
    "¡Informe en camino a la estratósfera del éxito!",
  ];

  const [currentPhrase, setCurrentPhrase] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const phrase = loadingPhrases[phraseIndex];
    if (charIndex < phrase.length) {
      const timeout = setTimeout(() => {
        setCurrentPhrase((prev) => prev + phrase.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
        setCharIndex(0);
        setCurrentPhrase("");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, charIndex, phraseIndex]);

  const toBase64 = (url) => {
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si es un campo del objeto cliente
    if (["nombre", "cargo", "rubro", "email"].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        cliente: {
          ...prevData.cliente,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ⏳ Mostrar spinner

    const currentPath = window.location.pathname;

    let tipoProducto = formData.tipo_producto;
    if (currentPath === "/smarSolution") {
      tipoProducto = "Smart Solution";
    } else if (currentPath === "/webEsencial") {
      tipoProducto = "Web Esencial";
    } else if (currentPath === "/pwa") {
      tipoProducto = "Aplicación PWA";
    }

    const dataToSend = {
      ...formData,
      tipo_producto: tipoProducto,
      notas: formData.notas.trim() || "Sin comentarios",
      hardware: formData.hardware.trim() || "No requiere",
      integracion_terceros:
        formData.integracion_terceros.trim() || "No requiere",
    };

    await toast.promise(
      (async () => {
        const response = await fetch(
          "https://jiro141.pythonanywhere.com/api/informes/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (!response.ok) {
          let message = `Error ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData?.message) message += `: ${errorData.message}`;
          } catch {}
          throw new Error(message);
        }

        const responseData = await response.json();

        const [logoBase64, frenteBase64] = await Promise.all([
          toBase64(logo),
          toBase64(frente),
        ]);

        createHtmlFile1({
          ...responseData,
          logo: logoBase64,
          frente: frenteBase64,
        });
      })(),
      {
        loading: "🛰️ Enviando tu informe al espacio...",
        success: "🚀 Formulario enviado con éxito.",
        error: "💥 Algo falló al despegar... inténtalo de nuevo.",
      }
    );

    setIsLoading(false); // ✅ Ocultar spinner
  };

  return (
    <>
      <Toaster />
      {isLoading && (
        <div className="spinner-container">
          <img src={logo2} alt="Cargando..." className="spinner" />
          <p className="loading-text">{currentPhrase}</p>
        </div>
      )}

      <h2 className="titulo">Formulario Smart Solutions</h2>
      <div className="calculator-container full">
        <form
          onSubmit={handleSubmit}
          className="custom-form calculator-content"
        >
          {step === 1 && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  value={formData.cliente.nombre}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.cliente.nombre ? "active" : ""
                  }`}
                >
                  Nombre del Cliente
                </label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="cargo"
                  value={formData.cliente.cargo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.cliente.cargo ? "active" : ""
                  }`}
                >
                  Cargo
                </label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="rubro"
                  value={formData.cliente.rubro}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.cliente.rubro ? "active" : ""
                  }`}
                >
                  Rubro
                </label>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.cliente.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.cliente.email ? "active" : ""
                  }`}
                >
                  Correo Electrónico
                </label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="descripcion_empresa"
                  value={formData.descripcion_empresa}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.descripcion_empresa ? "active" : ""
                  }`}
                >
                  Nombre de la Empresa
                </label>
              </div>

              <button type="button" className="quote-button" onClick={nextStep}>
                Siguiente
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <select
                  name="tipo_informe"
                  value={formData.tipo_informe}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Selecciona tipo de informe</option>
                  <option value="informe tipo 1">informe tipo 1</option>
                  <option value="informe tipo 2">informe tipo 2</option>
                  <option value="informe tipo 3">informe tipo 3</option>
                </select>
                <label
                  className={`form-label ${
                    formData.tipo_informe ? "active" : ""
                  }`}
                >
                  Tipo de Informe
                </label>
              </div>

              {/* <div className="form-group">
                <select
                  name="tipo_producto"
                  value={formData.tipo_producto}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Selecciona tipo de producto</option>
                  <option value="Web Esencial">Web Esencial</option>
                  <option value="Smart Solution">Smart Solution</option>
                  <option value="Digital Support">Digital Support</option>
                </select>
                <label
                  className={`form-label ${
                    formData.tipo_producto ? "active" : ""
                  }`}
                >
                  Tipo de Producto
                </label>
              </div> */}
              <div className="form-group">
                <select
                  name="interfaz_producto"
                  value={formData.interfaz_producto}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="" disabled>
                    Selecciona una interfaz
                  </option>
                  <option value="Web">Web</option>
                  <option value="Móvil">Móvil</option>
                  <option value="Escritorio">Escritorio</option>
                  <option value="PWA">PWA</option>
                  <option value="TV">TV</option>
                  <option value="Smartwatch">Smartwatch</option>
                  <option value="VR">VR</option>
                  <option value="Consola">Consola</option>
                  <option value="Todas">Todas</option>
                </select>
                <label
                  className={`form-label ${
                    formData.interfaz_producto ? "active" : ""
                  }`}
                >
                  Interfaz del Producto
                </label>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="usuarios"
                  value={formData.usuarios}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  min="1"
                  required
                />
                <label
                  className={`form-label ${formData.usuarios ? "active" : ""}`}
                >
                  Usuarios
                </label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="tiempo_implementacion"
                  value={formData.tiempo_implementacion}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.tiempo_implementacion ? "active" : ""
                  }`}
                >
                  Tiempo de Implementación
                </label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="tamano_equipo"
                  value={formData.tamano_equipo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                  required
                />
                <label
                  className={`form-label ${
                    formData.tamano_equipo ? "active" : ""
                  }`}
                >
                  Tamaño del Equipo
                </label>
              </div>
              <div></div>
              <button type="button" className="quote-button" onClick={prevStep}>
                Atrás
              </button>
              <button type="button" className="quote-button" onClick={nextStep}>
                Siguiente
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <textarea
                  name="descripcion_producto"
                  value={formData.descripcion_producto}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                  required
                ></textarea>
                <label
                  className={`form-label ${
                    formData.descripcion_producto ? "active" : ""
                  }`}
                >
                  Descripción del Producto
                </label>
              </div>

              <div className="form-group">
                <textarea
                  name="beneficios_producto"
                  value={formData.beneficios_producto}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                ></textarea>
                <label
                  className={`form-label ${
                    formData.beneficios_producto ? "active" : ""
                  }`}
                >
                  Beneficios del Producto
                </label>
              </div>
              <div className="form-group">
                <textarea
                  name="modulos"
                  value={formData.modulos}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                ></textarea>
                <label
                  className={`form-label ${formData.modulos ? "active" : ""}`}
                >
                  Módulos
                </label>
              </div>
              <div className="form-group">
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                ></textarea>
                <label
                  className={`form-label ${formData.notas ? "active" : ""}`}
                >
                  Notas
                </label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="hardware"
                  value={formData.hardware}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                />
                <label
                  className={`form-label ${formData.hardware ? "active" : ""}`}
                >
                  Hardware requierido
                </label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="integracion_terceros"
                  value={formData.integracion_terceros}
                  onChange={handleChange}
                  className="form-input"
                  placeholder=" "
                />
                <label
                  className={`form-label ${
                    formData.integracion_terceros ? "active" : ""
                  }`}
                >
                  Integración con terceros
                </label>
              </div>
              <div className="checkbox-wrapper-24">
                <input
                  type="checkbox"
                  id="check-soporte-digital"
                  name="soporte_digital"
                  checked={formData.soporte_digital}
                  onChange={handleChange}
                />
                <label htmlFor="check-soporte-digital">
                  <span></span>
                  Soporte Digital
                </label>
              </div>

              <div className="checkbox-wrapper-24">
                <input
                  type="checkbox"
                  id="check-formacion-uso"
                  name="formacion_uso"
                  checked={formData.formacion_uso}
                  onChange={handleChange}
                />
                <label htmlFor="check-formacion-uso">
                  <span></span>
                  Formación en el uso
                </label>
              </div>

              <button type="button" className="quote-button" onClick={prevStep}>
                Atrás
              </button>
              <button type="submit" className="quote-button">
                Enviar Formulario
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
}
