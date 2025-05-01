import React from "react";
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
const productProfiles = {
  "Landing Page Click Through": [
    "Tener presencia en internet 24/7",
    "Generar confianza y credibilidad en clientes",
    "Aumentar la visibilidad de la marca",
    "Posicionarse mejor en buscadores (SEO)",
    "Mostrar promociones o novedades",
    "Recolectar correos y construir una base de datos",
  ],
  "Web de Inicio (Landing básica)": [
    "Tener presencia en internet 24/7",
    "Mostrar ubicación y datos de contacto fácilmente",
    "Mostrar portafolios o testimonios",
    "Facilitar la comunicación con los clientes",
  ],
  "Web de Reservaciones": [
    "Agilizar reservas, citas o pedidos",
    "Facilitar la comunicación con los clientes",
    "Permitir pagos digitales o suscripciones",
    "Automatizar procesos repetitivos",
  ],
  "Página Corporativa": [
    "Generar confianza y credibilidad en clientes",
    "Mostrar portafolios o testimonios",
    "Facilitar la comunicación con los clientes",
    "Posicionarse mejor en buscadores (SEO)",
    "Centralizar la información del negocio",
  ],
  "Web Informativa": [
    "Educar al cliente sobre productos/servicios",
    "Mostrar ubicación y datos de contacto fácilmente",
    "Facilitar la comunicación con los clientes",
    "Obtener datos y estadísticas de usuarios",
  ],
  Blog: [
    "Educar al cliente sobre productos/servicios",
    "Obtener datos y estadísticas de usuarios",
    "Facilitar la atención multicanal (WhatsApp, email, chatbot)",
    "Recolectar correos y construir una base de datos",
  ],
  "Página de Membresía": [
    "Gestionar usuarios, clientes o productos desde un panel de control",
    "Permitir pagos digitales o suscripciones",
    "Facilitar la atención multicanal (WhatsApp, email, chatbot)",
    "Mostrar promociones o novedades",
  ],
  "Aula virtual": [
    "Educar al cliente sobre productos/servicios",
    "Facilitar la atención multicanal (WhatsApp, email, chatbot)",
    "Ofrecer contenido descargable (ebooks, catálogos, etc.)",
    "Automatizar procesos repetitivos",
  ],
  eCommerce: [
    "Vender productos o servicios en línea",
    "Permitir pagos digitales o suscripciones",
    "Tener control y administración de inventario",
    "Mostrar promociones o novedades",
    "Facilitar la atención multicanal (WhatsApp, email, chatbot)",
  ],
};
const StepThreeForm = ({ handleSubmit, formData, handleBack }) => {
  const selectedBenefits = formData?.beneficios_producto || [];

  const calculateSimilarityScore = (selectedBenefits, profiles) => {
    const scores = {};

    for (const [product, idealBenefits] of Object.entries(profiles)) {
      const matches = selectedBenefits.filter((b) => idealBenefits.includes(b));
      const score = (matches.length / idealBenefits.length) * 10;
      scores[product] = Math.round(score);
    }

    return scores;
  };

  const similarityScores = calculateSimilarityScore(
    selectedBenefits,
    productProfiles
  );

  const data = {
    labels: Object.keys(similarityScores),
    datasets: [
      {
        label: "Coincidencia (%)",
        data: Object.values(similarityScores),
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
          stepSize: 1,
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
    <div className="custom-form">
      <div>
        <Radar
          style={{
            minWidth: "800px",
            height: "600px",
          }}
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default StepThreeForm;
