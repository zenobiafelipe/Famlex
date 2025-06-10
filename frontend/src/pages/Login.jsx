import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { iniciarSesion } from "../api/famlexApi";
import logo from "../assets/LogoTT-4edit.png";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await iniciarSesion(email, password);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.detail || "Correo electrónico o contraseña incorrectos");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <img src={logo} alt="FamLex Logo" style={{ width: "300px" }} />

      <h2 className="mt-3 fw-bold text-primary-custom">
        Iniciar Sesión
      </h2>

      {error && <ErrorMessage mensaje={error} />}

      <Form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico*</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña*</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>

        <div className="text-end mb-3">
          <a href="/password-reset" className="fw-semibold text-primary-custom" >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button type="submit" className="w-100 btn-outline">
          Iniciar Sesión
        </Button>

        <div className="text-center mt-3">
          ¿No tienes una cuenta? <a href="/register" className="fw-semibold text-primary-custom" >Registrarse</a>
        </div>
      </Form>
    </div>
  );
}

export default Login;