// airtableService.js

import axios from "axios";
// import { AIRTABLE_API_URL, AIRTABLE_BASE_ID, AIRTABLE_API_KEY } from "./airtableConfig";
import bcrypt from "bcryptjs"; // Para hashear la contraseña
// Configuración base de Axios para Airtable
const airtable = axios.create({
  baseURL: `https://api.airtable.com/v0/app77bOEPhtE0MihH`,
  headers: {
    Authorization: `Bearer patRDw2pOkc97NLot.4be638a9ae5c86a5a8ca52cc07101b62f27cfd62a0d9547ec2b572e33ed0fe63`,
  },
});

// Función para obtener datos de la tabla principal
export const getData = async () => {
  try {
    const response = await airtable.get("/Elementos%20de%20portada"); // Cambia "NombreDeLaTablaPrincipal" al nombre real de la tabla en Airtable
    return response.data.records;
  } catch (error) {
    console.error("Error al obtener datos de Airtable:", error);
    throw error;
  }
};

// Función para obtener datos de "Servicios Mensuales"
export const getServiciosMensuales = async () => {
  try {
    const response = await airtable.get("/Mensuales");

    // Usando el ID de la tabla
    return response.data.records;
  } catch (error) {
    console.error(
      "Error al obtener datos de Servicios Mensuales en Airtable:",
      error
    );
    throw error;
  }
};

// Función para obtener datos de "Páginas Adicionales"
export const getPaginasAdicionales = async () => {
  try {
    const response = await airtable.get("/Páginas%20básicas");
    return response.data.records;
  } catch (error) {
    console.error(
      "Error al obtener datos de Páginas Adicionales en Airtable:",
      error
    );
    throw error;
  }
};
// Función para obtener datos de "Funciones Adicionales"
export const getFuncionesAdicionales = async () => {
  try {
    const response = await airtable.get("/Funciones%20adicionales");
    return response.data.records;
  } catch (error) {
    console.error(
      "Error al obtener datos de Páginas Adicionales en Airtable:",
      error
    );
    throw error;
  }
};
export const getCotizador = async () => {
  try {
    const response = await airtable.get("/productos");
    return response.data.records;
  } catch (error) {
    console.error(
      "Error al obtener datos de Páginas Adicionales en Airtable:",
      error
    );
    throw error;
  }
};

//consulta por id
export const fetchPortadaElementos = async (id) => {
  try {
    const response = await airtable.get(`/Elementos%20de%20portada/${id}`);
    return response.data.fields["Secciones de portada básicas "];
  } catch (error) {
    console.error("Error al obtener datos de portada desde Airtable:", error);
    throw error;
  }
};

// Función para obtener datos de "Páginas Adicionales"
export const fetchPaginasBasicas = async (id) => {
  try {
    const response = await airtable.get(`/Páginas%20básicas/${id}`);
    return response.data.fields.paginas;
  } catch (error) {
    console.error(
      "Error al obtener datos de páginas básicas desde Airtable:",
      error
    );
    throw error;
  }
};

