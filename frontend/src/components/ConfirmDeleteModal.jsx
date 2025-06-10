// src/components/ConfirmDeleteModal.jsx
import React from "react";

export default function ConfirmDeleteModal({ mostrar, onClose, onConfirm, nombre }) {
  if (!mostrar) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Confirmar Eliminación</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              ¿Estás seguro de que deseas eliminar el documento <strong>{nombre}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
