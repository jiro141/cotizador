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
    console.error("Error al obtener datos de Servicios Mensuales en Airtable:", error);
    throw error;
  }
};

// Función para obtener datos de "Páginas Adicionales"
export const getPaginasAdicionales = async () => {
  try {
    const response = await airtable.get("/Páginas%20básicas"); 
    return response.data.records;
  } catch (error) {
    console.error("Error al obtener datos de Páginas Adicionales en Airtable:", error);
    throw error;
  }
};