// Función para obtener datos de "Funciones Adicionales"
export const fetchFuncionesExtras = async (id) => {
  try {
    const response = await airtable.get(`/Funciones%20adicionales/${id}`);
    return response.data.fields["Páginas avanzadas "];
  } catch (error) {
    console.error(
      "Error al obtener datos de funciones adicionales desde Airtable:",
      error
    );
    throw error;
  }
};
export const postCotizacion = async (data) => {
  const payload = {
    fields: {
      Producto: data?.Producto || "",
      funciones_mensuales: data?.funciones_mensuales || "",
      secciones: data?.secciones || "",
      paginas: data?.paginas || "",
      Funciones: data?.Funciones || "",
      secciones_extra: data?.secciones_extra || "",
      paginas_extra: data?.paginas_extra || "",
      total: Number(data?.total) || 0, // Asegúrate de que `total` sea un número
      Cliente: data?.Cliente || "", // Datos del cliente
      email: data?.email || "", // Correo electrónico
      company: data?.company || "", // Nombre de la empresa
      Cargo: data?.position || "", // Cargo que ocupa
      comments: data?.comments || "", // Comentarios
    },
  };
  try {
    const response = await airtable.post(`/cotizaciones/`, payload);
    return response;
  } catch (error) {
    console.error(
      "Error al obtener datos de funciones adicionales desde Airtable:",
      error
    );
    throw error;
  }
};
export const sendEmail = async (data) => {
  console.log(data);

  // Función auxiliar para garantizar que todos los valores sean cadenas
  const safeString = (value) =>
    value !== undefined && value !== null ? String(value) : "";

  const payload = {
    email: safeString(data?.email), // Correo electrónico
    cliente: safeString(data?.Cliente), // Nombre del cliente
    fecha: safeString(data?.fecha), // Fecha
    company: safeString(data?.company), // Nombre de la empresa
    cargo: safeString(data?.position), // Cargo
    producto: safeString(data?.Producto), // Producto
    funciones_mensuales: safeString(data?.funciones_mensuales), // Funciones mensuales
    secciones: safeString(data?.secciones), // Secciones
    secciones_extra: safeString(data?.secciones_extra), // Secciones extra
    paginas: safeString(data?.paginas), // Páginas
    paginas_extra: safeString(data?.paginas_extra), // Páginas extra
    funciones: safeString(data?.Funciones), // Funciones adicionales
    total: safeString(data?.total), // Total
    comments: safeString(data?.comments), // Comentarios
  };

  console.log(payload);

  try {
    const response = await fetch(
      "https://detipcompany.pythonanywhere.com/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al enviar el correo: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};

export const authenticateUser = async (username, password) => {
  try {
    const response = await airtable.get(`/users`, {
      params: {
        filterByFormula: `username = '${username}'`,
      },
    });

    if (response.data.records.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = response.data.records[0];
    const fields = user.fields;

    // Verificar si no tiene contraseña y está inactivo
    if (!fields.password && fields.Status === "inactivo") {
      return {
        requiresPasswordSetup: true,
        id: user.id,
        username: fields.username,
      };
    }

    // Comparar la contraseña ingresada con la almacenada (hasheada)
    const isMatch = await bcrypt.compare(password, fields.password);
    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    // Retornar el usuario autenticado
    return {
      id: user.id,
      name: fields.Name,
      username: fields.username,
      tipoUser: fields.TipoUser,
      pais: fields.America,
    };
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};

export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const payload = {
    fields: {
      password: hashedPassword,
      Status: "activo",
    },
  };

  try {
    const response = await airtable.patch(`/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    throw error;
  }
};

export const postGpt = async (data) => {
  const payload = {
    fields: {
      nombreCliente: data?.nombreCliente || "",
      rubro: data?.rubro || "",
      pais: data?.pais || "",
      tamanoInforme: data?.tamanoInforme || "",
      tipoProducto: data?.tipoProducto || "",
      usuarios: data?.usuarios || "",
      interfazProducto: data?.interfazProducto || "",
      tiempoImplementacion: data?.tiempoImplementacion || "",
      tamanoEquipo: data?.tamanoEquipo || "",
      descripcionEmpresa: data?.descripcionEmpresa || "",
      descripcionProducto: data?.descripcionProducto || "",
      hardware: data?.hardware || "",
      beneficiosProducto: data?.beneficiosProducto || "",
      modulos: data?.modulos || "",
      notas: data?.notas || "",
      soporteDigital: data?.soporteDigital || false,
      formacionUso: data?.formacionUso || false,
      integracionTerceros: data?.integracionTerceros || "",
    },
  };

  try {
    const response = await airtable.post(`/Requerimientos_proyecto/`, payload);
    return response;
  } catch (error) {
    console.error(
      "Error al obtener datos de funciones adicionales desde Airtable:",
      error
    );
    throw error;
  }
};
// src/controllers/apiController.js
export const getChatGPTResponse = async (prompt) => {
  try {
    const response = await fetch("http://localhost:5000/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }), // Enviar el prompt al backend
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud al backend");
    }

    const data = await response.json();
    return data.message; // Devuelve el contenido del mensaje de ChatGPT
  } catch (error) {
    console.error("Error al obtener la respuesta de ChatGPT:", error);
    throw error;
  }
};
// Función para obtener datos de "Funciones Adicionales"
export const precioPais = async (id) => {
  try {
    const response = await airtable.get(`/Paises/${id}`);
    return response.data.fields;
  } catch (error) {
    console.error("Error al obtener datos de paises desde Airtable:", error);
    throw error;
  }
};

export const Pais = async () => {
  try {
    const response = await airtable.get(`/Paises/`);
    return response.data.records;
  } catch (error) {
    console.error("Error al obtener datos de paises desde Airtable:", error);
    throw error;
  }
};
export const userData = async (userId, newPais) => {
  const payload = {
    fields: {
      America: [newPais] // Asegúrate de que el formato coincida con lo que espera Airtable
    },
  };

  try {
    const response = await airtable.patch(`/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el país en Airtable:", error);
    throw error;
  }
};
