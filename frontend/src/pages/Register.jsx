import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import logo from "../assets/LogoTT-4edit.png";
import { registrarUsuario } from "../api/famlexApi";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [requisitos, setRequisitos] = useState({
    longitud: false,
    mayuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  });

  useEffect(() => {
    setRequisitos({
      longitud: password.length >= 12,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /[0-9]/.test(password),
      especial: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const contrasenaSegura = Object.values(requisitos).every(Boolean);

    if (!correoValido) {
      setError("Formato de correo inválido");
      return;
    }
    if (!contrasenaSegura) {
      setError("La contraseña no cumple con los requisitos mínimos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas deben coincidir");
      return;
    }

    try {
      await registrarUsuario(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img src={logo} alt="FamLex Logo" style={{ width: "350px" }} />

      <h2 className="mt-3 fw-bold text-primary-custom">Crea Cuenta</h2>

      {error && <ErrorMessage mensaje={error} />}

      <Form onSubmit={handleRegister} style={{ width: "100%", maxWidth: "400px" }} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico*</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña*</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ul className="mt-2 mb-0 ps-3" style={{ fontSize: "0.9rem" }}>
            <li className={requisitos.longitud ? "text-primary-custom" : "text-muted"}>
              Al menos 12 caracteres
            </li>
            <li className={requisitos.mayuscula ? "text-primary-custom" : "text-muted"}>
              Una letra mayúscula
            </li>
            <li className={requisitos.minuscula ? "text-primary-custom" : "text-muted"}>
              Una letra minúscula
            </li>
            <li className={requisitos.numero ? "text-primary-custom" : "text-muted"}>
              Un número
            </li>
            <li className={requisitos.especial ? "text-primary-custom" : "text-muted"}>
              Un caracter especial (ej. @, #, !, %)
            </li>
          </ul>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirmar Contraseña*</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Row className="justify-content-between">
          <Col xs={6} className="pe-1">
            <Button className="w-100 btn-outline" type="submit">
              Aceptar
            </Button>
          </Col>
          <Col xs={6} className="ps-1">
            <Button className="w-100 btn-outline-light-blue" href="/">
              Cancelar
            </Button>
          </Col>
        </Row>

        <div className="text-center mt-3">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="fw-semibold text-primary-custom">
            Iniciar Sesión
          </a>
        </div>
      </Form>
    </div>
  );
}

export default Register;
