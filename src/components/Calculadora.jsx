import React, { useState, useEffect, useContext } from "react";
import { GoPlusCircle } from "react-icons/go";
import { MyContext } from "../context/Context";
import { postCotizacion } from "../controller/api";
import toast, { Toaster } from "react-hot-toast";
import { sendEmail } from "../controller/api";
import logo from "../img/banner.png";
import frente from "../img/frente.png";
import { createHtmlFile1 } from "../layout/documents/Informe1";
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
  precio,
  onCheckboxChange,
}) {
  const precioPais = JSON.parse(localStorage.getItem("precio"));

  const { state, setFormData, formData } = useContext(MyContext);

  // Calcular el precio total multiplicando por precioPais

  const totalSecciones = selectedSeccionesMax.reduce(
    (sum, item) => sum + Number(item.Valor),
    0 // Se asegura de que el reduce siempre empiece desde 0
  );

  const totalPaginasExtra = exceededPaginas.reduce(
    (sum, item) => sum + Number(item.Valor),
    0 // Agregado el valor inicial
  );

  const totalFunciones = selectedFunciones.reduce(
    (sum, item) => sum + Number(item.Valor),
    0 // Agregado el valor inicial
  );
  const [isLoading, setIsLoading] = useState(false);
  let total =
    (totalSecciones + totalFunciones + precio + totalPaginasExtra) * precioPais;

  // Dependiendo del estado (state), restamos algunos valores
  // Mapeo de estados a descuentos
  const descuentos = {
    WebDeReservaciones: selectedFunciones[0]?.Valor * precioPais,
    PaginaCorporativa: selectedFunciones[0]?.Valor * precioPais,
    WebInformativa: selectedFunciones[0]?.Valor * precioPais,
    Blog: selectedFunciones[0]?.Valor * precioPais,
    PaginaDeMembresia:
      selectedFunciones[0]?.Valor * precioPais +
      selectedFunciones[1]?.Valor * precioPais,
    Foro:
      selectedFunciones[0]?.Valor * precioPais +
      selectedFunciones[1]?.Valor * precioPais,
    eCommerce: selectedFunciones[0]?.Valor * precioPais,
  };

  // Si el estado existe en el mapeo, restamos el descuento correspondiente
  if (descuentos[state]) {
    total -= descuentos[state];
  }

  // Otras condiciones para más estados
  // Puedes agregar más lógica dependiendo de lo que necesites

  const [formData1, setformData1] = useState({
    Producto: "",
    funciones_mensuales: "",
    secciones: "",
    paginas: "",
    Funciones: "",
    secciones_extra: "",
    paginas_extra: "",
    total: 0,
    Cliente: "",
    email: "",
    company: "",
    position: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData1({ ...formData1, [name]: value });
  };

  useEffect(() => {
    setformData1((prev) => ({
      ...prev, // Correctamente envuelto en paréntesis
      Cliente: formData.cliente.nombre,
      email: formData.cliente.email,
      Cargo: formData.cliente.cargo,
      company: formData.descripcion_empresa,
      Producto: state || "", // Asegura que `state` tenga un valor predeterminado si es null o undefined
      funciones_mensuales: (selectedServicios || [])
        .map((item) => item.fields?.Producto || "")
        .join(", "), // Convierte el arreglo en un string separado por comas
      secciones: (selectedSecciones || [])
        .map((item) => item.name || "" || item["Secciones de portada básicas "])
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
        .join(", "), // Convierte el resultado en un string separado por comas

      paginas: Object.entries(
        (selectedPaginas || []).reduce((acc, item) => {
          const name = item.name || item.paginas || "";
          acc[name] = (acc[name] || 0) + 1; // Cuenta las repeticiones
          return acc;
        }, {})
      )
        .map(([name, count]) => (count > 1 ? `${name} x${count}` : name)) // Agrega "x2, x3" si hay repeticiones
        .join(", "), // Convierte el resultado en un string separado por comas

      total: total || 0, // Asegura que `total` sea un número, incluso si es undefined
    }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // por si usas algún loader

    try {
      // // === PRIMERA ACCIÓN: postCotizacion y sendEmail ===
      // const [cotizacion, correo] = await Promise.all([
      //   postCotizacion(formData1),
      //   sendEmail(formData1),
      // ]);

      // if (cotizacion && correo) {
      //   toast("🚀 Cotización y correo enviados con éxito", {
      //     icon: "📧",
      //     style: {
      //       borderRadius: "10px",
      //       background: "#2C2C2C",
      //       color: "#fff",
      //     },
      //   });
      // }

      // === SEGUNDA ACCIÓN: Enviar a tu API personalizada ===
      const dataToSend = {
        ...formData,
        tiempo_implementacion:
          formData.tiempo_implementacion.trim() || "Sin comentarios",
        hardware: formData.hardware.trim() || "No requiere",
        integracion_terceros:
          formData.integracion_terceros.trim() || "No requiere",
        notas: formData.notas.trim() || "Sin comentarios",
        tamano_equipo: formData.tamano_equipo.trim() || 1,
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

      // ✅ Todo listo: reiniciar si quieres
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
    } catch (error) {
      console.error("❌ Error general en envío:", error);
      toast("❌ Hubo un error al enviar los datos", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const secciones = (selectedSecciones || [])
      .map((item) => item.name || item["Secciones de portada básicas "] || "")
      .filter(Boolean)
      .sort();

    const seccionesExtra = (selectedSeccionesMax || [])
      .map((item) => item.name || "")
      .sort();

    const funciones = (selectedFunciones || [])
      .map((item) => item.name || "")
      .sort();

    const paginas = Object.entries(
      (selectedPaginas || []).reduce((acc, item) => {
        const name = item.name || item.paginas || "";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
      .sort();

    const paginasExtra = Object.entries(
      (exceededPaginas || []).reduce((acc, item) => {
        const name = item.name || item.paginas || "";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
      .sort();

    const modulos = [
      secciones.length > 0 ? `Secciones: ${secciones.join(", ")}` : null,
      seccionesExtra.length > 0
        ? `Secciones Extra: ${seccionesExtra.join(", ")}`
        : null,
      paginas.length > 0 ? `Páginas: ${paginas.join(", ")}` : null,
      paginasExtra.length > 0
        ? `Páginas Extra: ${paginasExtra.join(", ")}`
        : null,
      funciones.length > 0 ? `Funciones: ${funciones.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // ⚡ Detección de palabras clave
    const serviciosText = (selectedServicios || [])
      .map((item) => item.fields?.Producto?.toLowerCase() || "")
      .join(" ");

    const soporte_digital = serviciosText.includes("web master");
    const hardware = serviciosText.includes("hosting")
      ? "Hosting incluido"
      : "";

    const newFormValues = {
      tipo_producto: state || "",
      modulos,
      descripcion_producto: `el producto tendra un coste total en dolares de: $${
        total || 0
      }`,
      soporte_digital,
      hardware,
    };

    setFormData((prev) => ({
      ...prev,
      ...newFormValues,
    }));
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

  return (
    <div className="calculator-container">
      <Toaster />
      <div className="calculator-content">
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
                      {item.name} {item["Secciones de portada básicas "]}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {selectedSeccionesMax.length > 0 && (
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
            <strong>{selectedPaginas.length > 0 ? "Paginas" : ""}</strong>
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
                  {exceededPaginas.length > 0 ? "Paginas Adicionales" : ""}
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
          <button onClick={handleSubmit} className="quote-button">
            Enviar Formulario
          </button>
        </div>
      </div>
    </div>
  );
}
