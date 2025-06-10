import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/LogoTT-4edit.png";
import iconLogout from "../assets/logout.png";
import iconSend from "../assets/send.png";
import iconDoc from "../assets/Icon.png";
import axiosInstance from "../api/axiosInstance";
import ErrorMessage from "../components/ErrorMessage"; // Asegúrate de tener esto
import LegalDisclaimerModal from "../components/LegalDisclaimerModal";

const tipos = [
  { nombre: "Divorcio Administrativo", valor: "divorcio_admin" },
  { nombre: "Divorcio Voluntario", valor: "divorcio_voluntario" },
  { nombre: "Divorcio Incausado", valor: "divorcio_incausado" },
  { nombre: "Pensión Alimenticia", valor: "pension_alimenticia" },
  { nombre: "Guarda y Custodia", valor: "guarda_custodia" },
  { nombre: "Reconocimiento de Paternidad", valor: "reconocimiento_paternidad" }
];

export default function ChatScreen() {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  useEffect(() => {
    const yaMostrado = sessionStorage.getItem("avisoLegalMostrado");
    if (!yaMostrado) {
      setMostrarAviso(true);
    }
  }, []);

  const cerrarAviso = () => {
    setMostrarAviso(false);
    sessionStorage.setItem("avisoLegalMostrado", "true");
  };

  const [fase, setFase] = useState("inicio");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [conversacion, setConversacion] = useState([
  {
    de: "bot",
    texto: (
      <div>
        <p className="mb-2 text-primary-custom fw-semibold">Bienvenido a FamLex! Elige el tipo de demanda legal que deseas generar:</p>
        <ol className="mb-0 ps-3 text-primary-custom">
          {tipos.map((t, i) => (
            <li key={i}>{t.nombre}</li>
          ))}
        </ol>
      </div>
    )
  }
]);
  
  const [mensaje, setMensaje] = useState("");
  const [indice, setIndice] = useState(0);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversacion]);

  const arboles = {
    divorcio_admin: [
      { campo: "promovente", texto: "Nombre del promovente:" },
      { campo: "conyuge", texto: "Nombre del cónyuge:" },
      { campo: "direccion", texto: "Dirección del promovente:" },
      { campo: "fecha_matrimonio", texto: "Fecha de celebración del matrimonio (ej: 15 de mayo de 2025):" },
      { campo: "regimenadm", texto: "¿El matrimonio fue bajo sociedad conyugal? (Sí / No)", opciones: ["Sí", "No"] }
    ],

    divorcio_voluntario: [
      { campo: "promovente1", texto: "Nombre del promovente 1:" },
      { campo: "promovente2", texto: "Nombre del promovente 2:" },
      { campo: "direccion_promovente", texto: "Dirección para notificaciones :" },
      { campo: "fecha_matrimonio", texto: "Fecha de celebración del matrimonio:" },
      { campo: "cuantos_abogados", texto: "¿Cuántos abogados deseas registrar?" },
      { campo: "abogados", texto: "Nombres y cédulas de los abogados (ej. Juan Pérez:1234567; María Ruiz:7654321):" },
      { campo: "regimen_matrimonial", texto: "¿Régimen patrimonial del matrimonio? (Sociedad conyugal / Separación de bienes)", opciones: ["Sociedad conyugal", "Separación de bienes"] },
      { campo: "bienes_comunes", texto: "¿Se adquirieron bienes durante el matrimonio? (Sí / No)", dependeDe: "regimen_matrimonial", valor: "Sociedad conyugal" },
      { campo: "total_bienes", texto: "¿Cuántos bienes se declararán?:", dependeDe: "bienes_comunes", valor: "Sí" },
      { campo: "lista_bienes", texto: "Lista de bienes (ej. casa:50:50; auto:70:30):", dependeDe: "bienes_comunes", valor: "Sí" },
      { campo: "tiene_hijos", texto: "¿Tienen hijos menores o incapaces? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "hijos_info", texto: "Nombres y edades de los hijos (ej. Pedro:5; Ana:7):", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "quien_guarda", texto: "¿Quién solicita la guarda y custodia de los menores?", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "domicilio_hijos", texto: "Dirección donde vivirán los hijos:", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "frecuencia_visitas", texto: "¿Cada cuánto serán las convivencias del otro progenitor? (ej. cada 15 días):", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "horario_visitas", texto: "¿Horario de visitas? (ej. 10:00 a 18:00):", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "porcentaje_alimentos", texto: "¿Qué porcentaje del ingreso se otorgará como pensión alimenticia?:", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "uso_domicilio", texto: "¿Quién usará el domicilio conyugal?:", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "manutencion_conyuge", texto: "¿Alguno de los cónyuges solicitará manutención? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "conyuge_manutencion", texto: "¿Quién recibirá la manutención?:", dependeDe: "manutencion_conyuge", valor: "Sí" },
      { campo: "monto_manutencion", texto: "¿Cuál será el monto o porcentaje solicitado? (ej. 30):", dependeDe: "manutencion_conyuge", valor: "Sí" }

    ],


    divorcio_incausado: [
      { campo: "promovente", texto: "Nombre del promovente:" },
      { campo: "demandado", texto: "Nombre del demandado:" },
      { campo: "direccion_promovente", texto: "Dirección del promovente:" },
      { campo: "cuantos_abogados", texto: "¿Cuántos abogados deseas registrar?" },
      { campo: "abogados", texto: "Nombres y cédulas de los abogados (ej. Juan Pérez:1234567; María Ruiz:7654321):" },
      { campo: "conoce_domicilio", texto: "¿Conoce el domicilio particular del demandado? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "domicilio_demandado_si", texto: "Domicilio del demandado :", dependeDe: "conoce_domicilio", valor: "Sí"},
      { campo: "domicilio_demandado_no", texto: "Domicilio donde puede ser notificado (ej. trabajo, negocio):", dependeDe: "conoce_domicilio", valor: "No"},
      { campo: "fecha_matrimonio", texto: "Fecha de celebración del matrimonio (ej: 03 de abril de 2008):" },
      { campo: "regimen", texto: "Régimen matrimonial (Sociedad conyugal / Separación de bienes):", opciones: ["Sociedad conyugal", "Separación de bienes"] },
      { campo: "bienes", texto: "¿Se adquirieron bienes durante el matrimonio? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "regimen", valor: "Sociedad conyugal" },
      { campo: "total_bienes", texto: "¿Cuántos bienes se declararán?:", dependeDe: "bienes_comunes", valor: "Sí" },
      { campo: "lista_bienes", texto: "Lista de bienes y porcentajes:", dependeDe: "bienes", valor: "Sí" },
      { campo: "proteccion", texto: "¿Desea solicitar orden de protección contra el demandado? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "ultimo_domicilio", texto: "Último domicilio conyugal:" },
      { campo: "fecha_separacion", texto: "Fecha aproximada de separación (ej: marzo de 2023):" },
      { campo: "hijos", texto: "¿Procrearon hijos? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "hijos_info", texto: "Nombres y edades de los hijos:", dependeDe: "hijos", valor: "Sí" },
      { campo: "guarda_domicilio", texto: "Dirección donde vivirán los hijos:", dependeDe: "hijos", valor: "Sí" },
      { campo: "incluir_guardia", texto: "¿Desea incluir guarda y custodia? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "hijos", valor: "Sí" },
      { campo: "guarda_titular", texto: "¿Quién tendrá la guarda y custodia de los menores?", dependeDe: "incluir_guardia", valor: "Sí" },
      { campo: "visitas_frecuencia", texto: "Frecuencia de convivencias (ej. 15 días):", dependeDe: "incluir_guardia", valor: "Sí" },
      { campo: "visitas_horario", texto: "Horario de convivencias (ej. 11:00 a 17:00 horas):", dependeDe: "incluir_guardia", valor: "Sí" },
      { campo: "incluir_alimentos", texto: "¿Desea incluir pensión alimenticia? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "hijos", valor: "Sí" },
      { campo: "porcentaje_alimentos", texto: "¿Cuál será el monto o porcentaje solicitado? (ej. 30):", dependeDe: "incluir_alimentos", valor: "Sí" }
    ],

    pension_alimenticia: [
      { campo: "promovente", texto: "Nombre del promovente:" },
      { campo: "parentesco", texto: "¿Qué relación tiene con los menores? (padre, madre, tutor):" },
      { campo: "menores", texto: "Nombres y edades de los menores:" },
      { campo: "direccion", texto: "Dirección del promovente:" },
      { campo: "demandado", texto: "Nombre del demandado:" },
      { campo: "ingresos", texto: "¿Cuál es el sueldo aproximado del demandado al mes?:" },
      { campo: "cuantos_abogados", texto: "¿Cuántos abogados deseas registrar?" },
      { campo: "abogados", texto: "Nombres y cédulas de los abogados:" },
      { campo: "incumplimiento", texto: "¿Ha incumplido con su obligación? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "retroactivos", texto: "¿Solicita pensión retroactiva? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "medidas", texto: "¿Solicita medidas precautorias? (Sí / No)", opciones: ["Sí", "No"] }
    ],

guarda_custodia: [
  { campo: "promovente", texto: "Nombre del promovente:" },
  { campo: "parentesco", texto: "¿Qué relación tiene con los menores? (padre, madre, tutor):" },
  { campo: "menores", texto: "Nombres y edades de los menores:" },
  { campo: "direccion_promovente", texto: "Dirección del promovente:" },
  { campo: "demandado", texto: "Nombre del demandado:" },
  { campo: "conoce_domicilio", texto: "¿Conoce el domicilio del demandado? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "domicilio_demandado", texto: "Domicilio del demandado :", dependeDe: "conoce_domicilio", valor: "Sí" },
  { campo: "domicilio_demandado_no", texto: "Domicilio donde puede ser notificado (ej. trabajo, negocio):", dependeDe: "conoce_domicilio", valor: "No" },
  { campo: "cuantos_abogados", texto: "¿Cuántos abogados deseas registrar?" },
  { campo: "abogados", texto: "Nombres y cédulas de los abogados:" },  
  { campo: "tipo_relacion", texto: "¿Qué tipo de relación tuvo con el demandado? (ej. concubinato, matrimonio, noviazgo):" },
  { campo: "tiempo_convivencia", texto: "¿Durante cuánto tiempo convivieron? (ej. enero 2019 - abril 2023):" },
  { campo: "desea_visitas", texto: "¿Desea establecer régimen de convivencias? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "visitas", texto: "¿Qué régimen de visitas propone? (ej. fines de semana, vacaciones, etc.):", dependeDe: "desea_visitas", valor: "Sí" },
  { campo: "restricciones", texto: "¿Solicita restricciones en las visitas? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "desea_visitas", valor: "Sí" },
  { campo: "motivo_guarda", texto: "Explique brevemente por qué solicita la guarda y custodia:" }
],

reconocimiento_paternidad: [
  { campo: "promovente", texto: "Nombre del promovente:" },
  { campo: "menor", texto: "Nombre del menor:" },
  { campo: "edad_menor", texto: "Edad del menor:" },
  { campo: "fecha_nacimiento", texto: "Fecha de nacimiento del menor:" },
  { campo: "direccion", texto: "Dirección del promovente :" },
  { campo: "demandado", texto: "Nombre del presunto padre:" },
  { campo: "tipo_relacion", texto: "Tipo de relación que existió (noviazgo, concubinato, otro):" },
  { campo: "periodo_relacion", texto: "Periodo aproximado en que ocurrió la relación (ej. junio 2019 - marzo 2020):" },
  { campo: "motivo", texto: "¿Por qué considera que es el padre? (ej. aceptó verbalmente, vivieron juntos, etc.):" },
  { campo: "conoce_trabajo", texto: "¿Conoce el lugar de trabajo del demandado? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "trabajo", texto: "¿Dónde trabaja el demandado?", dependeDe: "conoce_trabajo", valor: "Sí" },
  { campo: "direccion_trabajo", texto: "Dirección del trabajo del demandado:", dependeDe: "conoce_trabajo", valor: "Sí" },
  { campo: "ingreso", texto: "Ingreso mensual aproximado del demandado:", dependeDe: "conoce_trabajo", valor: "Sí" },
  { campo: "domicilio", texto: "¿Dónde vive actualmente el demandado?" },
  { campo: "solicita_pension", texto: "¿Desea solicitar pensión alimenticia? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "porcentaje", texto: "¿Qué porcentaje de los ingresos solicita como pensión?", dependeDe: "solicita_pension", valor: "Sí" },
  { campo: "incumplimiento", texto: "¿Desde cuándo no ha cumplido con la obligación alimentaria?", dependeDe: "solicita_pension", valor: "Sí" },
  { campo: "prueba_adn", texto: "¿Desea solicitar prueba de ADN? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "testigos", texto: "¿Desea indicar testigos? (escriba nombres separados por coma, o deje vacío si no aplica)" }
]

  };

  const validarCampo = (campo, valor) => {
  const limpio = valor.trim();
  if (!limpio) return "Este campo es obligatorio.";

  switch (campo) {
    case "promovente":
    case "conyuge":
    case "promovente1":
    case "promovente2":
    case "demandado":
    case "ciudad":  
      if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(limpio)) return "El texto ingresado no debe contener números ni símbolos.";
      break;

    case "direccion":
    case "direccion_promovente":
    case "domicilio_hijos":
    case "domicilio_demandado_si" :
    case "domicilio_demandado_no" :
    case "domicilio_demandado":
    case "ultimo_domicilio":
    case "domicilio_menor":  
      if (!/^.+?,\s*\d+,\s*.+?,\s*\d{5},\s*.+$/.test(limpio)) return "Formato de dirección inválido (Calle, No., Colonia, CP, Ciudad).";
      break;

    case "fecha":
    case "fecha_actual":
    case "fecha_matrimonio":
    case "fecha_nacimiento":
      if (!/^\d{1,2}\s+de\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s+de\s+\d{4}$/.test(limpio)) return "Formato de fecha inválido (ej: 25 de mayo de 2025).";
      break;
    case "regimenadm" :
    case "bienes_comunes" :
    case "tiene_hijos" :
    case "incumplimiento" :
    case "manutencion_conyuge" :
    case "conoce_domicilio" :
    case "hijos" :
    case "incluir_guardia":
    case "incluir_alimentos":
    case "retroactivos":
    case "medidas":
    case "bienes":
    case "proteccion":
    case "conoce_trabajo":
      if (limpio !== "Sí" && limpio !== "No")
    return "Por favor escribe exactamente 'Sí' o 'No' (con mayúscula y tilde).";
  break;
  case "regimen":
    if (!["sociedad conyugal", "separación de bienes"].includes(limpio.toLowerCase()))
      return "Debes responder con 'Sociedad Conyugal' o 'Separación de Bienes'.";
    break;

    case "porcentaje_alimentos":
    case "monto_manutencion":
      if (!/^([1-9][0-9]?|100)(%)?$/.test(limpio)) return "Ingresa un porcentaje válido entre 1% y 100%.";
      break;

    case "edad_menor":
      if (!/^([0-9]|1[0-7])$/.test(limpio)) return "Ingresa una edad válida (0 a 17 años).";
      break;

    case "abogados":
      const entradas = limpio.split(";");
      for (const entrada of entradas) {
        if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+:\d{7}$/.test(entrada.trim())) {
          return "Cada abogado debe tener formato: Nombre:1234567; separados por punto y coma.";
        }
      }
      break;

    case "lista_bienes":
      const bienes = limpio.split(";");
      for (const bien of bienes) {
        if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+:\d{1,3}:\d{1,3}$/.test(bien.trim())) {
          return "Cada bien debe seguir el formato: Casa:50:50, separados por punto y coma.";
        }
      }
      break;
    case "hijos_info":
      const hijos = limpio.split(";");
      for (const hijo of hijos) {
        if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+:\d+$/.test(hijo.trim())) {
          return "Cada hijo debe tener el formato: Nombre:Edad (ej. Pedro:5; Ana:7)";
        }
      }
      break;

    default:
      break;
  }

  return "";
};

  const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const debeMostrarPregunta = (pregunta) => {
    if (!pregunta.dependeDe) return true;
    const valorPadre = respuestas[pregunta.dependeDe] || "";
    return valorPadre === pregunta.valor;
  };


  const preguntas = tipoSeleccionado ? arboles[tipoSeleccionado] : [];

  const preguntasFiltradas = preguntas.filter(p => {
    if (!p.dependeDe) return true;
    return respuestas[p.dependeDe] === p.valor;
  });

  const preguntaActual = preguntasFiltradas[indice] || null;


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!mensaje) return;
  const clean = mensaje.trim().replace(".", "");

  // Fase inicial: selección de tipo de demanda
  if (fase === "inicio") {
    const opcion = parseInt(clean);
    if (!opcion || opcion < 1 || opcion > tipos.length) return;
    const tipo = tipos[opcion - 1];
    setTipoSeleccionado(tipo.valor);
    setFase("preguntas");
    setConversacion([
      ...conversacion,
      { de: "usuario", texto: mensaje },
      { de: "bot", texto: "Tipo de demanda seleccionado: " + tipo.nombre }
    ]);
    setMensaje("");
    return;
  }

  if (fase === "confirmacion") {
  const respuesta = clean.toLowerCase();
  if (respuesta === "sí" || respuesta === "si") {
    setFase("finalizado");
    return enviarFormulario(respuestas);
  } else {
    setConversacion([
      ...conversacion,
      { de: "usuario", texto: mensaje },
      { de: "bot", texto: "❌ Generación de documento cancelada. Puedes iniciar otra demanda si lo deseas." }
    ]);
    setFase("inicio");
    setMensaje("");
    return;
  }
}


    // Procesar respuestas a preguntas
    const preguntas = tipoSeleccionado ? arboles[tipoSeleccionado] : [];
    const preguntasFiltradas = preguntas.filter(p => {
      if (!p.dependeDe) return true;
      return respuestas[p.dependeDe] === p.valor;
    });
    const preguntaActual = preguntasFiltradas[indice];

    let valor = clean;

  // ✅ Solo valida opciones si realmente existen
  if (Array.isArray(preguntaActual.opciones) && preguntaActual.opciones.length > 0) {
    const match = preguntaActual.opciones.find(opt => opt === clean);
    if (match) {
      valor = match;
      setMensaje(match);
    } else {
      setConversacion([
        ...conversacion,
        { de: "usuario", texto: clean },
        { de: "bot", texto: `❌ Respuesta inválida. Por favor responde con una de las siguientes opciones: ${preguntaActual.opciones.join(" / ")}` }
      ]);
      setMensaje("");
      return;
    }
  }

  // ✅ Validación ANTES de guardar y avanzar
  const errorValidacion = validarCampo(preguntaActual.campo, clean);
  console.log("Campo:", preguntaActual.campo, "Valor limpio:", clean, "Error:", errorValidacion);
  if (errorValidacion) {
    setError(errorValidacion);
    return;
  }
  setError("");

  const nuevaConversacion = [
    ...conversacion,
    { de: "bot", texto: preguntaActual.texto },
    { de: "usuario", texto: mensaje }
  ];

  const nuevasRespuestas = { ...respuestas, [preguntaActual.campo]: valor };
  setRespuestas(nuevasRespuestas);
  setConversacion(nuevaConversacion);
  setMensaje("");

  // ✅ Generar documento si es la última pregunta
  const nuevasFiltradas = preguntas.filter(p => {
    if (!p.dependeDe) return true;
    return nuevasRespuestas[p.dependeDe] === p.valor;
  });

  if (indice + 1 >= nuevasFiltradas.length) {
    setFase("resumen");
    return obtenerResumen(nuevasRespuestas);
  }

  setIndice(indice + 1);
};

const enviarFormulario = async (datosManual = null) => {
  const datos = datosManual || respuestas; // usa las nuevas respuestas si las mandas

  const formData = new FormData();
  for (let key in datos) {
    const valor = datos[key] ?? "";
    formData.append(key, valor);
  }

  console.log("Tipo de documento:", tipoSeleccionado);
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  try {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      `/generar/${tipoSeleccionado}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        responseType: "blob"
      }
    );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tipoSeleccionado}.docx`);
      document.body.appendChild(link);
      link.click();
      setFase("inicio");
      setRespuestas({});
      setIndice(0);
    } catch (err) {
      setError("Ocurrió un error al generar el documento.");
    }
  };

  const obtenerResumen = async (datosManual = null) => {
  const datos = datosManual || respuestas;

  const formData = new FormData();
  for (let key in datos) {
    formData.append(key, datos[key] ?? "");
  }

  try {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      `/resumen/${tipoSeleccionado}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const resumenTexto = res.data.resumen;


    setConversacion([
      ...conversacion,
      { de: "bot", texto: "Aquí está un resumen del contenido legal del documento:" },
      { de: "bot", texto: resumenTexto },
      { de: "bot", texto: "Generando el documento automáticamente..."}
    ]);

    setFase("finalizado");
    await enviarFormulario(datos);
  } catch (err) {
    setError("Error al obtener el resumen del documento.");
  }
};

  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const res = await axiosInstance.get("/documentos");
        setDocumentos(res.data);
      } catch (err) {
        console.error("Error al cargar historial de documentos", err);
      }
    };
    cargarHistorial();
  }, []);

  return (
  <div className="d-flex" style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
    {/* Sidebar */}
    <div className="bg-light d-flex flex-column justify-content-between p-3" style={{ width: "250px" }}>
      <div>
        <button className="btn btn-nuevo-chat w-100 mb-3" onClick={() => window.location.reload()}>
          + Nuevo chat
        </button>
          
        <a href="/historial" className="btn btn-outline-secondary w-100 mb-3">
          Historial
        </a>

      </div>

      {/* Logout */}
      <div>
        <a href="/login" className="text-decoration-none d-flex align-items-center text-primary-custom">
          <img src={iconLogout} alt="Cerrar sesión" className="me-2" style={{ width: "20px", height: "20px" }} />
          Cerrar Sesión
        </a>
      </div>
    </div>

    {/* Main chat area */}
    <div className="d-flex flex-column justify-content-between align-items-center flex-grow-1 px-4 py-3">
      <div className="text-center mb-4">
        <img src={logo} alt="FamLex" style={{ width: "200px" }} />
        <h5 className="text-primary-custom fw-bold mt-2">Generador de Demanda Legal</h5>
        <ErrorMessage mensaje={error} />
      </div>

      {/* Conversación */}
      <div className="flex-grow-1 overflow-auto w-100 mb-4" style={{ maxWidth: "800px" }}>
        {conversacion.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 d-flex ${msg.de === "usuario" ? "justify-content-end" : "justify-content-start"}`}
          >
            {msg.de === "bot" ? (
              <div className="d-flex align-items-start">
                <img src={iconDoc} alt="bot" width={40} className="me-2" />
                <div className="bg-white text-primary-custom p-3 rounded shadow-sm border" style={{ maxWidth: "70%" }}>
                  {msg.texto}
                </div>
              </div>
            ) : (
              <div className="bg-lightblue p-3 rounded shadow-sm text-dark" style={{ maxWidth: "70%" }}>
                {msg.texto}
              </div>
            )}
          </div>
        ))}

        {/* Pregunta actual */}
        {fase === "preguntas" && preguntaActual && (
          <div className="mb-3 d-flex justify-content-start">
            <div className="d-flex align-items-start">
              <img src={iconDoc} alt="bot" width={40} className="me-2" />
              <div className="bg-white text-primary-custom p-3 rounded shadow-sm border" style={{ maxWidth: "70%" }}>
                {preguntaActual.texto}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Formulario de respuesta */}
      <form onSubmit={handleSubmit} className="w-100 d-flex justify-content-center">
        <div className="d-flex border rounded-pill px-3 py-2 w-100" style={{ maxWidth: "800px" }}>
          <input
            className="form-control border-0 me-2"
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu respuesta"
            required
          />
          <button type="submit" className="btn p-0 border-0 bg-transparent">
            <img src={iconSend} alt="Enviar" width="20" />
          </button>
        </div>
      </form>
    </div>
    <LegalDisclaimerModal visible={mostrarAviso} onClose={cerrarAviso} />

  </div>
  
);

}