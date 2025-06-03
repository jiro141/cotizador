import { useContext, useEffect, useState, useRef } from "react";
import { MyContext } from "../../context/Context";
import {
  getCotizador,
  getData,
  getServiciosMensuales,
  getPaginasAdicionales,
  getFuncionesAdicionales,
  fetchPortadaElementos,
  fetchPaginasBasicas,
  fetchFuncionesExtras,
} from "../../controller/api";
import { toast } from "react-hot-toast";

export default function useLanding() {
  // GLOBAL STATE
  const { state } = useContext(MyContext);

  // MAIN DATA STATES
  const [cotizador, setCotizador] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState(null);
  const [data, setData] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [paginas, setPaginas] = useState([]);
  const [funcionesA, setFuncionesA] = useState([]);

  // UI SELECTION STATES
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedSecciones, setSelectedSecciones] = useState([]);
  const [selectedSeccionesMax, setSelectedSeccionesMax] = useState([]);
  const [selectedPaginas, setSelectedPaginas] = useState([]);
  const [selectedFunciones, setSelectedFunciones] = useState([]);

  // EXTRA TRACKING
  const [exceededPaginas, setExceededPaginas] = useState([]);
  const [limitReached, setLimitReached] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [error, setError] = useState(null);

  // DATA STATE WITH LOADING/ERRORS
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

  // ==================== FETCHES ====================
  const fetchCotizador = async () => {
    try {
      const res = await getCotizador();
      setCotizador(res);
    } catch (err) {
      setError(err);
    }
  };

  const fetchAllGeneral = async () => {
    try {
      setData(await getData());
      setServicios(await getServiciosMensuales());
      setPaginas(await getPaginasAdicionales());
      setFuncionesA(await getFuncionesAdicionales());
    } catch (err) {
      setError(err);
    }
  };

  const fetchLandingSpecific = async (match) => {
    try {
      setDataState((prev) => ({
        ...prev,
        loading: {
          portada: true,
          paginasBasicas: true,
          funcionesExtras: true,
        },
      }));
      const [portada, paginasB, funcionesE] = await Promise.all([
        Promise.all(match?.secciones.map(fetchPortadaElementos)),
        Promise.all(match?.paginas.map(fetchPaginasBasicas)),
        Promise.all(match?.funciones_obligatorias.map(fetchFuncionesExtras)),
      ]);
      setDataState((prev) => ({
        ...prev,
        portada,
        paginasBasicas: paginasB,
        funcionesExtras: funcionesE,
        loading: {
          portada: false,
          paginasBasicas: false,
          funcionesExtras: false,
        },
      }));
    } catch (err) {
      setDataState((prev) => ({
        ...prev,
        error: {
          portada: err,
          paginasBasicas: err,
          funcionesExtras: err,
        },
      }));
    }
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchCotizador();
    fetchAllGeneral();
  }, []);

  useEffect(() => {
    if (!cotizador.length || !state) return;
    const match = cotizador.find(
      (item) =>
        item.producto?.trim().toLowerCase() === state.trim().toLowerCase()
    );
    if (match) {
      setProductosFiltrados(match);
      fetchLandingSpecific(match);
    }
  }, [cotizador, state]);

  // ==================== TOGGLE ====================
  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  // ==================== TOASTS ====================
  const useToastOnArrayChange = (array, message, id) => {
    const prevRef = useRef(0);
    useEffect(() => {
      if (prevRef.current === 0 && array.length > 0) {
        toast(message, { id });
      }
      prevRef.current = array.length;
    }, [array]);
  };

  useToastOnArrayChange(
    selectedSeccionesMax,
    "Agregaste secciones extra",
    "secciones-toast"
  );
  useToastOnArrayChange(
    exceededPaginas,
    "Agregaste páginas adicionales extra",
    "paginas-toast"
  );

  return {
    cotizador,
    productosFiltrados,
    data,
    servicios,
    paginas,
    funcionesA,
    dataState,
    selectedServicios,
    selectedSecciones,
    selectedSeccionesMax,
    selectedPaginas,
    exceededPaginas,
    selectedFunciones,
    limitReached,
    openSection,
    toggleSection,
    error,
  };
}
