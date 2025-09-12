import React, { useState, useEffect, useContext } from "react";
import { GoPlusCircle } from "react-icons/go";
import { MyContext } from "../context/Context";
import { postCotizacion, sendEmail } from "../controller/api";
import toast, { Toaster } from "react-hot-toast";
import Separator from "./Separator";
import logo from "../img/banner.png";
import frente from "../img/frente.png";
import { createHtmlFile1 } from "../layout/documents/Informe1";
import ModalInforme from "./ModalInforme";
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
  const [showModal, setShowModal] = useState(false);
  const [docData, setDocData] = useState(null);
  const { state, setFormData, formData } = useContext(MyContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));


  const totalServicios = selectedServicios.reduce(
    (sum, item) => sum + Number(item.valor),
    0
  );
  const totalServicios2 = selectedServicios.reduce(
    (sum, item) => sum + Number(item?.precio || 0),
    0
  );
  const totalSecciones = selectedSeccionesMax.reduce(
    (sum, item) => sum + Number(item.valor),
    0
  );
  const totalPaginasExtra = exceededPaginas.reduce(
    (sum, item) => sum + Number(item.valor),
    0
  );
  const totalFunciones = selectedFunciones.reduce(
    (sum, item) => sum + Number(item.valor),
    0
  );

  const [isLoading, setIsLoading] = useState(false);

  let total =
    (totalSecciones + totalFunciones + precio + totalPaginasExtra) * precioPais;

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

  if (descuentos[state]) {
    total -= descuentos[state];
  }

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
      ...prev,
      Cliente: formData.cliente.nombre,
      email: formData.cliente.email,
      Cargo: formData.cliente.cargo,
      company: formData.descripcion_empresa,
      Producto: state || "",
      funciones_mensuales: (selectedServicios || [])
        .map((item) => item?.producto || "")
        .join(", "),
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
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
        .join(", "),
      paginas: Object.entries(
        (selectedPaginas || []).reduce((acc, item) => {
          const name = item.name || item.paginas || "";
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
        .join(", "),
      total: total || 0,
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

  const formatFormDataToText = (data) => {
    let output = "";

    // Datos principales
    if (data.tipo_producto)
      output += `**Tipo de producto:** ${data.tipo_producto}\n`;
    if (data.descripcion_empresa)
      output += `**Empresa:** ${data.descripcion_empresa}\n`;
    if (data.cliente) {
      output += `**Cliente:** ${data.cliente.nombre || "N/A"} (${
        data.cliente.cargo || "N/A"
      }, ${data.cliente.rubro || "N/A"}, ${data.cliente.email || "N/A"})\n`;
    }
    if (data.descripcion_producto)
      output += `**Precio final:** ${data.descripcion_producto}\n`;
    if (data.hardware) output += `**Hardware:** ${data.hardware}\n`;
    if (data.modulos) output += `**Módulos:** ${data.modulos}\n`;
    if (data.notas) output += `**Notas:** ${data.notas}\n`;

    // Beneficios
    if (data.beneficios && typeof data.beneficios === "object") {
      output += `\n**Beneficios:**\n`;
      Object.entries(data.beneficios).forEach(([categoria, items]) => {
        output += `\n- **${categoria}:**\n`;
        items.forEach((item) => {
          if (item.value) output += `   - ${item.value}\n`;
        });
      });
    }

    return output.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      // Transformar formData a texto en formato Markdown
      const contenidoTexto = formatFormDataToText(formData);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.access;

      const dataToSend = {
        contenido: contenidoTexto,
        correo:
          String(storedUser.username || "").trim() || "sin-correo@ejemplo.com",
        cliente:
          String(formData.cliente.nombre || "").trim() || "Cliente Genérico",
        empresa:
          String(formData.descripcion_empresa || "").trim() ||
          "Empresa Genérica",
      };

      // 🚀 Enviar al backend con el token JWT
      await toast.promise(
        (async () => {
          const response = await fetch(
            "http://127.0.0.1:8000/api/create-doc/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // 👈 JWT aquí
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

          setDocData(responseData); // guardas la info
          setShowModal(true); // abres modal
        })(),
        {
          loading: "🛰️ Enviando tu documento...",
          success: "🚀 Documento creado con éxito.",
          error: "💥 Error al crear el documento.",
        }
      );
    } catch (error) {
      console.log(error);

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

    const serviciosText = (selectedServicios || [])
      .map((item) => item?.producto?.toLowerCase() || "")
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
    <div className="calculator-container2">
      <Toaster />
      <div className="calculator-content">
        <div className="items-section">
          <h3 className="section-title">
            <strong>{selectedServicios.length > 0 ? "Servicios" : ""}</strong>
          </h3>
          {selectedServicios.length > 0 && (
            <>
              <ul className="items-list">
                {selectedServicios.map((item) => (
                  <li key={`servicio-${item.id}`} className="item-name">
                    {item.producto}
                  </li>
                ))}
              </ul>

              <div className="totals">
                <h4>
                  Total de los servicios mensuales: $
                  {(totalServicios * precioPais).toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h4>
                <Separator />
                <h4>
                  Total de los servicios anuales: $
                  {totalServicios2.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h4>
                <Separator />
              </div>
            </>
          )}

          {selectedSecciones.length > 0 && (
            <div className="secciones-container">
              <h3 className="section-title">
                <strong>Secciones</strong>
              </h3>
              <ul className="items-list">
                {selectedSecciones.map((item) => (
                  <li key={`seccion-${item.id}`} className="item-name">
                    {item.name} {item["Secciones de portada básicas "]}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedSeccionesMax.length > 0 && (
            <div className="extra-sections-container">
              <h3 className="section-title">
                <strong>Secciones Extra</strong>
              </h3>
              <ul className="items-list">
                {selectedSeccionesMax.map((item) => (
                  <li
                    key={`max-seccion-${item.id}`}
                    className="item-name extra-item flex justify-center"
                  >
                    <GoPlusCircle className="icon-extra-section" />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h3 className="section-title">
            <strong>{selectedPaginas.length > 0 ? "Paginas" : ""}</strong>
          </h3>
          <ul className="items-list">
            {selectedPaginas.length > 0 &&
              Object.entries(
                selectedPaginas.reduce((acc, item) => {
                  acc[item.id] = acc[item.id] || { ...item, count: 0 };
                  acc[item.id].count += 1;
                  return acc;
                }, {})
              ).map(([id, item]) => (
                <li key={`pagina-${id}`} className="item-name">
                  {item.name ? item.name : item.pagina}{" "}
                  {item.count > 1 ? `x${item.count}` : ""}
                </li>
              ))}
          </ul>
          {exceededPaginas.length > 0 && (
            <>
              <h3 className="section-title">
                <strong>
                  {exceededPaginas.length > 0 ? "Paginas extra" : ""}
                </strong>
              </h3>
              <ul className="items-list">
                {Object.entries(
                  exceededPaginas.reduce((acc, item) => {
                    acc[item.id] = acc[item.id] || { ...item, count: 0 };
                    acc[item.id].count += 1;
                    return acc;
                  }, {})
                ).map(([id, item]) => (
                  <li key={`pagina-${id}`} className="item-name extra-item">
                    <GoPlusCircle className="icon-extra-page" />
                    {item.name ? item.name : item.pagina}{" "}
                    {item.count > 1 ? `x${item.count}` : " "}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 className="section-title">
            <strong>{selectedFunciones.length > 0 ? "Funciones" : ""}</strong>
          </h3>
          <ul className="items-list">
            {selectedFunciones.length > 0 &&
              selectedFunciones.map((item) => (
                <li key={`pagina-${item.id}`} className="item-name">
                  {item.name}
                </li>
              ))}
          </ul>
          <p className="total-price">Total: ${total.toFixed(2)}</p>
          <div className="div-boton">
            <button onClick={handleSubmit} className="quote-button">
              Enviar Formulario
            </button>
          </div>
        </div>
      </div>
      <ModalInforme
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={docData}
      />
    </div>
  );
}
