import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Agrega el token automáticamente antes de cada request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor de respuesta: detecta token expirado
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Borra el token y lanza evento personalizado
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("sesionExpirada"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
