import React, { useContext, useEffect, useState } from "react";
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
  const [isPortadaOpen, setPortadaOpen] = useState(false);
  const [isPagina, setPagina] = useState(false);
  const [isPaginas, setPaginas] = useState(false);
  const [isFunciones, setFunciones] = useState(false);
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

  useEffect(() => {
    const objetos = cotizador
      .map((item) => item.fields)
      .filter((item) => item.Producto === state);
    setProductosFiltrados(objetos[0]);
  }, [cotizador, state]);

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
  }, []);
  useEffect(() => {
    fetchPortadaDatos();
    fetchPaginasBasicasDatos();
    fetchFuncionesExtrasDatos();
  }, [dataState, state]);

  // Funciones de toggle para las secciones
  const togglePortada = () => setPortadaOpen(!isPortadaOpen);
  const togglePagina = () => setPagina(!isPagina);
  const togglePaginas = () => setPaginas(!isPaginas);
  const toggleFunciones = () => setFunciones(!isFunciones);

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
      return isAlreadySelected ? [] : [item];
    });
  };

  // Maneja la selección de una sección con límite de puntos y muestra un aviso si se supera el límite
  const handleCheckboxChangeSecciones = (item) => {
    const itemValue = Number(item.Valor);

    // Calcular el nuevo valor total de las secciones seleccionadas
    const newCurrentValue =
      selectedSecciones.reduce((sum, i) => sum + Number(i.Valor), 0) +
      (selectedSecciones.some((i) => i.ID === item.ID)
        ? -itemValue
        : itemValue);

    console.log(selectedSecciones, "secciones");

    // Si se supera el maxValue y el límite no ha sido alcanzado
    if (newCurrentValue > maxValue) {
      setLimitReached(true); // Activar el límite alcanzado
      setSelectedSeccionesMax((prevSelectedSecciones) => {
        const isSelected = prevSelectedSecciones.some((i) => i.ID === item.ID);
        return isSelected
          ? prevSelectedSecciones.filter((i) => i.ID !== item.ID) // Desmarcar
          : [
              ...prevSelectedSecciones,
              {
                category: "Secciones",
                name: item["Secciones de portada básicas "],
                ID: item.ID,
                Valor: item.Valor,
                precio: item.precio,
              },
            ];
      });
    }
    // Si no se supera el maxValue y el límite ha sido alcanzado
    else if (newCurrentValue <= maxValue) {
      setLimitReached(false); // Desactivar el límite alcanzado
      setSelectedSecciones((prevSelectedSecciones) => {
        const isSelected = prevSelectedSecciones.some((i) => i.ID === item.ID);
        return isSelected
          ? prevSelectedSecciones.filter((i) => i.ID !== item.ID) // Desmarcar
          : [
              ...prevSelectedSecciones,
              {
                category: "Secciones",
                name: item["Secciones de portada básicas "],
                ID: item.ID,
                Valor: item.Valor,
                precio: item.precio,
              },
            ];
      });
    }
    // Si no se supera el maxValue y el límite no ha sido alcanzado
    else {
      setSelectedSecciones((prevSelectedSecciones) => {
        const isSelected = prevSelectedSecciones.some((i) => i.ID === item.ID);
        return isSelected
          ? prevSelectedSecciones.filter((i) => i.ID !== item.ID) // Desmarcar
          : [
              ...prevSelectedSecciones,
              {
                category: "Secciones",
                name: item["Secciones de portada básicas "],
                ID: item.ID,
                Valor: item.Valor,
                precio: item.precio,
              },
            ];
      });
    }
  };
  const [exceededPaginas, setExceededPaginas] = useState([]); // Nuevo estado para elementos excedentes
  const maxPaginas = productosFiltrados?.paginas || 0; // Máximo permitido

  const updateExceededPaginas = (newSelectedPaginas) => {
    if (newSelectedPaginas.length > maxPaginas) {
      setExceededPaginas(newSelectedPaginas);
    } else {
      setExceededPaginas([]);
    }
  };

  const handleCheckboxChangePaginas = (item) => {
    setSelectedPaginas((prevSelectedPaginas) => {
      const isSelected = prevSelectedPaginas.some((i) => i.ID === item.ID);

      const newSelectedPaginas = isSelected
        ? prevSelectedPaginas.filter((i) => i.ID !== item.ID)
        : [
            ...prevSelectedPaginas,
            {
              category: "Páginas Adicionales",
              name: item.paginas,
              ID: item.ID,
              Valor: item.Valor,
              precio: item.precio,
              count: 1,
            },
          ];

      // Actualizar estado de excedentes
      updateExceededPaginas(newSelectedPaginas);

      return newSelectedPaginas;
    });
  };

  const handleIncrement = (item) => {
    setSelectedPaginas((prevSelectedPaginas) => {
      const updatedPaginas = [...prevSelectedPaginas];

      const originalItem = prevSelectedPaginas.find((i) => i.ID === item.ID);
      if (originalItem) {
        updatedPaginas.push({ ...originalItem, count: originalItem.count + 1 });
      }

      // Actualizar estado de excedentes
      updateExceededPaginas(updatedPaginas);

      return updatedPaginas;
    });
  };

  const handleDecrement = (item) => {
    setSelectedPaginas((prevSelectedPaginas) => {
      const updatedPaginas = [...prevSelectedPaginas];

      const indexToRemove = updatedPaginas.findIndex((i) => i.ID === item.ID);

      if (indexToRemove !== -1) {
        const itemToDecrement = updatedPaginas[indexToRemove];

        if (itemToDecrement.count > 1) {
          updatedPaginas[indexToRemove] = {
            ...itemToDecrement,
            count: itemToDecrement.count - 1,
          };
        } else {
          updatedPaginas.splice(indexToRemove, 1);
        }
      }

      // Actualizar estado de excedentes
      updateExceededPaginas(updatedPaginas);

      return updatedPaginas;
    });
  };
  console.log(exceededPaginas,'hola');
  

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
              precio: item.precio,
            },
          ];
    });
  };
  useEffect(() => {
    setDataState(initialDataState); // Reinicia dataState al valor inicial
  }, [state]);

  return (
    <>
      <div className="grid">
        <div className="container-text">
          <p>{productosFiltrados?.descripcion}</p>
        </div>
        <div>
          <h4>Elementos básicos</h4> <br />
          <p>Páginas: {productosFiltrados?.paginas}</p>
          <p>Secciones: {productosFiltrados?.Secciones}</p>
          <br />
          {dataState?.portada?.length > 0 && (
            <>
              <h4>Secciones Obligatorias:</h4>
              {dataState.portada.map((item, index) => (
                <ul>
                  <li key={index}>{item}</li>
                </ul>
              ))}
            </>
          )}
          {dataState?.paginasBasicas?.length > 0 && (
            <>
              <h4>Paginas Obligatorias:</h4>
              {dataState.paginasBasicas.map((item, index) => (
                <ul>
                  <li key={index}>{item}</li>
                </ul>
              ))}
            </>
          )}
          {dataState?.funcionesExtras?.length > 0 && (
            <>
              <h4>Funciones Obligatorias:</h4>
              {dataState.funcionesExtras.map((item, index) => (
                <ul>
                  <li key={index}>{item}</li>
                </ul>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Sección de Servicios Mensuales */}
      <div>
        <h3
          onClick={togglePagina}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            fontSize: "32px",
          }}
        >
          Servicios Mensuales
          <span style={{ marginLeft: "8px", color: isPagina ? "#ff5722" : "" }}>
            {isPagina ? (
              <IoIosArrowUp size={20} />
            ) : (
              <IoIosArrowDown size={20} />
            )}
          </span>
        </h3>
        {isPagina && (
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
          <h3
            onClick={togglePortada}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "32px",
            }}
          >
            Secciones de la Landing
            <span
              style={{
                marginLeft: "8px",
                color: isPortadaOpen ? "#ff5722" : "",
              }}
            >
              {isPortadaOpen ? (
                <IoIosArrowUp size={20} />
              ) : (
                <IoIosArrowDown size={20} />
              )}
            </span>
          </h3>

          {isPortadaOpen && (
            <div>
              {loadingData ? (
                <BounceLoader />
              ) : error ? (
                <p>Error al cargar datos</p>
              ) : (
                <div className="section-container">
                  {pares.concat(impares).map((item) => (
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
                          selectedSeccionesMax.some((i) => i.ID === item.ID)
                        }
                        onChange={() => handleCheckboxChangeSecciones(item)}
                      />
                      <label htmlFor={`check-seccion-portada-${item.ID}`}>
                        <span></span>
                        {item["Secciones de portada básicas "]?.trim() ||
                          "Sin nombre"}
                      </label>
                    </div>
                  ))}
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
            <h3
              onClick={togglePaginas}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "32px",
              }}
            >
              Páginas Adicionales
              <span
                style={{
                  marginLeft: "8px",
                  color: isPaginas ? "#ff5722" : "",
                }}
              >
                {isPaginas ? (
                  <IoIosArrowUp size={20} />
                ) : (
                  <IoIosArrowDown size={20} />
                )}
              </span>
            </h3>
            {isPaginas && (
              <div>
                {loadingPaginas ? (
                  <BounceLoader />
                ) : error ? (
                  <p>Error al cargar datos</p>
                ) : (
                  <div className="section-container">
                    {paginas.map((item) => {
                      const itemFields = item.fields || {};
                      const selectedCount = selectedPaginas.filter(
                        (i) => i.ID === itemFields.ID
                      ).length; // Filtra y cuenta cuántas veces aparece este ID

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
                                !!selectedPaginas.find(
                                  (i) => i.ID === itemFields.ID
                                )
                              }
                              onChange={() =>
                                handleCheckboxChangePaginas(itemFields)
                              }
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

      <Separator />
      {/* Sección de Funciones adicionales */}
      <div>
        <h3
          onClick={toggleFunciones}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            fontSize: "32px",
          }}
        >
          Funciones adicionales
          <span
            style={{ marginLeft: "8px", color: isFunciones ? "#ff5722" : "" }}
          >
            {isFunciones ? (
              <IoIosArrowUp size={20} />
            ) : (
              <IoIosArrowDown size={20} />
            )}
          </span>
        </h3>
        {isFunciones && (
          <div>
            {loadingFunciones ? (
              <BounceLoader />
            ) : error ? (
              <p>Error al cargar datos</p>
            ) : (
              <div className="section-container">
                {funcionesA.map((item) => {
                  const itemFields = item.fields || {};
                  return (
                    <div key={itemFields.ID} className="checkbox-wrapper-24">
                      <input
                        type="checkbox"
                        id={`check-seccion-funciones-${itemFields.ID}`} // IDs únicos
                        checked={selectedFunciones.some(
                          (i) => i.ID === itemFields.ID
                        )}
                        onChange={() =>
                          handleCheckboxChangeFunciones(itemFields)
                        }
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
          onCheckboxChange={handleCheckboxChangeSecciones}
        />
      </div>
    </>
  );
}
