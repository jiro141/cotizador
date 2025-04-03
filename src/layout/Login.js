import React, { useState } from "react";
import { authenticateUser } from "../controller/api";
import { updatePassword } from "../controller/api"; // Nueva función para actualizar la contraseña
import "./css/Login.css"; // Asegúrate de tener un archivo CSS para los estilos
import logo from "../img/cropped-logo.png";
import toast, { Toaster } from "react-hot-toast";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requiresPasswordSetup, setRequiresPasswordSetup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el spinner

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Muestra el spinner

    try {
      const user = await authenticateUser(username, password);

      if (user.requiresPasswordSetup) {
        toast.success("Por favor, configure su contraseña."); // Toast informativo
        setRequiresPasswordSetup(true);
        setUserId(user.id);
      } else {
        toast.success("Inicio de sesión exitoso.");
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(true); // Usuario autenticado
      }
    } catch (err) {
      toast.error(err.message || "Error al iniciar sesión."); // Toast de error
    } finally {
      setIsLoading(false); // Oculta el spinner
    }
  };

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Muestra el spinner

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden."); // Toast de error
      setIsLoading(false); // Oculta el spinner
      return;
    }

    try {
      await updatePassword(userId, newPassword); // Actualiza la contraseña en Airtable
      toast.success("Contraseña configurada exitosamente. Inicia sesión."); // Toast de éxito
      setRequiresPasswordSetup(false); // Vuelve al formulario de inicio de sesión
      setNewPassword(""); // Limpia el campo de nueva contraseña
      setConfirmPassword(""); // Limpia el campo de confirmar contraseña
    } catch (err) {
      toast.error(err.message || "Error al guardar la contraseña."); // Toast de error
    } finally {
      setIsLoading(false); // Oculta el spinner
    }
  };

  return (
    <div className="login-form-container">
      {/* Componente de Toaster para mostrar los toasts */}
      <Toaster position="top-center" reverseOrder={false} />
      <h3 className="titulo">Bienvenido al cotizador Detip</h3>
      {isLoading && ( // Spinner visible solo cuando `isLoading` es true
        <div className="spinner-container">
          <img
            src={logo} // Cambia a la ruta de tu logo
            alt="Cargando..."
            className="spinner"
          />
        </div>
      )}
      {!requiresPasswordSetup ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              id="username"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
          </div>
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      ) : (
        <div className="login-form">
          <form className="password-setup-form" onSubmit={handlePasswordSetup}>
            <h2>Configurar Contraseña</h2>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                id="newPassword"
                placeholder=" "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="newPassword" className="form-label">
                Nueva Contraseña
              </label>
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña
              </label>
            </div>
            <button type="submit" className="login-button">
              Guardar Contraseña
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
