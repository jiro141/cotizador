import React, { useEffect, useState } from 'react';
import { getData, getPaginasAdicionales, getServiciosMensuales } from '../controller/api';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BounceLoader } from 'react-spinners';
import Calculadora from './Calculadora';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Secc from './Secc';

export default function LandingPageClickThrough() {

    // Estados de visibilidad para los elementos
    const [isPortadaOpen, setPortadaOpen] = useState(false);
    const [isPagina, setPagina] = useState(false);
    const [isPaginas, setPaginas] = useState(false);

    // Estados para almacenar datos
    const [data, setData] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [paginas, setPaginasData] = useState([]);

    // Estados de selección independientes
    const [selectedServicios, setSelectedServicios] = useState([]);
    const [selectedSecciones, setSelectedSecciones] = useState([]);
    const [selectedPaginas, setSelectedPaginas] = useState([]);

    // Estados para manejo de carga y errores
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingServicios, setLoadingServicios] = useState(true);
    const [loadingPaginas, setLoadingPaginas] = useState(true);

    // Control de límite de selección para Secciones
    const [limitReached, setLimitReached] = useState(false);
    const [setCurrentValue] = useState(0);
    const maxValue = 4;

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

    // Llama a las funciones de obtención de datos al montar el componente
    useEffect(() => {
        fetchData();
        fetchServicios();
        fetchPaginas();
    }, []);

    // Funciones de toggle para las secciones
    const togglePortada = () => setPortadaOpen(!isPortadaOpen);
    const togglePagina = () => setPagina(!isPagina);
    const togglePaginas = () => setPaginas(!isPaginas);

    // Filtros para dividir los datos en pares e impares (para "Secciones de la Landing")
    const pares = data.filter((item, index) => index % 2 === 0).map((item) => item.fields);
    const impares = data.filter((item, index) => index % 2 !== 0).map((item) => item.fields);

    // Maneja la selección de un servicio mensual (selección única)
    const handleCheckboxChangeServicios = (item) => {
        setSelectedServicios((prevSelected) => {
            const isAlreadySelected = prevSelected.some((i) => i.fields && i.fields.ID === item.fields.ID);
            return isAlreadySelected ? [] : [item];
        });
    };

    // Maneja la selección de una sección con límite de puntos y muestra un aviso si se supera el límite
    const handleCheckboxChangeSecciones = (item) => {
        const itemValue = Number(item.Valor);
        const newCurrentValue = selectedSecciones.reduce((sum, i) => sum + Number(i.Valor), 0) +
            (selectedSecciones.some((i) => i.ID === item.ID) ? -itemValue : itemValue);

        if (newCurrentValue > maxValue && !limitReached) {
            toast.warning('Acabas de superar el límite máximo de puntos para una Landing Page. A partir de aquí todo se cobrará como extra.');
            setLimitReached(true);
        } else if (newCurrentValue <= maxValue && limitReached) {
            setLimitReached(false);
        }

        setCurrentValue(newCurrentValue);

        setSelectedSecciones((prevSelectedSecciones) => {
            const isSelected = prevSelectedSecciones.some((i) => i.ID === item.ID);
            return isSelected
                ? prevSelectedSecciones.filter((i) => i.ID !== item.ID)
                : [...prevSelectedSecciones, { category: 'Secciones', name: item["Secciones de portada básicas "], ID: item.ID, Valor: item.Valor, precio: item.precio }];
        });
    };

    // Maneja la selección de una página adicional (sin límite)
    const handleCheckboxChangePaginas = (item) => {
        setSelectedPaginas((prevSelectedPaginas) => {
            const isSelected = prevSelectedPaginas.some((i) => i.ID === item.ID);
            return isSelected
                ? prevSelectedPaginas.filter((i) => i.ID !== item.ID)
                : [...prevSelectedPaginas, { category: 'Páginas Adicionales', name: item.paginas, ID: item.ID, Valor: item.Valor, precio: item.precio }];
        });
    };

    return (
        <>
            <ToastContainer />
            <div className='grid'>
                <div className='container-text'>
                    <p>Nuestra oferta incluye el diseño y desarrollo de una Landing Page enfocada en la optimización de la conversión y la generación de clics a través de un diseño atractivo y funcional.</p>
                </div>
                <div>
                    <h4>Elementos básicos</h4>
                    <p>Páginas: 1</p>
                    <p>Secciones: 4</p>
                    <p>Obligatorios: Banner y contactos</p>
                </div>
            </div>

            {/* Sección de Servicios Mensuales */}
            <div>
                <h3 onClick={togglePagina} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
                    Servicios Mensuales
                    <span style={{ marginLeft: '8px', color: isPagina ? '#ff5722' : '' }}>
                        {isPagina ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
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
            <div>
                <h3 onClick={togglePortada} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
                    Secciones de la Landing
                    <span style={{ marginLeft: '8px', color: isPortadaOpen ? '#ff5722' : '' }}>
                        {isPortadaOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
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
                                    <div key={item.ID} className="checkbox-wrapper-24">
                                        <input
                                            type="checkbox"
                                            id={`check-seccion-portada-${item.ID}`} // IDs únicos
                                            checked={selectedSecciones.some((i) => i.ID === item.ID)}
                                            onChange={() => handleCheckboxChangeSecciones(item)}
                                        />
                                        <label htmlFor={`check-seccion-portada-${item.ID}`}>
                                            <span></span>
                                            {item["Secciones de portada básicas "]?.trim() || "Sin nombre"}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sección de Páginas Adicionales */}
            <div>
                <h3 onClick={togglePaginas} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
                    Páginas Adicionales
                    <span style={{ marginLeft: '8px', color: isPaginas ? '#ff5722' : '' }}>
                        {isPaginas ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
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
                                    return (
                                        <div key={itemFields.ID} className="checkbox-wrapper-24">
                                            <input
                                                type="checkbox"
                                                id={`check-seccion-paginas-${itemFields.ID}`} // IDs únicos
                                                checked={selectedPaginas.some((i) => i.ID === itemFields.ID)}
                                                onChange={() => handleCheckboxChangePaginas(itemFields)}
                                            />
                                            <label htmlFor={`check-seccion-paginas-${itemFields.ID}`}>
                                                <span></span>
                                                {itemFields.paginas || "Sin nombre"}
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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                <Calculadora
                    data={data}
                    selectedServicios={selectedServicios}
                    selectedSecciones={selectedSecciones}
                    selectedPaginas={selectedPaginas}
                    onCheckboxChange={handleCheckboxChangeSecciones}
                />
            </div>
        </>
    );
}
