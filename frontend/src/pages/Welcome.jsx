// src/pages/Welcome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import logo from "../assets/LogoTT-3-LogoPrincipalAzulSF.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100">
      {/* Columna izquierda con nuevo fondo */}
      <div className="w-50 bg-custom-blue d-flex justify-content-center align-items-center">
        <img src={logo} alt="Logo FamLex" style={{ maxWidth: "90%", height: "auto" }} />
      </div>

      {/* Columna derecha con texto grande y botones estilizados */}
      <div className="w-50 bg-custom-blue d-flex flex-column justify-content-center align-items-center text-center p-4">
        <h1 className="mb-3 text-white text-large fw-bold">¡BIENVENIDO A FAMLEX!</h1>
        <p className="fs-4 text-white  mx-auto" style={{ maxWidth: "500px" }}>
          El sistema ideal para abogados que buscan optimizar su flujo de trabajo en redacción legal.
        </p>

        <div className="d-flex gap-3">
          <Button className="btn-outline-light-blue" onClick={() => navigate("/login")}>
            Iniciar sesión
          </Button>
          <Button className="btn-outline" onClick={() => navigate("/register")}>
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
}
