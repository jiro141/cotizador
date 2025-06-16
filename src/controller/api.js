// airtableService.js

import axios from "axios";
// import { AIRTABLE_API_URL, AIRTABLE_BASE_ID, AIRTABLE_API_KEY } from "./airtableConfig";
import bcrypt from "bcryptjs"; // Para hashear la contraseña
// Configuración base de Axios para Airtable
// const airtable = axios.create({
//   baseURL: `https://api.airtable.com/v0/app77bOEPhtE0MihH`,
//   headers: {
//     Authorization: `Bearer patRDw2pOkc97NLot.4be638a9ae5c86a5a8ca52cc07101b62f27cfd62a0d9547ec2b572e33ed0fe63`,
//   },
// });
const airtable = axios.create({
  baseURL: `https://detipcompany141.pythonanywhere.com/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Función para obtener datos de la tabla principal
export const getData = async () => {
  try {
    const response = await airtable.get("/elementos-portada"); // Cambia "NombreDeLaTablaPrincipal" al nombre real de la tabla en Airtable
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de Airtable:", error);
    throw error;
  }
};

// Función para obtener datos de "Servicios Mensuales"
export const getServiciosMensuales = async () => {
  try {
    const response = await airtable.get("/mensuales/");


    // Usando el ID de la tabla
    return response.data;
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
    const response = await airtable.get("/paginas-basicas/");
    return response.data;
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
    const response = await airtable.get("/funciones/");
    return response.data;
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
    const response = await airtable.get("/productos/");
    return response.data;
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
    const response = await airtable.get(`/elementos-portada/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de portada desde Airtable:", error);
    throw error;
  }
};

// Función para obtener datos de "Páginas Adicionales"
export const fetchPaginasBasicas = async (id) => {
  try {
    const response = await airtable.get(`/paginas-basicas/${id}/`);
    return response.data;
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
    const response = await airtable.get(`/funciones/${id}/`);
    return response.data;
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
        filterByFormula: `email = '${username}'`,
      },
    });

    if (response.data.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = response.data[0];

    // Si no hay contraseña registrada, marcar como requiere configuración
    if (!user.password) {
      return {
        id: user.id,
        name: user.name,
        username: user.email,
        tipoUser: user.tipoUser,
        pais: user.pais ?? null,
        requiresPasswordSetup: true,
      };
    }

    // Validar contraseña ingresada

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    // Usuario autenticado correctamente
    return {
      id: user.id,
      name: user.name,
      username: user.email,
      tipoUser: user.tipoUser,
      pais: user.pais ?? null,
      requiresPasswordSetup: false,
    };
  } catch (error) {
    console.error("Error en la autenticación:", error.message);
    throw error;
  }
};

