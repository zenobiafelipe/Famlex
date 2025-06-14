// src/components/SessionExpiredModal.jsx
import React from "react";
import infoIcon from "../assets/Info.png"; // Usa el mismo ícono

export default function SessionExpiredModal({ visible }) {
  if (!visible) return null;

  const manejarRedireccion = () => {
    localStorage.removeItem("token"); // Elimina el token
    window.location.href = "/login";  // Redirige manualmente
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
        backdropFilter: "blur(2px)"
      }}
    >
      <div
        className="bg-white p-4 shadow rounded-4"
        style={{
          width: "90%",
          maxWidth: "600px",
          border: "1px solid #ccc",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-primary-custom fw-bold m-0">
            <img src={infoIcon} alt="info" className="me-2" style={{ width: "20px", height: "20px" }} />
            Sesión expirada
          </h5>
        </div>
        <div
          className="text-primary-custom"
          style={{ lineHeight: "1.7", fontWeight: "500", textAlign: "justify" }}
        >
          Tu sesión ha expirado por seguridad.
          <br />
          Para continuar usando <strong>FamLex</strong>, inicia sesión nuevamente.
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline rounded-pill px-4 fw-semibold"
            onClick={manejarRedireccion}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
