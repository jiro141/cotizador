import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  fetchFuncionesExtras,
  fetchPaginasBasicas,
  fetchPortadaElementos,
  fetchServiciosMensuales,
  getCotizador,
  getData,
  getFuncionesAdicionales,
  getPaginasAdicionales,
  getServiciosMensuales,
} from "../controller/api";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BounceLoader } from "react-spinners";
import Calculadora from "./Calculadora";
import { FaPlus } from "react-icons/fa6";
import { TiMinus } from "react-icons/ti";
import "react-toastify/dist/ReactToastify.css";
import Secc from "./Secc";
import Separator from "./Separator";
import { MyContext } from "../context/Context";

export default function LandingPageClickThrough() {
  //contexto global para manejar las vistas
  const { state } = useContext(MyContext);

  // Estados de visibilidad para los elementos
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Estados para almacenar datos
  const [data, setData] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [paginas, setPaginasData] = useState([]);
  const [funcionesA, setFuncionesA] = useState([]);
  const [cotizador, setCotizador] = useState([]);
  const initialDataState = {
    portada: null,
    serviciosMensuales: null,
    paginasBasicas: null,
    funcionesExtras: null,
    loading: {
      portada: false,
      serviciosMensuales: false,
      paginasBasicas: false,
      funcionesExtras: false,
    },
    error: {
      portada: null,
      serviciosMensuales: null,
      paginasBasicas: null,
      funcionesExtras: null,
    },
  };

  const [dataState, setDataState] = useState(initialDataState);

  // Estados de selección independientes
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedSecciones, setSelectedSecciones] = useState([]);
  const [selectedSeccionesMax, setSelectedSeccionesMax] = useState([]);
  const [selectedPaginas, setSelectedPaginas] = useState([]);
  const [selectedFunciones, setSelectedFunciones] = useState([]);

  // Estados para manejo de carga y errores
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [loadingPaginas, setLoadingPaginas] = useState(true);
  const [loadingFunciones, setLoadingFunciones] = useState(true);
  const [loadingCotizador, setLoadingCotizador] = useState(true);

  // Control de límite de selección para Secciones
  const [limitReached, setLimitReached] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);

  // Función para obtener datos de "Elementos de portada"
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await getData();
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingData(false);
    }
  };

  // Función para obtener datos de "Servicios Mensuales"
  const fetchServicios = async () => {
    setLoadingServicios(true);
    try {
      const response = await getServiciosMensuales();
      setServicios(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingServicios(false);
    }
  };

  // Función para obtener datos de "Páginas Adicionales"
  const fetchPaginas = async () => {
    setLoadingPaginas(true);
    try {
      const response = await getPaginasAdicionales();
      setPaginasData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingPaginas(false);
    }
  };
  // Función para obtener datos de "Funciones Adicionales"
  const fetchFunciones = async () => {
    setLoadingFunciones(true);
    try {
      const response = await getFuncionesAdicionales();
      setFuncionesA(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingFunciones(false);
    }
  };
  // Función para obtener datos de "Funciones Adicionales"
  const fetchCotizador = async () => {
    setLoadingFunciones(true);
    try {
      const response = await getCotizador();
      setCotizador(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingCotizador(false);
    }
  };

  const productosMemo = useMemo(() => {
    if (!cotizador || !state) return null; // Manejo de casos donde cotizador o state no están definidos

    // Filtra y extrae los objetos en un solo paso
    return cotizador
      .map((item) => item.fields)
      .find((item) => item.Producto === state); // Cambia filter + indexación por find
  }, [cotizador, state]);

  useEffect(() => {
    // Si necesitas realizar algún efecto basado en productosFiltrados
    if (productosMemo) {
      setProductosFiltrados(productosMemo);
    }
  }, [productosMemo]);

  const maxValue = productosFiltrados?.Secciones;

  // Función para obtener datos de "Elementos de portada"
  const fetchPortadaDatos = async () => {
    setDataState((prev) => ({
      ...prev,
      loading: { ...prev.loading, portada: true },
      error: { ...prev.error, portada: null },
    }));
    try {
      const response = await Promise.all(
        productosFiltrados?.Secciones_Obligatorias.map((id) =>
          fetchPortadaElementos(id)
        )
      );
      setDataState((prev) => ({
        ...prev,
        portada: response,
        loading: { ...prev.loading, portada: false },
      }));
    } catch (err) {
      setDataState((prev) => ({
        ...prev,
        error: { ...prev.error, portada: err },
        loading: { ...prev.loading, portada: false },
      }));
    }
  };

  // Función para obtener datos de "Páginas Básicas"
  const fetchPaginasBasicasDatos = async (id) => {
    setDataState((prev) => ({
      ...prev,
      loading: { ...prev.loading, paginasBasicas: true },
      error: { ...prev.error, paginasBasicas: null },
    }));
    try {
      const response = await Promise.all(
        productosFiltrados?.Paginas_Obligatorias.map((id) =>
          fetchPaginasBasicas(id)
        )
      );
      setDataState((prev) => ({
        ...prev,
        paginasBasicas: response,
        loading: { ...prev.loading, paginasBasicas: false },
      }));
    } catch (err) {
      setDataState((prev) => ({
        ...prev,
        error: { ...prev.error, paginasBasicas: err },
        loading: { ...prev.loading, paginasBasicas: false },
      }));
    }
  };

  // Función para obtener datos de "Funciones Adicionales"
  const fetchFuncionesExtrasDatos = async (id) => {
    setDataState((prev) => ({
      ...prev,
      loading: { ...prev.loading, funcionesExtras: true },
      error: { ...prev.error, funcionesExtras: null },
    }));
    try {
      const response = await Promise.all(
        productosFiltrados?.Funciones_Obligatorias.map((id) =>
          fetchFuncionesExtras(id)
        )
      );
      setDataState((prev) => ({
        ...prev,
        funcionesExtras: response,
        loading: { ...prev.loading, funcionesExtras: false },
      }));
    } catch (err) {
      setDataState((prev) => ({
        ...prev,
        error: { ...prev.error, funcionesExtras: err },
        loading: { ...prev.loading, funcionesExtras: false },
      }));
    }
  };

  // Llama a las funciones de obtención de datos al montar el componente
  useEffect(() => {
    fetchCotizador();
    fetchData();
    fetchServicios();
    fetchPaginas();
    fetchFunciones();
  }, [state]);

  useEffect(() => {
    fetchPortadaDatos();
    fetchPaginasBasicasDatos();
  }, [state]);

  useEffect(() => {
    // Llama a la función inmediatamente al cargar el componente
    fetchFuncionesExtrasDatos();
  }, [state]);

  const [openSection, setOpenSection] = useState(null); // Estado para rastrear la sección abierta

  const togglePortada = () =>
    setOpenSection((prevSection) =>
      prevSection === "portada" ? null : "portada"
    );
  const togglePagina = () =>
    setOpenSection((prevSection) =>
      prevSection === "pagina" ? null : "pagina"
    );
  const togglePaginas = () =>
    setOpenSection((prevSection) =>
      prevSection === "paginas" ? null : "paginas"
    );
  const toggleFunciones = () =>
    setOpenSection((prevSection) =>
      prevSection === "funciones" ? null : "funciones"
    );

  // Filtros para dividir los datos en pares e impares (para "Secciones de la Landing")
  const pares = data
    .filter((item, index) => index % 2 === 0)
    .map((item) => item.fields)
    .sort((a, b) => a.ID - b.ID); // Reemplaza "propiedad" por la que deseas ordenar

  const impares = data
    .filter((item, index) => index % 2 !== 0)
    .map((item) => item.fields)
    .sort((a, b) => a.ID - b.ID); // Reemplaza "propiedad" por la que deseas ordenar

  // Maneja la selección de un servicio mensual (selección única)
  const handleCheckboxChangeServicios = (item) => {
    setSelectedServicios((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (i) => i.fields && i.fields.ID === item.fields.ID
      );

      if (isAlreadySelected) {
        // Si ya está seleccionado, eliminarlo de la lista
        return prevSelected.filter((i) => i.fields.ID !== item.fields.ID);
      } else {
        // Verificar si el nombre contiene "Web Master" o "Hosting"
        const isWebMaster = item.fields["Producto"].includes("Web Master");
        const isHosting = item.fields["Producto"].includes("Hosting");

        // Filtrar duplicados según "Web Master" y "Hosting"
        const filteredList = prevSelected.filter((i) => {
          const hasWebMaster = i.fields["Producto"].includes("Web Master");
          const hasHosting = i.fields["Producto"].includes("Hosting");
          return !(isWebMaster && hasWebMaster) && !(isHosting && hasHosting);
        });

        // Agregar el nuevo elemento a la lista filtrada
        return [...filteredList, item];
      }
    });
  };

  // Maneja la selección de una sección con límite de puntos y muestra un aviso si se supera el límite
  const handleCheckboxChangeSecciones = (item) => {
    const itemValue = Number(item.Valor);
    const isSelectedInNormal = selectedSecciones.some((i) => i.ID === item.ID);
    const isSelectedInExcess = selectedSeccionesMax.some(
      (i) => i.ID === item.ID
    );

    if (isSelectedInNormal) {
      // Si el elemento está en el estado normal, eliminarlo y mover uno del excedente al estado normal
      setSelectedSecciones((prevSelectedSecciones) => {
        const updatedSecciones = prevSelectedSecciones.filter(
          (i) => i.ID !== item.ID
        );

        // Reubicar del excedente al estado normal si hay espacio
        const combined = [...updatedSecciones, ...selectedSeccionesMax];
        const withinLimit = combined.slice(0, maxValue);
        const excess = combined.slice(maxValue);

        setSelectedSeccionesMax(excess); // Actualizar excedente
        return withinLimit;
      });
    } else if (isSelectedInExcess) {
      // Si el elemento está en el excedente, eliminarlo
      setSelectedSeccionesMax((prevSelectedSeccionesMax) =>
        prevSelectedSeccionesMax.filter((i) => i.ID !== item.ID)
      );
    } else {
      const newCurrentValue = selectedSecciones.length + 1; // +1 porque estamos agregando itemValue

      console.log(itemValue, "hola");
      console.log(newCurrentValue, "fdjofd");

      if (newCurrentValue > maxValue) {
        setSelectedSeccionesMax((prevSelectedSeccionesMax) => [
          ...prevSelectedSeccionesMax,
          {
            category: "Secciones",
            name: item["Secciones de portada básicas "],
            ID: item.ID,
            Valor: item.Valor,
            precio: item.precio,
          },
        ]);
      } else {
        setSelectedSecciones((prevSelectedSecciones) => [
          ...prevSelectedSecciones,
          {
            category: "Secciones",
            name: item["Secciones de portada básicas "],
            ID: item.ID,
            Valor: item.Valor,
            precio: item.precio,
          },
        ]);
      }
    }
  };

  const [exceededPaginas, setExceededPaginas] = useState([]); // Nuevo estado para elementos excedentes
  const maxPaginas = productosFiltrados?.paginas || 0; // Máximo permitido

  const handleCheckboxChangePaginas = (item) => {
    const isSelectedInNormal = selectedPaginas.some((i) => i.ID === item.ID);
    const isSelectedInExcess = exceededPaginas.some((i) => i.ID === item.ID);

    if (isSelectedInNormal) {
      // Si el elemento está en el estado normal, eliminarlo y mover uno del excedente al estado normal
      setSelectedPaginas((prevSelected) => {
        const updated = prevSelected.filter((i) => i.ID !== item.ID);

        // Reubicar elementos del excedente al estado normal si hay espacio disponible
        const combined = [...updated, ...exceededPaginas];
        const withinLimit = combined.slice(0, maxPaginas);
        const excess = combined.slice(maxPaginas);

        setExceededPaginas(excess); // Actualizar excedente
        return withinLimit;
      });
    } else if (isSelectedInExcess) {
      // Si el elemento está en el excedente, eliminarlo directamente
      setExceededPaginas((prevExceeded) =>
        prevExceeded.filter((i) => i.ID !== item.ID)
      );
    } else {
      // Si no está seleccionado, agregarlo al estado adecuado
      if (selectedPaginas.length < maxPaginas) {
        setSelectedPaginas((prevSelected) => [
          ...prevSelected,
          {
            category: "Páginas Adicionales",
            name: item.paginas,
            ID: item.ID,
            Valor: item.Valor,
            count: 1,
          },
        ]);
      } else {
        setExceededPaginas((prevExceeded) => [
          ...prevExceeded,
          {
            category: "Páginas Adicionales",
            name: item.paginas,
            ID: item.ID,
            Valor: item.Valor,
            count: 1,
          },
        ]);
      }
    }
  };

  const handleIncrement = (item) => {
    if (selectedPaginas.length < maxPaginas) {
      // Agregar al estado normal si hay espacio
      setSelectedPaginas((prev) => [...prev, item]);
    } else {
      // Agregar al excedente si no hay espacio
      setExceededPaginas((prev) => [...prev, item]);
    }
  };

  const handleDecrement = (item) => {
    if (selectedPaginas.some((i) => i.ID === item.ID)) {
      // Si el elemento está en el estado normal, eliminarlo
      setSelectedPaginas((prev) => {
        const updated = prev.filter((i) => i.ID !== item.ID);

        // Reubicar elementos del excedente al estado normal si hay espacio disponible
        const combined = [...updated, ...exceededPaginas];
        const withinLimit = combined.slice(0, maxPaginas);
        const excess = combined.slice(maxPaginas);

        setExceededPaginas(excess); // Actualizar excedente
        return withinLimit;
      });
    } else if (exceededPaginas.some((i) => i.ID === item.ID)) {
      // Si el elemento está en el estado excedente, eliminarlo directamente
      setExceededPaginas((prev) => prev.filter((i) => i.ID !== item.ID));
    }
  };

  // Maneja la selección de una función avanzada (sin límite)
  const handleCheckboxChangeFunciones = (item) => {
    setSelectedFunciones((prevSelectedFunciones) => {
      const isSelected = prevSelectedFunciones.some((i) => i.ID === item.ID);
      return isSelected
        ? prevSelectedFunciones.filter((i) => i.ID !== item.ID)
        : [
            ...prevSelectedFunciones,
            {
              category: "Funciones Avanzadas",
              name: item["Páginas avanzadas "],
              ID: item.ID,
              Valor: item.Valor,
            },
          ];
    });
  };
  useEffect(() => {
    setDataState(initialDataState); // Reinicia dataState al valor inicial
  }, [state]);

  useEffect(() => {
    // Resetear todos los estados dependientes cuando cambia el contexto
    setSelectedServicios([]);
    setSelectedSecciones([]);
    setSelectedSeccionesMax([]);
    setExceededPaginas([]);
    setSelectedPaginas([]);
    setSelectedFunciones([]);
    setLimitReached(false);
    setOpenSection(null);
    setProductosFiltrados([]);
    setDataState(initialDataState);
  }, [state]); // Dependencia en `state`

  // Otras funciones siguen igual
  // 1. Obtener las secciones y páginas obligatorias
  // 1. Obtener las secciones y páginas obligatorias
  const seccionesObligatorias =
    productosFiltrados?.Secciones_Obligatorias?.split(",") || [];
  const paginasObligatorias =
    productosFiltrados?.Paginas_Obligatorias?.split(",") || [];

  // 2. Manejo inicial para Secciones_Obligatorias
  const handleInitialSeccionesObligatorias = () => {
    pares.concat(impares).forEach((item) => {
      const isObligatoria = seccionesObligatorias.includes(
        item["Secciones de portada básicas "]?.trim()
      );
      // Si está en Secciones_Obligatorias y no está en selectedServicios
      if (
        isObligatoria &&
        !selectedSecciones.some((selected) => selected.ID === item.ID)
      ) {
        setSelectedSecciones((prevState) => [...prevState, item]);
      }
    });
  };

  // 3. Manejo inicial para Paginas_Obligatorias (usando el patrón de `pares.map`)
  const handleInitialPaginasObligatorias = () => {
    // Iterar sobre todas las páginas
    paginas.forEach((item) => {
      const itemFields = item.fields || {}; // Acceder al objeto fields

      // Verificar el valor de 'name' y asegurarnos de que "name" es el campo correcto
      const paginaName =
        itemFields["name"]?.trim() || itemFields["paginas"]?.trim();

      // Verificar si la página está en Paginas_Obligatorias
      const isPaginaObligatoria = paginasObligatorias.includes(paginaName);

      // Si está en Paginas_Obligatorias y no está en selectedPaginas
      if (
        isPaginaObligatoria &&
        !selectedPaginas.some((selected) => selected.ID === itemFields.ID)
      ) {
        // Actualizar el estado de selectedPaginas directamente
        setSelectedPaginas((prevSelected) => [
          ...prevSelected,
          {
            category: "Páginas Adicionales", // Asignamos el nombre de la categoría
            name: itemFields["paginas"], // Usamos 'paginas' del 'fields'
            ID: itemFields.ID, // Usamos 'ID' del item
            Valor: itemFields["Valor"], // Usamos 'Valor' del 'fields'
            count: 1, // Inicializamos el contador en 1
          },
        ]);
      }
    });
  };
  const funcionesObligatorias =
    productosFiltrados?.Funciones_Obligatorias?.split(",") || [];

  // 4. Manejo inicial para Funciones_Obligatorias
  const handleInitialFuncionesObligatorias = () => {
    // Iterar sobre todas las funciones
    funcionesA.forEach((item) => {
      const itemFields = item.fields || {}; // Acceder al objeto fields

      // Verificar el valor de 'Funciones_Obligatorias'
      const funcionName = itemFields["Páginas avanzadas "]?.trim();

      // Verificar si la función está en Funciones_Obligatorias
      const isFuncionObligatoria = funcionesObligatorias.includes(funcionName);

      // Si está en Funciones_Obligatorias y no está en selectedFunciones
      if (
        isFuncionObligatoria &&
        !selectedFunciones.some((selected) => selected.ID === itemFields.ID)
      ) {
        // Actualizar el estado de selectedFunciones directamente
        setSelectedFunciones((prevSelected) => [
          ...prevSelected,
          {
            category: "Funciones Avanzadas", // Asignamos el nombre de la categoría
            name: itemFields["Páginas avanzadas "] || "Sin nombre", // Usamos 'Páginas avanzadas ' del 'fields'
            ID: itemFields.ID, // Usamos 'ID' del item
            Valor: itemFields["Valor"], // Usamos 'Valor' del 'fields'
          },
        ]);
      }
    });
  };

  // 4. Ejecutar las funciones de inicialización cuando `state` cambie
  useEffect(() => {
    handleInitialSeccionesObligatorias();
    handleInitialPaginasObligatorias();
    handleInitialFuncionesObligatorias();
  });
  useEffect(() => {
    handleInitialSeccionesObligatorias();
    handleInitialPaginasObligatorias();
    handleInitialFuncionesObligatorias();
  }, [state]);
  // Se ejecuta cada vez que `state` cambie

  return (
    <div className="flex">
      <div>
        <div className="grid">
          <div className="container-text">
            <p>{productosFiltrados?.descripcion}</p>
          </div>
          <div>
            <h4>Elementos básicos</h4> <br />
            <p>Páginas: {Number(productosFiltrados?.paginas || 0) + 1}</p>
            <p>Secciones: {productosFiltrados?.Secciones}</p>
            <br />
          </div>
        </div>

        {/* Sección de Servicios Mensuales */}
        <div>
          <h3 onClick={togglePagina} className="secciones">
            Servicios
            <span
              style={{
                marginLeft: "8px",
                color: openSection === "pagina" ? "#ff5722" : "",
              }}
            >
              {openSection === "pagina" ? (
                <IoIosArrowUp size={20} />
              ) : (
                <IoIosArrowDown size={20} />
              )}
            </span>
          </h3>
          {openSection === "pagina" && (
            <Secc
              loading={loadingServicios}
              error={error}
              data={servicios}
              selectedServicios={selectedServicios}
              handleCheckboxChangeServicios={handleCheckboxChangeServicios}
            />
          )}
        </div>

        {/* Sección de Secciones de la Landing */}

        <>
          <Separator />
          <div>
            <h3 onClick={togglePortada} className="secciones">
              Secciones de la Portada
              <span
                style={{
                  marginLeft: "8px",
                  color: openSection === "portada" ? "#ff5722" : "",
                }}
              >
                {openSection === "portada" ? (
                  <IoIosArrowUp size={20} />
                ) : (
                  <IoIosArrowDown size={20} />
                )}
              </span>
            </h3>

            {openSection === "portada" && (
              <div>
                {loadingData ? (
                  <BounceLoader />
                ) : error ? (
                  <p>Error al cargar datos</p>
                ) : (
                  <div className="section-container">
                    {pares.concat(impares).map((item) => {
                      // Verificar si el item actual está en Secciones_Obligatorias
                      const isObligatoria = seccionesObligatorias.includes(
                        item["Secciones de portada básicas "]?.trim()
                      );

                      return (
                        <div
                          key={item.ID}
                          className="checkbox-wrapper-24"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`check-seccion-portada-${item.ID}`} // IDs únicos
                            checked={
                              selectedSecciones.some((i) => i.ID === item.ID) ||
                              selectedSeccionesMax.some(
                                (i) => i.ID === item.ID
                              ) ||
                              isObligatoria // Si está en Secciones_Obligatorias, lo marcamos
                            }
                            onChange={() => handleCheckboxChangeSecciones(item)}
                            disabled={
                              isObligatoria ||
                              dataState?.portada?.includes(
                                item["Secciones de portada básicas "]?.trim()
                              )
                            } // Deshabilitar si está en Secciones_Obligatorias o dataState.portada
                          />
                          <label htmlFor={`check-seccion-portada-${item.ID}`}>
                            <span></span>
                            {item["Secciones de portada básicas "]?.trim() ||
                              "Sin nombre"}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>

        {/* Sección de Páginas Adicionales */}
        {state !== "LandingPageClickThrough" && state !== "LandingBasica" && (
          <>
            <Separator />
            <div>
              <h3 onClick={togglePaginas} className="secciones">
                Páginas
                <span
                  style={{
                    marginLeft: "8px",
                    color: openSection === "paginas" ? "#ff5722" : "",
                  }}
                >
                  {openSection === "paginas" ? (
                    <IoIosArrowUp size={20} />
                  ) : (
                    <IoIosArrowDown size={20} />
                  )}
                </span>
              </h3>
              {openSection === "paginas" && (
                <div>
                  {loadingPaginas ? (
                    <BounceLoader />
                  ) : error ? (
                    <p>Error al cargar datos</p>
                  ) : (
                    <div className="section-container">
                      {paginas.map((item) => {
                        const itemFields = item.fields || {}; // Acceder al objeto fields

                        // Asegúrate de que 'Paginas_Obligatorias' esté bien formateado y sea una cadena
                        const paginasObligatorias =
                          productosFiltrados?.Paginas_Obligatorias?.split(
                            ","
                          ) || [];

                        // Verificamos si el ítem está en 'Paginas_Obligatorias'
                        const isPaginaObligatoria =
                          paginasObligatorias.includes(
                            itemFields.paginas?.trim()
                          );

                        // Contamos cuántas veces aparece este ID en `selectedPaginas` y `exceededPaginas`
                        const selectedCount = [
                          ...selectedPaginas.filter(
                            (i) => i.ID === itemFields.ID
                          ),
                          ...exceededPaginas.filter(
                            (i) => i.ID === itemFields.ID
                          ),
                        ].length;

                        return (
                          <div
                            key={itemFields.ID}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            {/* Checkbox para seleccionar/desseleccionar */}
                            <div className="checkbox-wrapper-24">
                              <input
                                type="checkbox"
                                id={`check-seccion-paginas-${itemFields.ID}`} // IDs únicos
                                checked={
                                  // Si el ítem está en Paginas_Obligatorias, marcamos el checkbox automáticamente
                                  isPaginaObligatoria ||
                                  !!selectedPaginas.find(
                                    (i) => i.ID === itemFields.ID
                                  ) ||
                                  !!exceededPaginas.find(
                                    (i) => i.ID === itemFields.ID
                                  )
                                }
                                // Si el ítem está en Paginas_Obligatorias, lo deshabilitamos para que no se pueda desmarcar
                                onChange={() =>
                                  !isPaginaObligatoria &&
                                  handleCheckboxChangePaginas(itemFields)
                                }
                                disabled={isPaginaObligatoria} // Deshabilitamos el checkbox si es obligatoria
                              />
                              <label
                                htmlFor={`check-seccion-paginas-${itemFields.ID}`}
                              >
                                <span></span>
                                {itemFields.paginas || "Sin nombre"}
                              </label>
                            </div>

                            {/* Contador visible si el elemento está seleccionado */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "solid 3px #70ADDF",
                                borderRadius: "8px",
                                marginRight: "10px",
                              }}
                            >
                              <button
                                onClick={() => handleDecrement(itemFields)}
                                disabled={selectedCount === 0}
                              >
                                <TiMinus />
                              </button>
                              {/* Muestra la cantidad de veces que este ID está seleccionado */}
                              {selectedCount}
                              <button
                                onClick={() => handleIncrement(itemFields)}
                                disabled={selectedCount === 0}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {state !== "LandingPageClickThrough" && state !== "LandingBasica" && (
          <>
            {/* Sección de Funciones adicionales */}
            <div>
              <Separator />
              <h3 onClick={toggleFunciones} className="secciones">
                Funciones
                <span
                  style={{
                    marginLeft: "8px",
                    color: openSection === "funciones" ? "#ff5722" : "",
                  }}
                >
                  {openSection === "funciones" ? (
                    <IoIosArrowUp size={20} />
                  ) : (
                    <IoIosArrowDown size={20} />
                  )}
                </span>
              </h3>
              {openSection === "funciones" && (
                <div>
                  {loadingFunciones ? (
                    <BounceLoader />
                  ) : error ? (
                    <p>Error al cargar datos</p>
                  ) : (
                    <div className="section-container">
                      {funcionesA.map((item) => {
                        const itemFields = item.fields || {};
                        console.log(funcionesObligatorias, "hola");

                        // Asegúrate de que ambos valores sean iguales y sin espacios al principio o al final
                        const isObligatoria = funcionesObligatorias.some(
                          (func) =>
                            func.trim().toLowerCase() ===
                            (
                              itemFields["Páginas avanzadas "]?.trim() || ""
                            ).toLowerCase()
                        );

                        const isChecked =
                          selectedFunciones.some(
                            (i) => i.ID === itemFields.ID
                          ) || isObligatoria;

                        return (
                          <div
                            key={itemFields.ID}
                            className="checkbox-wrapper-24"
                          >
                            <input
                              type="checkbox"
                              id={`check-seccion-funciones-${itemFields.ID}`} // IDs únicos
                              checked={isChecked}
                              onChange={() => {
                                // Solo permitir desmarcar si no es una función obligatoria
                                if (!isObligatoria) {
                                  handleCheckboxChangeFunciones(itemFields);
                                }
                              }}
                              disabled={isObligatoria} // Deshabilitar si es obligatoria
                            />
                            <label
                              htmlFor={`check-seccion-funciones-${itemFields.ID}`}
                            >
                              <span></span>
                              {itemFields["Páginas avanzadas "] || "Sin nombre"}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Calculadora */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}
      >
        <Calculadora
          data={data}
          selectedServicios={selectedServicios}
          selectedSecciones={selectedSecciones}
          selectedPaginas={selectedPaginas}
          selectedFunciones={selectedFunciones}
          selectedSeccionesMax={selectedSeccionesMax}
          limitReached={limitReached}
          exceededPaginas={exceededPaginas}
          precio={productosFiltrados?.Valor}
          onCheckboxChange={handleCheckboxChangeSecciones}
        />
      </div>
    </div>
  );
}
