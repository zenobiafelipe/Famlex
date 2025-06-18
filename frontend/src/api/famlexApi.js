import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Registro
export const registrarUsuario = (email, password, nombre_completo, cedula_profesional) =>
  API.post("/register", { email, password, nombre_completo, cedula_profesional});

// Login
export const iniciarSesion = (email, password) =>
  API.post("/login", { email, password });
