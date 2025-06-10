// src/pages/Password.jsx
import { Form, Button } from "react-bootstrap";
import logo from "../assets/LogoTT-4edit.png";

function PasswordReset() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={logo} alt="FamLex Logo" style={{ width: "350px" }} />

      <h2 className="mt-3 fw-bold text-primary-custom" >
        Recuperar contraseña
      </h2>

      <p
        className="text-center"
        style={{
            maxWidth: "350px",
            color: "#0F4571",
            textAlign: "justify"
        }}
        >
        Escribe tu correo electrónico y te enviaremos los pasos para recuperar tu contraseña.
     </p>


      <Form style={{ width: "100%", maxWidth: "400px" }}>
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico*</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu correo" />
        </Form.Group>

        <Button
          className="w-100 mb-3"
          style={{ backgroundColor: "#0F4571", fontWeight: "bold" }}
        >
          Continuar
        </Button>

        <div className="text-center">
          <a href="/" className="fw-semibold text-primary-custom">
            Volver a la página principal
          </a>
        </div>
      </Form>
    </div>
  );
}

export default PasswordReset;
