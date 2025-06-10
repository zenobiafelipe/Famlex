// src/components/LegalDisclaimerModal.jsx
import React from "react";
import infoIcon from "../assets/Info.png"; // Ajusta la ruta si está en otra carpeta


export default function LegalDisclaimerModal({ visible, onClose }) {
  if (!visible) return null;

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
             Aviso Importante
          </h5>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Cerrar"
          />
        </div>
        <div
          className="text-primary-custom"
          style={{ lineHeight: "1.7", fontWeight: "500", textAlign: "justify" }}
        >
          El sistema <strong>FamLex</strong> está diseñado exclusivamente como una herramienta de apoyo para abogados y expertos en derecho.
          <br />
          No sustituye en ningún caso la asesoría, representación o juicio profesional que únicamente un abogado capacitado puede brindar.
          <br />
          <strong>FamLex</strong> proporciona documentos legales de ciertos casos en específico; sin embargo, el uso adecuado y la interpretación de los resultados son responsabilidad exclusiva del usuario experto.
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline rounded-pill px-4 fw-semibold"
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
