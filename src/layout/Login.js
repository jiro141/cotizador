import React, { useState } from "react";
import { authenticateUser } from "../controller/api";
import "./css/Login.css";
import logo from "../img/cropped-logo.png";
import toast, { Toaster } from "react-hot-toast";
import Olvido from "../components/Olvido";
import Crear from "../components/Crear";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requiresPasswordSetup, setRequiresPasswordSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [olvido, setOlvido] = useState(false);

  // Login normal
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authenticateUser(username, password);
      console.log(user,'hola');
      
      if (user.requiresPasswordSetup) {
        setRequiresPasswordSetup(true);
        toast("Debes configurar una nueva contraseña.");
      } else {
        toast.success("Inicio de sesión exitoso.");
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(true);
      }
    } catch (err) {
      toast.error(err.message || "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  // Setup de nueva contraseña
  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      // Autentica usando el mismo método con el nuevo password
      const user = await authenticateUser(username, newPassword);
      toast.success("Contraseña configurada exitosamente. Iniciando sesión...");
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(true);
    } catch (err) {
      toast.error(err.message || "Error al guardar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  // Vista de olvido
  const handleOlvido = () => {
    setOlvido(!olvido);
  };

  return (
    <div className="login-form-container">
      <Toaster position="top-center" reverseOrder={false} />
      <h3 className="titulo">Bienvenido al cotizador Detip</h3>

      {isLoading && (
        <div className="spinner-container">
          <img src={logo} alt="Cargando..." className="spinner" />
        </div>
      )}

      {olvido ? (
        <Olvido />
      ) : !requiresPasswordSetup ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              id="username"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username" className="form-label">
              Correo electrónico
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
          <div className="botoness">
            <button type="submit" className="quote-button">
              Ingresar
            </button>
            <a onClick={handleOlvido} className="login-olvido">
              ¿Olvidó su contraseña?
            </a>
          </div>
        </form>
      ) : (
        <Crear
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          handlePasswordSetup={handlePasswordSetup}
        />
      )}
    </div>
  );
}

export default Login;
