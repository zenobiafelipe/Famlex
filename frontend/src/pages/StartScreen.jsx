// src/pages/StartScreen.jsx
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogoTT-4edit.png";
import iconEjemplo from "../assets/Message square.png";
import iconCapacidad from "../assets/Zap.png";
import iconLimitaciones from "../assets/Limitations.png";
import iconEnviar from "../assets/send.png";
import iconLogout from "../assets/logout.png";


export default function StartScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/chat"); // asegúrate que esta ruta exista en App.jsx
    }, 4000); // 4 segundos

    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-light p-3 d-flex flex-column justify-content-between" style={{ width: "300px" }}>
        <button className="btn btn-nuevo-chat">+ Nuevo chat</button>
        <div className="text-start">
          <img src={iconLogout} alt="Cerrar Sesión" width="20" className="me-2" />
          <a href="/login" className="text-decoration-none text-primary-custom">Cerrar Sesión</a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src={logo} alt="FamLex Logo" style={{ width: "300px" }} className="mb-4" />

        <div className="row w-100 justify-content-center">
          {/* Ejemplo */}
          <div className="col-10 col-md-3 mb-4">
            <img src={iconEjemplo} alt="Ejemplo" width="40" className="mb-2" />
            <h6>Ejemplo</h6>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div>Redacción de la solicitud inicial de divorcio y términos propuestos para el acuerdo entre las partes.</div>
            </div>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div className="mt-2">Redacción de una solicitud inicial para establecer la custodia.</div>
            </div>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div className="mt-2">Redacción de la solicitud de pensión alimenticia detallando la necesidad económica y los recursos del demandado.</div>
            </div>
          </div>

          {/* Capacidad */}
          <div className="col-10 col-md-3 mb-4">
            <img src={iconCapacidad} alt="Capacidad" width="40" className="mb-2" />
            <h6>Capacidad</h6>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div>Redacción de documentos legales para Divorcios incausados, administrativos y por mutuo consentimiento.</div>
              </div>
              <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div className="mt-2">Redacción de escritos sobre la Patria Potestad de menores conforme a la normativa de la CDMX.</div>
              </div>
              <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div className="mt-2">Elaboración de demandas por Pensión Alimenticia.</div>
            </div>
          </div>

          {/* Limitaciones */}
          <div className="col-10 col-md-3 mb-4">
            <img src={iconLimitaciones} alt="Limitaciones" width="40" className="mb-2" />
            <h6>Limitaciones</h6>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div>Solo redacta conforme a la normativa de la CDMX, no aplicable a otras jurisdicciones.</div>
            </div>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div className="mt-2">No reemplaza la representación legal en procesos complejos ni ante tribunales.</div>
            </div>
            <div className="bg-info-light rounded p-3 text-secondary small mb-2">
              <div className="mt-2">Recomendado para abogados con experiencia en la aplicación de los documentos.</div>
            </div>
          </div>
        </div>

        {/* Campo de mensaje */}
        <div className="mt-4 w-100 d-flex justify-content-center">
          <div className="d-flex border rounded-pill px-3 py-2" style={{ width: "60%", maxWidth: "600px" }}>
            <input
              className="form-control border-0 me-2"
              type="text"
              placeholder="Envía un mensaje a FAMLEX"
            />
            <button className="btn p-0 border-0 bg-transparent">
              <img src={iconEnviar} alt="Enviar" width="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
