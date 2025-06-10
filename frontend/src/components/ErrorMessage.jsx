// src/components/ErrorMessage.jsx
import React from "react";
import alertIcon from "../assets/Alert circle.png"; // Ruta a tu ícono

function ErrorMessage({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div
      className="d-flex align-items-center gap-2 p-2 rounded"
      style={{
        backgroundColor: "#FCE4E4",
        color: "#C62828",
        border: "1px solid #C62828",
        fontWeight: "bold",
        fontSize: "0.95rem",
        marginBottom: "1rem",
      }}
    >
      <img src={alertIcon} alt="Error" style={{ width: "20px", height: "20px" }} />
      {mensaje}
    </div>
  );
}

export default ErrorMessage;
