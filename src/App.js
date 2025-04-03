import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { precioPais } from "./controller/api";
import Login from "./layout/Login";
import ProtectedRoute from "./ProtectedRoute";
import MainContent from "./layout/MainContent";
import Dashboard from "./layout/Dashboard";
import SmartSolutions from "./layout/SmartSolutions";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [precio, setPrecio] = useState(null);

  // ✅ Verificar autenticación al cargar la app
  useEffect(() => {
    try {
      const authData = JSON.parse(localStorage.getItem("authData"));
      
      if (authData && authData.isAuthenticated && authData.expiry > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("authData"); // Limpiar sesión expirada
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error al leer authData:", error);
      setIsAuthenticated(false);
    }
  }, []);

  // ✅ Obtener precios cuando cambia `isAuthenticated` o `user`
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPreciosPais = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.pais?.[0]) return;
    
        const data = await precioPais(user.pais[0]); // Obtener precio por país
    
        const precioRedondeado = Math.ceil(data.horaTrabajo); // 🔥 Redondeo hacia arriba
    
        setPrecio(precioRedondeado);
    
        // Guardar en localStorage el valor redondeado
        localStorage.setItem("precio", JSON.stringify(precioRedondeado));
      } catch (error) {
        console.error("Error al obtener los precios por país:", error);
      }
    };
    

    fetchPreciosPais();

    // ✅ Evento para escuchar cambios en `localStorage`
    const handleStorageChange = (event) => {
      if (event.key === "user" || event.key === "authData") {
        fetchPreciosPais(); // Se actualiza si `user` o `authData` cambian
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated]);

  const handleLogin = (isLoggedIn) => {
    setIsAuthenticated(isLoggedIn);

    if (isLoggedIn) {
      // Calcula el tiempo de expiración (2 horas desde ahora)
      const expiry = Date.now() + 2 * 60 * 60 * 1000; // 2 horas en milisegundos
      localStorage.setItem(
        "authData",
        JSON.stringify({ isAuthenticated: true, expiry })
      );
    } else {
      localStorage.removeItem("authData");
    }
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para el inicio de sesión */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Ruta protegida que solo muestra MainContent si está autenticado */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/webEsencial"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smarSolution"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SmartSolutions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