export const updatePassword = async (userId, newPassword, securityQA) => {
  try {
    // 1. Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Crear array para almacenar los IDs de preguntas
    const preguntasIds = [];

    // 3. Procesar preguntas y respuestas
    for (const item of securityQA) {
      // Guardar la pregunta
      const preguntaResponse = await airtable.post("/preguntas/", {
        pregunta: item.question,
      });

      const preguntaId = preguntaResponse.data.id;
      preguntasIds.push(preguntaId); // Guardar el ID

      // Hashear la respuesta y guardarla
      const hashedAnswer = await bcrypt.hash(item.answer, 10);
      await airtable.post("/respuestas/", {
        texto: hashedAnswer,
        pregunta: preguntaId,
        userId,
      });
    }

    // 4. Actualizar contraseña y campo seguridad (array de ids) en el usuario
    await airtable.patch(`/users/${userId}/`, {
      password: hashedPassword,
      seguridad: preguntasIds, // Asumiendo que es un array-type field
      status: "activo",
    });

    return {
      success: true,
      message: "Contraseña y seguridad actualizadas correctamente",
    };
  } catch (error) {
    console.error("Error en updatePassword:", error);
    throw new Error(
      "No se pudo actualizar la contraseña y preguntas de seguridad."
    );
  }
};
export const updateOnlyPassword = async (userId, newPassword) => {
  try {
    // 1. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. PATCH al usuario para actualizar solo la contraseña
    const response = await airtable.patch(`/users/${userId}/`, {
      password: hashedPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar solo la contraseña:", error);
    throw new Error("No se pudo actualizar la contraseña.");
  }
};
// Función para obtener las preguntas de seguridad por correo
export const getSecurityQuestionsByEmail = async (email) => {
  try {
    // 1. Obtener usuario por email
    const response = await airtable.get("/users", {
      params: { email },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("Correo no encontrado");
    }

    const user = response.data[0];
    const { id, name, tipoUser, seguridad } = user;

    // 2. Obtener preguntas por los IDs almacenados en `seguridad`
    const questionRequests = seguridad.map((preguntaId) =>
      airtable.get(`/preguntas/${preguntaId}`)
    );
    const questionResponses = await Promise.all(questionRequests);

    const questions = questionResponses.map((res) => ({
      question: res.data.pregunta, // Campo 'pregunta' desde el backend
    }));

    return {
      id,
      name,
      tipoUser,
      questions,
      seguridad,
    };
  } catch (error) {
    console.error("Error al obtener preguntas de seguridad:", error);
    throw error;
  }
};

export const validateSecurityAnswers = async (preguntaIds, userAnswers) => {
  try {
    const validations = await Promise.all(
      preguntaIds.map(async (preguntaId, index) => {
        // 1. Obtener respuesta hasheada para la pregunta
        const respRes = await airtable.get("/respuestas", {
          params: { pregunta: preguntaId },
        });

        const hashed = respRes.data[0]?.texto;
        if (!hashed) return false;

        // 2. Comparar con la respuesta ingresada por el usuario
        return bcrypt.compare(userAnswers[index], hashed);
      })
    );

    return validations.every(Boolean); // ✅ true si todas coinciden
  } catch (error) {
    console.error("Error validando respuestas de seguridad:", error);
    throw new Error("No se pudieron validar las respuestas.");
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
    console.error("Error al obtener la pregunta de ChatGPT:", error);
    throw error;
  }
};
// Función para obtener datos de "Funciones Adicionales"
export const precioPais = async (id) => {
  try {
    const response = await airtable.get(`/paises/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de paises desde Airtable:", error);
    throw error;
  }
};

export const Pais = async () => {
  try {
    const response = await airtable.get(`/paises/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de paises desde Airtable:", error);
    throw error;
  }
};
export const userData = async (userId, newPais) => {
  const payload = {
    pais: newPais, // Asegúrate de que el formato coincida con lo que espera Airtable
  };

  try {
    const response = await airtable.patch(`/users/${userId}/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el país en Airtable:", error);
    throw error;
  }
};
export const tipoBeneficio = async () => {
  try {
    const response = await airtable.get(`/tipo-beneficios/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de paises desde Airtable:", error);
    throw error;
  }
};
export const beneficio = async (id) => {
  try {
    const response = await airtable.get(`/beneficios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos de paises desde Airtable:", error);
    throw error;
  }
};

const crmDetip = axios.create({
  baseURL: `https://api.airtable.com/v0/appI1914BiuM1LNHu`,
  headers: {
    Authorization: `Bearer patjSpRYKQy2WwciK.4685e89aef380bf10a6e266e692011cc31f95b9f00007ae39c62bdad5937da17`,
  },
});
export const getClientes = async (query) => {
  try {
    const formula = `OR(
      FIND(LOWER("${query}"), LOWER({Nombre})),
      FIND(LOWER("${query}"), LOWER({Empresa}))
    )`;

    const response = await crmDetip.get(`/Contacto`, {
      params: {
        filterByFormula: formula,
        maxRecords: 5,
      },
    });

    const contactos = response.data.records;

    // Enriching each contacto with empresa name and rubro
    const enriched = await Promise.all(
      contactos.map(async (record) => {
        const fields = record.fields;
        let nombreEmpresa = "";
        let rubro = "";

        if (
          fields["Empresa"] &&
          Array.isArray(fields["Empresa"]) &&
          fields["Empresa"][0]
        ) {
          const empresaId = fields["Empresa"][0];
          try {
            const empresaResponse = await crmDetip.get(`/Empresa/${empresaId}`);
            const empresaFields = empresaResponse.data.fields;
            nombreEmpresa = empresaFields["Empresa"] || "";
            rubro = empresaFields["Sector/Industria"] || "";
          } catch (e) {
            console.warn(`No se pudo cargar empresa con ID ${empresaId}`);
          }
        }

        return {
          nombre: fields["Nombre"] || "",
          cargo: fields["Cargo/Rol"] || "",
          rubro,
          email: fields["Correo_personal"] || "",
          descripcion_empresa: nombreEmpresa,
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    throw error;
  }
};
