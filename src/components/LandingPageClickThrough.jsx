import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
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
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
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
      .map((item) => item)
      .find((item) => item.producto === state);
  }, [cotizador, state]);

  useEffect(() => {
    // Si necesitas realizar algún efecto basado en productosFiltrados
    if (productosMemo) {
      setProductosFiltrados(productosMemo);
    }
  }, [productosMemo]);

  const maxValue = productosFiltrados?.maxSecciones;

  // Función para obtener datos de "Elementos de portada"
  const fetchPortadaDatos = async () => {
    setDataState((prev) => ({
      ...prev,
      loading: { ...prev.loading, portada: true },
      error: { ...prev.error, portada: null },
    }));
    try {
      const response = await Promise.all(
        productosFiltrados?.secciones.map((id) => fetchPortadaElementos(id))
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
        productosFiltrados?.paginas.map((id) => fetchPaginasBasicas(id))
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
        productosFiltrados?.funciones_obligatorias.map((id) =>
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
  const sortByID = (a, b) => Number(a.id) - Number(b.id);
  // Filtros para dividir los datos en pares e impares (para "Secciones de la Landing")
  const pares = data
    .filter((_, index) => index % 2 === 0)
    .filter((item) => item && item.id != null) // extra seguridad
    .sort(sortByID);

  const impares = data
    .filter((_, index) => index % 2 !== 0)
    .filter((item) => item && item.id != null);

  // Maneja la selección de un servicio mensual (selección única)
  const handleCheckboxChangeServicios = (item) => {
    setSelectedServicios((prevSelected) => {
      const isAlreadySelected = prevSelected.some((i) => i && i.id === item.id);

      if (isAlreadySelected) {
        // Si ya está seleccionado, eliminarlo de la lista
        return prevSelected.filter((i) => i.id !== item.id);
      } else {
        // Verificar si el nombre contiene "Web Master" o "Hosting"
        const isWebMaster = item.producto.includes("Web Master");
        const isHosting = item.producto.includes("Hosting");

        // Filtrar duplicados según "Web Master" y "Hosting"
        const filteredList = prevSelected.filter((i) => {
          const hasWebMaster = i.producto.includes("Web Master");
          const hasHosting = i.producto.includes("Hosting");
          return !(isWebMaster && hasWebMaster) && !(isHosting && hasHosting);
        });

        // Agregar el nuevo elemento a la lista filtrada
        return [...filteredList, item];
      }
    });
  };

  // Maneja la selección de una sección con límite de puntos y muestra un aviso si se supera el límite
  const handleCheckboxChangeSecciones = (item) => {
    const id = item.id;
    const name = item.seccion?.trim();
    const valor = Number(item.valor);
    const precio = item.precio || 0;

    const normalSelected = selectedSecciones.some((i) => i.id === id);
    const excessSelected = selectedSeccionesMax.some((i) => i.id === id);

    if (normalSelected) {
      setSelectedSecciones((prev) => {
        const updated = prev.filter((i) => i.id !== id);

        if (selectedSeccionesMax.length > 0) {
          const [next, ...rest] = selectedSeccionesMax;

          setSelectedSeccionesMax(rest);
          return [...updated, next];
        }

        return updated;
      });
    } else if (excessSelected) {
      setSelectedSeccionesMax((prev) => prev.filter((i) => i.id !== id));
    } else {
      const newItem = {
        category: "Secciones",
        name,
        id: id,
        valor,
        precio,
      };

      if (selectedSecciones.length < maxValue) {
        setSelectedSecciones((prev) => [...prev, newItem]);
      } else {
        setSelectedSeccionesMax((prev) => [...prev, newItem]);
      }
    }
  };

  const [exceededPaginas, setExceededPaginas] = useState([]);
  const maxPaginas = productosFiltrados?.maxPaginas || 0;

  // Helper: Remueve la primera ocurrencia por id
  const removeFirstById = (arr, id) => {
    const idx = arr.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const copy = [...arr];
      copy.splice(idx, 1);
      return copy;
    }
    return arr;
  };

  // Calcula IDs de páginas obligatorias (fuera de las funciones, o ponlo en un useMemo/useCallback)
  const paginasObligatoriasIds = (productosFiltrados?.paginas || []).map((p) =>
    typeof p === "object" ? p.id : p
  );

  // Handler principal para checkboxes
  const handleCheckboxChangePaginas = (item) => {
    const isInSelected = selectedPaginas.some((i) => i.id === item.id);
    const isInExceeded = exceededPaginas.some((i) => i.id === item.id);

    if (isInSelected) {
      setSelectedPaginas((prevSelected) => {
        const updated = removeFirstById(prevSelected, item.id);

        let nextExceeded = [...exceededPaginas];
        let newSelected = [...updated];

        if (nextExceeded.length > 0) {
          const [next, ...rest] = nextExceeded;
          newSelected.push(next);
          setExceededPaginas(rest);
        } else {
          setExceededPaginas(nextExceeded);
        }
        return newSelected;
      });
    } else if (isInExceeded) {
      setExceededPaginas((prevExceeded) =>
        removeFirstById(prevExceeded, item.id)
      );
    } else {
      const newItem = {
        category: "Páginas Adicionales",
        name: item.pagina,
        id: item.id,
        valor: item.valor,
        count: 1,
      };
      if (selectedPaginas.length < maxPaginas) {
        setSelectedPaginas((prev) => [...prev, newItem]);
      } else {
        setExceededPaginas((prev) => [...prev, newItem]);
      }
    }
  };

  // Incrementa cantidad (igual que antes)
  const handleIncrement = (item) => {
    if (selectedPaginas.length < maxPaginas) {
      setSelectedPaginas((prev) => [...prev, item]);
    } else {
      setExceededPaginas((prev) => [...prev, item]);
    }
  };

  // Decrementa cantidad (1 unidad), respeta obligatorias
  const handleDecrement = (item) => {
    // Si la página es obligatoria y solo hay una, no se elimina
    // const isObligatoria = paginasObligatoriasIds.includes(item.id);
    // const countSelected =
    //   selectedPaginas.filter((i) => i.id === item.id).length +
    //   exceededPaginas.filter((i) => i.id === item.id).length;
    // if (isObligatoria && countSelected <= 1) {
    //   return;
    // }

    const isInSelected = selectedPaginas.some((i) => i.id === item.id);
    const isInExceeded = exceededPaginas.some((i) => i.id === item.id);

    if (isInSelected) {
      const updatedSelected = removeFirstById(selectedPaginas, item.id);

      if (exceededPaginas.length > 0) {
        const [next, ...rest] = exceededPaginas;
        setSelectedPaginas([...updatedSelected, next]);
        setExceededPaginas(rest);
      } else {
        setSelectedPaginas(updatedSelected);
      }
    } else if (isInExceeded) {
      const updatedExceeded = removeFirstById(exceededPaginas, item.id);
      setExceededPaginas(updatedExceeded);
    }
  };

  // Maneja la selección de una función avanzada (sin límite)
  const handleCheckboxChangeFunciones = (item) => {
    setSelectedFunciones((prevSelectedFunciones) => {
      const isSelected = prevSelectedFunciones.some((i) => i.id === item.id);
      return isSelected
        ? prevSelectedFunciones.filter((i) => i.id !== item.id)
        : [
            ...prevSelectedFunciones,
            {
              category: "Funciones Avanzadas",
              name: item.pagina_avanzada,
              id: item.id, // <-- minúsculas!
              valor: item.valor,
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
  const seccionesObligatorias = productosFiltrados?.secciones || [];
  const paginasObligatorias = productosFiltrados?.paginas || [];

  // 2. Manejo inicial para Secciones_Obligatorias
  const handleInitialSeccionesObligatorias = () => {
    data.forEach((item) => {
      const seccionID = Number(item.id); // ID del item, no .seccion
      const isObligatoria = seccionesObligatorias.includes(seccionID);

      const yaSeleccionada = selectedSecciones.some(
        (selected) => selected.id === seccionID
      );

      if (isObligatoria && !yaSeleccionada) {
        setSelectedSecciones((prev) => [
          ...prev,
          {
            category: "Secciones",
            name: item.seccion?.trim(),
            id: seccionID,
            valor: item.valor,
            precio: item.precio || 0,
          },
        ]);
      }
    });
  };

  // 3. Manejo inicial para paginas (usando el patrón de `pares.map`)
  const handleInitialPaginasObligatorias = () => {
    paginas.forEach((item) => {
      const paginaID = Number(item.id);
      const isObligatoria = paginasObligatorias.includes(paginaID);

      const alreadySelected = selectedPaginas.some(
        (selected) => selected.id === paginaID
      );

      if (isObligatoria && !alreadySelected) {
        setSelectedPaginas((prev) => [
          ...prev,
          {
            category: "Páginas Adicionales",
            name: item.pagina?.trim(),
            id: paginaID,
            valor: item.valor,
            count: 1,
          },
        ]);
      }
    });
  };

  const funcionesObligatorias =
    productosFiltrados?.funciones_obligatorias || [];

  // 4. Manejo inicial para Funciones_Obligatorias
  const handleInitialFuncionesObligatorias = () => {
    funcionesA.forEach((item) => {
      const funcionName = item?.pagina_avanzada?.trim();
      const funcionID = item?.id;

      if (!funcionName || !funcionID) return; // Datos inválidos, ignorar

      const isFuncionObligatoria = funcionesObligatorias.includes(funcionName);

      const alreadySelected = selectedFunciones.some(
        (selected) => selected.id === funcionID
      );

      if (isFuncionObligatoria && !alreadySelected) {
        setSelectedFunciones((prev) => [
          ...prev,
          {
            category: "Funciones Avanzadas",
            name: funcionName,
            id: funcionID,
            valor: item.valor,
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
  // 🧠 Toast solo al cambiar de length 0 a >0
  const useToastOnArrayChange = (array, message, id) => {
    const prevLengthRef = useRef(0);

    useEffect(() => {
      if (prevLengthRef.current === 0 && array.length > 0) {
        toast(message, { id });
      }
      prevLengthRef.current = array.length;
    }, [array, message, id]);
  };
  useToastOnArrayChange(
    exceededPaginas,
    "Emepezaste agregar paginas extra",
    "toast-exceeded"
  );
  useToastOnArrayChange(
    selectedSeccionesMax,
    "Emepezaste agregar secciones extra",
    "toast-max-secciones"
  );

  return (
    <div className="flex">
      <Toaster />
      <div>
        <div className="grid">
          <div className="container-text">
            <p>{productosFiltrados?.descripcion}</p>
          </div>
          <div>
            <h4>Elementos básicos</h4> <br />
            <p>Páginas: {Number(productosFiltrados?.maxPaginas || 0) + 1}</p>
            <p>Secciones: {productosFiltrados?.maxSecciones}</p>
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
                    {data.map((item) => {
                      // Verificar si el item actual está en Secciones_Obligatorias
                      const isObligatoria = seccionesObligatorias.includes(
                        item?.id
                      );
                      return (
                        <div
                          key={item.id}
                          className="checkbox-wrapper-24"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`check-seccion-portada-${item.id}`} // IDs únicos
                            checked={
                              selectedSecciones.some((i) => i.id === item.id) ||
                              selectedSeccionesMax.some(
                                (i) => i.id === item.id
                              ) ||
                              isObligatoria
                            }
                            onChange={() => handleCheckboxChangeSecciones(item)}
                            disabled={
                              isObligatoria ||
                              dataState?.portada?.includes(
                                item?.seccion?.trim()
                              )
                            } // Deshabilitar si está en Secciones_Obligatorias o dataState.portada
                          />
                          <label htmlFor={`check-seccion-portada-${item.id}`}>
                            <span></span>
                            {item?.seccion?.trim() || "Sin nombre"}
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
                        const paginaName = item?.pagina?.trim() || "Sin nombre";
                        const paginaID = item?.id;

                        // Siempre extrae solo los IDs, soporte para array mixto (id u objeto)
                        const paginasObligatorias = (
                          productosFiltrados?.paginas || []
                        ).map((p) => (typeof p === "object" ? p.id : p));

                        const isPaginaObligatoria =
                          paginasObligatorias.includes(paginaID);

                        // Cuenta cuántas veces aparece (en ambas listas)
                        const selectedCount =
                          selectedPaginas.filter((i) => i.id === paginaID)
                            .length +
                          exceededPaginas.filter((i) => i.id === paginaID)
                            .length;

                        return (
                          <div
                            key={paginaID}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            {/* Checkbox para seleccionar/deseleccionar */}
                            <div className="checkbox-wrapper-24">
                              <input
                                type="checkbox"
                                id={`check-seccion-paginas-${paginaID}`}
                                checked={
                                  isPaginaObligatoria ||
                                  !!selectedPaginas.find(
                                    (i) => i.id === paginaID
                                  ) ||
                                  !!exceededPaginas.find(
                                    (i) => i.id === paginaID
                                  )
                                }
                                onChange={() =>
                                  !isPaginaObligatoria &&
                                  handleCheckboxChangePaginas(item)
                                }
                                disabled={isPaginaObligatoria}
                              />
                              <label
                                htmlFor={`check-seccion-paginas-${paginaID}`}
                              >
                                <span></span>
                                {paginaName || "Sin nombre"}
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
                              <div
                                style={{
                                  backgroundColor:
                                    selectedCount === 0 ? "#707070" : "#2c2c2c",
                                  color: "white",
                                  border: "none",
                                  padding: "4px 8px",
                                  cursor:
                                    selectedCount === 0
                                      ? "not-allowed"
                                      : "pointer",
                                  borderRadius: "4px",
                                  transition: "background-color 0.3s ease",
                                  opacity: selectedCount === 0 ? 0.5 : 1,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 4px",
                                }}
                                onClick={() => handleDecrement(item)}
                              >
                                <TiMinus />
                              </div>
                              <span>{selectedCount}</span>
                              <div
                                style={{
                                  backgroundColor: "#2c2c2c",
                                  color: "white",
                                  border: "none",
                                  padding: "4px 8px",
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                  transition: "background-color 0.3s ease",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 4px",
                                }}
                                onClick={() => handleIncrement(item)}
                              >
                                <FaPlus />
                              </div>
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
                      {funcionesA.map((item = {}) => {
                        const itemId = item.id;
                        // Revisa si es una función obligatoria
                        const isObligatoria = funcionesObligatorias.some(
                          (func) => (func || "") === itemId
                        );
                        // Revisa si está seleccionada o es obligatoria
                        const isChecked =
                          selectedFunciones.some((i) => i.id === item.id) ||
                          isObligatoria;

                        return (
                          <div key={item.id} className="checkbox-wrapper-24">
                            <input
                              type="checkbox"
                              id={`check-seccion-funciones-${item.id}`}
                              checked={isChecked}
                              // Solo permite cambios si no es obligatoria
                              onChange={() => {
                                if (!isObligatoria)
                                  handleCheckboxChangeFunciones(item);
                              }}
                              disabled={isObligatoria}
                            />
                            <label
                              htmlFor={`check-seccion-funciones-${item.id}`}
                            >
                              <span></span>
                              {item.pagina_avanzada || "Sin nombre"}
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
          precio={productosFiltrados?.valor}
          onCheckboxChange={handleCheckboxChangeSecciones}
        />
      </div>
    </div>
  );
}
