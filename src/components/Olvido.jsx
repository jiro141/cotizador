import React, { useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import {
  getSecurityQuestionsByEmail,
  validateSecurityAnswers,
  updateOnlyPassword,
} from "../controller/api";
import logo from "../img/cropped-logo.png";
import toast, { Toaster } from "react-hot-toast";
export default function Olvido() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const [answers, setAnswers] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: "", name: "", tipoUser: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await getSecurityQuestionsByEmail(email);
      if (!data.questions || data.questions.length === 0) throw new Error();

      const selected = [];
      const selectedIds = [];

      while (selected.length < 2) {
        const i = Math.floor(Math.random() * data.questions.length);
        if (!selected.some((q) => q.question === data.questions[i].question)) {
          selected.push(data.questions[i]);
          selectedIds.push(data.seguridad[i]); // mantener los IDs que corresponden
        }
      }

      setQuestions(selected); // Muestra los textos
      setQuestionIds(selectedIds); // Guardamos los IDs para validación
      setUserInfo({ id: data.id, name: data.name, tipoUser: data.tipoUser });
      setStep(2);
    } catch {
      toast.error("Correo no encontrado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await validateSecurityAnswers(questionIds, answers);
      if (!isValid) {
        toast.error("Una o más respuestas son incorrectas.");
        return;
      }

      setStep(3); // Paso siguiente: formulario para nueva contraseña
    } catch (error) {
      toast.error("Error al verificar respuestas.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      await updateOnlyPassword(userInfo.id, newPassword);
      toast.success("Contraseña actualizada correctamente.");

      setStep(1);
      setEmail("");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      toast.error("Error al actualizar contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    window.location.reload();
  };

  const goBack = () => setStep((prev) => prev - 1);

  return (
    <div className="login-form-password">
      <Toaster />
      <h2>Recuperación de Contraseña</h2>

      <Stepper
        activeStep={step - 1}
        style={{
          marginBottom: "20px",
        }}
        connectorStyleConfig={{
          activeColor: "#e64a19",
          completedColor: "#70addf",
          disabledColor: "#bdbdbd",
          size: 2,
        }}
        styleConfig={{
          activeBgColor: "#e64a19",
          activeTextColor: "#fff",
          completedBgColor: "#70addf",
          completedTextColor: "#fff",
          inactiveBgColor: "#70addf",
          inactiveTextColor: "#fff",
          size: "2em",
          labelFontSize: "0.2rem",
          fontWeight: 500,
        }}
      >
        <Step label="Correo electrónico" />
        <Step label="Preguntas de seguridad" />
        <Step label="Nueva contraseña" />
      </Stepper>

      {isLoading && (
        <div className="spinner-container">
          <img src={logo} alt="Cargando..." className="spinner" />
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              id="username"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="form-label">Correo electrónico</label>
          </div>
          <div className="form-row">
            <div className="form-column2">
              <a className="login-olvido" onClick={goHome}>
                Volver
              </a>
            </div>
            <div className="form-column">
              <button type="submit" className="quote-button">
                Siguiente
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePasswordReset}>
          <div className="form-row">
            {questions.map((q, index) => (
              <div className="form-column" key={index}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={answers[index]}
                    placeholder=" "
                    onChange={(e) => handleAnswerChange(index, e)}
                    required
                  />
                  <label className="form-label">{q.question}</label>
                </div>
              </div>
            ))}
          </div>
          <div className="form-row">
            <div className="form-column2">
              <a className="login-olvido" onClick={goBack}>
                Volver
              </a>
            </div>
            <div className="form-column">
              <button type="submit" className="quote-button">
                Verificar respuestas
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordSubmit}>
          <h3>Hola, {userInfo.name}</h3>
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <input
                  type="password"
                  className="form-input"
                  placeholder=" "
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label className="form-label">Nueva contraseña</label>
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <input
                  type="password"
                  className="form-input"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label className="form-label">Confirmar contraseña</label>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-column2">
              <a className="login-olvido" onClick={goBack}>
                Volver
              </a>
            </div>
            <div className="form-column">
              <button type="submit" className="quote-button">
                Guardar contraseña
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
