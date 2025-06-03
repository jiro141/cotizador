import React from "react";
import { useState } from "react";
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
import LandingPageClickThrough from "./LandingPageClickThrough";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PRODUCT_LABELS = {
  1: "Landing Page Click Through",
  2: "Web de Inicio (Landing básica)",
  3: "Web de Reservaciones",
  4: "Página Corporativa",
  5: "Web Informativa",
  6: "Blog",
  7: "Página de Membresía",
  8: "Aula virtual",
  9: "eCommerce",
};

const StepThreeForm = ({ handleSubmit, formData, handleBack }) => {
  const selectedObjects = Object.values(formData?.beneficios || {}).flat();
  const [showRadar, setShowRadar] = useState(true);
  // Sumatoria de puntajes por producto_id
  const productScores = {};

  selectedObjects.forEach((benefit) => {
    benefit.puntos?.forEach(({ producto_id, puntaje }) => {
      if (!productScores[producto_id]) {
        productScores[producto_id] = 0;
      }
      productScores[producto_id] += puntaje;
    });
  });

  // Convertir a labels y datos para el radar
  const labels = Object.keys(PRODUCT_LABELS).map((id) => PRODUCT_LABELS[id]);
  const dataValues = Object.keys(PRODUCT_LABELS).map(
    (id) => productScores[id] || 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Relevancia total",
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
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div>
      <div
        style={{
          display: showRadar ? "flex" : "flex",
          flexDirection: showRadar ? "row" : "column",
        }}
      >
        {showRadar && (
          <div
            style={{
              backgroundColor: "#2c2c2c",
              maxHeight: "500px",
              padding: "10px",
              zIndex: "99",
              borderRadius: "8px",
            }}
          >
            <Radar
              style={{
                maxWidth: "500px",
                height: "600px",
              }}
              data={data}
              options={options}
            />
          </div>
        )}
        <div
          style={{
            zIndex: "999999999999999999999999999",
          }}
        >
          <Buttons  />
          <LandingPageClickThrough />
        </div>
      </div>
    </div>
  );
};

export default StepThreeForm;
