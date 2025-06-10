// src/pages/HistorialDocumentos.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import logo from "../assets/LogoTT-4edit.png";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function HistorialDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [docSeleccionado, setDocSeleccionado] = useState(null);

  const cargarDocumentos = async () => {
    try {
      const res = await axiosInstance.get("/documentos");
      setDocumentos(res.data);
    } catch (err) {
      console.error("Error al cargar historial", err);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const descargarDocumento = async (id, nombre) => {
    try {
      const res = await axiosInstance.get(`/descargar/${id}`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nombre);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error al descargar documento", err);
    }
  };

  const eliminarDocumento = async () => {
    try {
      await axiosInstance.delete(`/documentos/${docSeleccionado.id}`);
      setDocumentos(documentos.filter((d) => d.id !== docSeleccionado.id));
    } catch (err) {
      console.error("Error al eliminar documento", err);
    } finally {
      setMostrarModal(false);
      setDocSeleccionado(null);
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Sidebar */}
      <div className="bg-light d-flex flex-column justify-content-between p-3" style={{ width: "250px" }}>
        <div>
          <a href="/chat" className="btn btn-nuevo-chat w-100 mb-3">+ Nuevo chat</a>
          <a href="/historial" className="btn btn-outline-secondary w-100 mb-3">Historial</a>
        </div>
        <div>
          <a href="/login" className="text-decoration-none d-flex align-items-center text-primary-custom">
            <i className="bi bi-box-arrow-right me-2" />
            Cerrar Sesión
          </a>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4 d-flex flex-column align-items-center overflow-auto">
        <div className="text-center mb-4">
          <img src={logo} alt="FamLex" style={{ width: "200px" }} />
          <h2 className="text-primary-custom fw-bold mt-3">Historial de Documentos</h2>
        </div>

        {documentos.length === 0 ? (
          <p className="text-muted text-center">No hay documentos generados aún.</p>
        ) : (
          <table className="table table-bordered table-hover" style={{ maxWidth: "800px", width: "100%" }}>
            <thead>
              <tr>
                <th>Nombre del Documento</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.nombre}</td>
                  <td>{new Date(doc.fecha_creacion).toLocaleString()}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-nuevo-chat"
                      onClick={() => descargarDocumento(doc.id, doc.nombre)}
                    >
                      Descargar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                      onClick={() => {
                        setDocSeleccionado(doc);
                        setMostrarModal(true);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal de confirmación */}
        <ConfirmDeleteModal
          mostrar={mostrarModal}
          nombre={docSeleccionado?.nombre}
          onClose={() => setMostrarModal(false)}
          onConfirm={eliminarDocumento}
        />
      </div>
    </div>
  );
}
