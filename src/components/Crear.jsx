import React, { useState, useEffect } from "react";

const Crear = ({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  userId,
  securityQuestions,
  setSecurityQuestions,
  handlePasswordSetup
}) => {
  const questionsList = [
    [
      "¿Cuál es el nombre de tu primera mascota?",
      "¿En qué ciudad naciste?",
      "¿Cuál es el nombre de tu madre?",
      "¿En qué colegio estudiaste?",
      "¿Cuál es tu comida favorita?",
      "¿Cuál es tu película favorita?",
    ],
    [
      "¿Cuál es tu libro favorito?",
      "¿En qué país te gustaría vivir?",
      "¿Qué instrumento musical tocas?",
      "¿Cuál es tu estación favorita del año?",
      "¿Cuál es tu deporte favorito?",
      "¿Cuál es tu serie de televisión favorita?",
    ],
    [
      "¿Cuál es tu color favorito?",
      "¿Qué tipo de mascota tienes?",
      "¿Cuál es tu bebida favorita?",
      "¿Cuál es tu comida rápida preferida?",
      "¿Qué ciudad te gustaría visitar?",
      "¿Cuál es tu cantante favorito?",
    ],
    [
      "¿Tienes hermanos? ¿Cuántos?",
      "¿Cuál es tu deporte favorito?",
      "¿Quién fue tu maestro favorito?",
      "¿Qué vehículo te gustaría tener?",
      "¿En qué año comenzaste la universidad?",
      "¿Cuál es el nombre de tu mejor amigo?",
    ],
  ];

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...securityQuestions];
    updatedQuestions[index].question = event.target.value;
    setSecurityQuestions(updatedQuestions);
  };

  const handleAnswerChange = (index, event) => {
    const updatedQuestions = [...securityQuestions];
    updatedQuestions[index].answer = event.target.value;
    setSecurityQuestions(updatedQuestions);
  };

  // const handlePasswordSetup = (e) => {
  //   e.preventDefault();

  //   // Validamos que las contraseñas coincidan
  //   if (newPassword !== confirmPassword) {
  //     alert("Las contraseñas no coinciden");
  //     return;
  //   }

  //   // Aquí puedes manejar la lógica para actualizar la contraseña
  //   // Esto puede incluir llamar a una función para actualizar la contraseña y las preguntas de seguridad en el backend
  //   console.log("Configurando contraseña:", newPassword);
  //   console.log("Respuestas de seguridad:", securityQuestions);
  //   console.log("ID de usuario:", userId);

  //   // Aquí puedes enviar los datos al servidor, dependiendo de tu implementación.
  // };

  useEffect(() => {
    setNewPassword(newPassword); // Inicializamos el valor de la nueva contraseña desde los props
    setConfirmPassword(confirmPassword); // Inicializamos el valor de la confirmación de la contraseña desde los props
  }, [newPassword, confirmPassword, setNewPassword, setConfirmPassword]);
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
        <h2>Preguntas de Seguridad</h2>
        <div className="form-row">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="form-column">
              <div className="form-group">
                <select
                  id={`question-${index}`}
                  className="form-input"
                  value={securityQuestions[index].question}
                  onChange={(e) => handleQuestionChange(index, e)}
                >
                  <option value="">Selecciona una pregunta</option>
                  {questionsList[index].map((question, i) => (
                    <option key={i} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder=""
                  value={securityQuestions[index].answer}
                  onChange={(e) => handleAnswerChange(index, e)}
                />
                <label htmlFor={`answer-${index}`} className="form-label">
                  Respuesta
                </label>
              </div>
            </div>
          ))}
        </div>
        {/* Preguntas de Seguridad */}

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
