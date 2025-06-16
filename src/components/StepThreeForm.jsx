import React, { useEffect, useState } from "react";
import img1 from "../img/Recurso 11.svg";
import img2 from "../img/Group 44.svg";
import img3 from "../img/Group 65 (1).svg";
import img4 from "../img/Recurso 52.svg";
import img5 from "../img/Group 64.svg";
import img6 from "../img/Group 46.svg";
import img7 from "../img/Group 63.svg";
import img8 from "../img/Group 48.svg";
import img9 from "../img/Group 66.svg";
import {
  getFuncionesAdicionales,
  getPaginasAdicionales,
  getData,
} from "../controller/api";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import Buttons from "./Buttons";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PRODUCT_LABELS = {
  1: "Landing Page",
  2: "Web de Inicio",
  3: "Web de Reservas",
  4: "Web Corporativa",
  5: "Web Informativa",
  6: "Blog",
  7: "Membresía",
  8: "Aula Virtual",
  9: "eCommerce",
};

const PRODUCT_IMAGES = {
  1: img3, // Landing Page Click through
  2: img1, // Web de Inicio (Landing básica)
  3: img2, // Web de Reservaciones
  4: img7, // Página Corporativa
  5: img9, // Web Informativa
  6: img4, // Blog
  7: img6, // Página de Membresía
  8: img8, // Aula Virtual
  9: img5, // eCommerce
};

const StepThreeForm = ({ formData }) => {

  
  // Calcular puntajes
  const selectedObjects = Object.values(formData?.beneficios || {}).flat();
  const productScores = {};
  selectedObjects.forEach((benefit) => {
    benefit.puntos?.forEach(({ producto_id, puntaje }) => {
      if (!productScores[producto_id]) {
        productScores[producto_id] = 0;
      }
      productScores[producto_id] += puntaje;
    });
  });

  const labels = Object.keys(PRODUCT_LABELS).map((id) => PRODUCT_LABELS[id]);
  const dataValues = Object.keys(PRODUCT_LABELS).map(
    (id) => productScores[id] || 0
  );

  // Producto sugerido
  const maxScoreProduct = Object.entries(productScores).reduce(
    (max, [id, score]) => (score > max.score ? { id, score } : max),
    { id: null, score: -Infinity }
  );
  const maxScoreProductId = maxScoreProduct.id;

  // Estados para sugerencias (todas las funciones, páginas, secciones)
  const [allFunciones, setAllFunciones] = useState([]);
  const [allPaginas, setAllPaginas] = useState([]);
  const [allSecciones, setAllSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar TODOS los datos al montar
  useEffect(() => {
    setLoading(true);
    Promise.all([getFuncionesAdicionales(), getPaginasAdicionales(), getData()])
      .then(([funciones, paginas, secciones]) => {
        setAllFunciones(funciones);
        setAllPaginas(paginas);
        setAllSecciones(secciones);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrar sugerencias según el producto sugerido (por array productos)
  const funciones = allFunciones.filter(
    (f) =>
      Array.isArray(f.productos) &&
      f.productos.some((prod) => String(prod) === String(maxScoreProductId))
  );
  const paginas = allPaginas.filter(
    (p) =>
      Array.isArray(p.productos) &&
      p.productos.some((prod) => String(prod) === String(maxScoreProductId))
  );
  const secciones = allSecciones.filter(
    (s) =>
      Array.isArray(s.productos) &&
      s.productos.some((prod) => String(prod) === String(maxScoreProductId))
  );

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: dataValues,
        backgroundColor: "rgba(112, 173, 223, 0.2)",
        borderColor: "#70addf",
        pointBackgroundColor: "#70addf",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "#ffffff66" },
        grid: { color: "#ffffff33" },
        pointLabels: {
          font: { size: 16 },
          color: "#ffffff",
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          color: "#ffffff",
          backdropColor: "transparent",
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={{ zIndex: "99" }}>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <div
          style={{
            backgroundColor: "#2c2c2c",
            maxWidth: "600px",
            borderRadius: "8px",
          }}
        >
          <Radar style={{ height: "400px" }} data={data} options={options} />
        </div>
        {/* Producto sugerido */}
        {maxScoreProductId && (
          <div
            style={{
              background: "#2c2c2c",
              padding: "2rem",
              borderRadius: "12px",
              color: "white",
              minWidth: "300px",
              maxWidth: "350px",
              boxShadow: "0 4px 16px #0004",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.2em",
              justifyContent:'center'
            }}
          >
            <h3 style={{ margin: 0 }}>Producto Sugerido</h3>
            {/* Imagen aquí */}
            <img
              src={PRODUCT_IMAGES[maxScoreProductId]}
              alt={PRODUCT_LABELS[maxScoreProductId]}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                borderRadius: "14px",
                // background: "#fff2",
                marginBottom: "0.8em",
                boxShadow: "0 2px 8px #0003",
              }}
            />
            <h2 style={{ margin: "0.5em 0 0.25em", textAlign: "center" }}>
              {PRODUCT_LABELS[maxScoreProductId]}
            </h2>
            <p style={{ margin: "0 0 1em", fontWeight: "bold" }}>
              Puntaje: {maxScoreProduct.score}
            </p>
            {/* <div style={{ width: "100%" }}>
              <strong>Secciones sugeridas:</strong>
              <ul>
                {loading ? (
                  <li>Cargando...</li>
                ) : secciones.length === 0 ? (
                  <li>No hay sugerencias</li>
                ) : (
                  secciones.map((s, i) => <li key={i}>{s.seccion}</li>)
                )}
              </ul>
            </div> */}
            {/* <div style={{ width: "100%" }}>
              <strong>Funciones sugeridas:</strong>
              <ul>
                {loading ? (
                  <li>Cargando...</li>
                ) : funciones.length === 0 ? (
                  <li>No hay sugerencias</li>
                ) : (
                  funciones.map((f, i) => <li key={i}>{f.pagina_avanzada}</li>)
                )}
              </ul>
            </div>
            <div style={{ width: "100%" }}>
              <strong>Páginas sugeridas:</strong>
              <ul>
                {loading ? (
                  <li>Cargando...</li>
                ) : paginas.length === 0 ? (
                  <li>No hay sugerencias</li>
                ) : (
                  paginas.map((p, i) => <li key={i}>{p.pagina}</li>)
                )}
              </ul>
            </div> */}
          </div>
        )}
      </div>
      <Buttons />
    </div>
  );
};

export default StepThreeForm;
