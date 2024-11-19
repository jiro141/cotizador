// airtableService.js

import axios from "axios";
// import { AIRTABLE_API_URL, AIRTABLE_BASE_ID, AIRTABLE_API_KEY } from "./airtableConfig";

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
      Producto: data.Producto || "",
      funciones_mensuales: data.funciones_mensuales || "",
      secciones: data.secciones || "",
      paginas: data.paginas || "",
      Funciones: data.Funciones || "",
      secciones_extra: data.secciones_extra || "",
      paginas_extra: data.paginas_extra || "",
      total: data.total || 0,
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
