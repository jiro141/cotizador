// 🎯 Mapa de beneficios por página con puntuaciones (normalizadas a sumar 10 por beneficio)
const benefitMatrix = {
  "Tener presencia en internet 24/7": {
    "Landing Page Click and tough": 0.52,
    "Landing Page": 3.33,
    "Página informativa": 1.46,
    "Página corporativa": 1.01,
    "Página de reservas": 0.19,
    "Página de membresía": 0.19,
    "Pagina Blog": 0.07,
    "Pagina Foro": 2.23,
    "ecommerce": 1.02,
  },
  "Generar confianza y credibilidad en clientes": {
    "Landing Page Click and tough": 1.49,
    "Landing Page": 0.03,
    "Página informativa": 4.23,
    "Página corporativa": 2.15,
    "Página de reservas": 0.29,
    "Página de membresía": 0.24,
    "Pagina Blog": 0.24,
    "Pagina Foro": 0.44,
    "ecommerce": 0.9,
  },
  // 🔁 Repite para todos los demás beneficios...
};

// 📊 Función de evaluación
function evaluarPagina(prioridades) {
  const productos = [
    "Landing Page Click and tough",
    "Landing Page",
    "Página informativa",
    "Página corporativa",
    "Página de reservas",
    "Página de membresía",
    "Pagina Blog",
    "Pagina Foro",
    "ecommerce",
  ];

  // Inicializa score por página
  const scores = {};
  productos.forEach((p) => (scores[p] = 0));

  // Calcula el puntaje total por página basado en prioridades
  for (const beneficio in prioridades) {
    const peso = prioridades[beneficio]; // Ej: 1, 2, 3...
    const distribucion = benefitMatrix[beneficio];
    if (distribucion) {
      for (const producto in distribucion) {
        scores[producto] += distribucion[producto] * peso;
      }
    }
  }

  // Ordenar los productos de mejor a peor
  const resultadoOrdenado = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([producto, puntaje]) => ({ producto, puntaje: puntaje.toFixed(2) }));

  return resultadoOrdenado;
}

// 🧪 Ejemplo de uso
const misPrioridades = {
  "Tener presencia en internet 24/7": 2,
  "Generar confianza y credibilidad en clientes": 1,
  // Agrega más beneficios según lo desees...
};


