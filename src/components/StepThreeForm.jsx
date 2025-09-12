import React, { useEffect, useState, useMemo } from "react";
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
  getCotizador,
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
  1: img3,
  2: img1,
  3: img2,
  4: img7,
  5: img9,
  6: img4,
  7: img6,
  8: img8,
  9: img5,
};

const StepThreeForm = ({ formData }) => {
  /** ===============================
   * Cálculo de ranking de productos
   * =============================== */
  const { ranking, labels, dataValues } = useMemo(() => {
    const selectedObjects = Object.values(formData?.beneficios || {}).flat();


    // Acumular puntajes
    const scores = selectedObjects.reduce((acc, benefit) => {
      (benefit.puntos || []).forEach(({ producto_id, puntaje }) => {
        acc[producto_id] = (acc[producto_id] || 0) + puntaje;
      });
      return acc;
    }, {});

    // Ranking ordenado
    const rankingArray = Object.entries(scores)
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score);

    // Labels y valores para radar chart
    const labels = Object.keys(PRODUCT_LABELS).map((id) => PRODUCT_LABELS[id]);
    const dataValues = Object.keys(PRODUCT_LABELS).map((id) => scores[id] || 0);

    return { ranking: rankingArray, labels, dataValues };
  }, [formData]);

  const maxScoreProductId = ranking[0]?.id || null;
  const secondScoreProductId = ranking[1]?.id || null;

  /** ===============================
   * Estados y carga de datos extra
   * =============================== */
  const [allProductos, setAllProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFuncionesAdicionales(),
      getPaginasAdicionales(),
      getData(),
      getCotizador(),
    ])
      .then(([_, __, ___, productos]) => {
        setAllProductos(productos);
      })
      .finally(() => setLoading(false));
  }, []);

  /** ===============================
   * Descripciones
   * =============================== */
  const descripcionProductoSugerido = useMemo(() => {
    if (!allProductos.length || !maxScoreProductId) return "";
    const producto = allProductos.find(
      (p) => String(p.id) === String(maxScoreProductId)
    );
    return producto ? producto.descripcion : "";
  }, [allProductos, maxScoreProductId]);

  /** ===============================
   * Chart data
   * =============================== */
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
          font: { size: 14 },
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
    plugins: { legend: { display: false } },
  };

  return (
    <div>
      <Buttons />
      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "space-around",
        }}
      >
        {/* Radar chart */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            maxWidth: "400px",
            borderRadius: "8px",
          }}
        >
          <Radar style={{ height: "250px" }} data={data} options={options} />
        </div>

        {/* Producto sugerido principal */}
        {maxScoreProductId && (
          <div
            style={{
              background: "#1a1a1a",
              padding: "1rem",
              borderRadius: "12px",
              color: "white",
              minWidth: "240px",
              maxWidth: "280px",
              boxShadow: "0 4px 16px #0004",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.8em",
              justifyContent: "center",
            }}
          >
            <img
              src={PRODUCT_IMAGES[maxScoreProductId]}
              alt={PRODUCT_LABELS[maxScoreProductId]}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "contain",
                borderRadius: "10px",
                marginBottom: "0.5em",
                boxShadow: "0 2px 6px #0003",
              }}
            />
            <h3 style={{ margin: "0.2em 0", textAlign: "center" }}>
              {PRODUCT_LABELS[maxScoreProductId]}
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", textAlign: "center" }}>
              {descripcionProductoSugerido}
            </p>

            {/* Segundo producto sugerido */}
            {secondScoreProductId && (
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "#2a2a2a",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  boxShadow: "0 2px 6px #0003",
                  fontSize: "0.9rem",
                }}
              >
                <img
                  src={PRODUCT_IMAGES[secondScoreProductId]}
                  alt={PRODUCT_LABELS[secondScoreProductId]}
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                  }}
                />
                <span>{PRODUCT_LABELS[secondScoreProductId]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepThreeForm;
