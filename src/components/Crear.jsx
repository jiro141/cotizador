import React from "react";

const Crear = ({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  handlePasswordSetup,
}) => {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="login-form-password">
      <form className="password-setup-form" onSubmit={handlePasswordSetup}>
        <h2>Configurar Contraseña</h2>
        <div className="form-row">
          {/* Nueva Contraseña */}
          <div className="form-column">
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
          </div>
          {/* Confirmar Contraseña */}
          <div className="form-column">
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
          </div>
        </div>
        <div className="form-row">
          <div className="form-column2">
            <a onClick={reloadPage} className="login-olvido">
              Volver
            </a>
          </div>
          <div className="form-column">
            <button type="submit" className="quote-button">
              Guardar Contraseña
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Crear;
