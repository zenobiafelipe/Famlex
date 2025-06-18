import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/LogoTT-4edit.png";
import iconLogout from "../assets/logout.png";
import iconSend from "../assets/send.png";
import iconDoc from "../assets/Icon.png";
import axiosInstance from "../api/axiosInstance";
import ErrorMessage from "../components/ErrorMessage"; // Asegúrate de tener esto
import LegalDisclaimerModal from "../components/LegalDisclaimerModal";
import SessionExpiredModal from "../components/SessionExpiredModal";
import AutocompleteInput from "../components/AutocompleteInput"; // al inicio del archivo
import TypingDots from "../components/TypingDots";

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
        <p className="mb-2 text-primary-custom fw-semibold">Bienvenido a FamLex! Ingresa el número del tipo de escrito inicial que deseas generar:</p>
        <ol className="mb-0 ps-3 text-primary-custom">
          {tipos.map((t, i) => (
            <li key={i}>{t.nombre}</li>
          ))}
        </ol>
      </div>
    )
  }
]);
  const [cargando, setCargando] = useState(false);
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
      { campo: "fecha_matrimonio", texto: "Fecha de celebración del matrimonio:" },
      { campo: "regimenadm", texto: "¿El matrimonio fue bajo sociedad conyugal? (Sí / No)", opciones: ["Sí", "No"] }
    ],

    divorcio_voluntario: [
      { campo: "promovente1", texto: "Nombre del promovente 1:" },
      { campo: "promovente2", texto: "Nombre del promovente 2:" },
      { campo: "direccion_promovente", texto: "Dirección para notificaciones " },
      { campo: "fecha_matrimonio", texto: "Fecha de celebración del matrimonio" },
      { campo: "desea_agregar_otros_abogados", texto: "¿Deseas agregar más abogados?", opciones: ["Sí", "No"] },
      { campo: "abogados", texto: "Nombres y cédulas de los abogados ", dependeDe: "desea_agregar_otros_abogados", valor: "Sí" },
      { campo: "regimen_matrimonial", texto: "¿Régimen patrimonial del matrimonio? (Sociedad conyugal / Separación de bienes)", opciones: ["Sociedad conyugal", "Separación de bienes"] },
      { campo: "bienes_comunes", texto: "¿Se adquirieron bienes durante el matrimonio? (Sí / No)", dependeDe: "regimen_matrimonial", valor: "Sociedad conyugal" },
      { campo: "total_bienes", texto: "¿Cuántos bienes se declararán?:", dependeDe: "bienes_comunes", valor: "Sí" },
      { campo: "lista_bienes", texto: "Lista de bienes (ej. casa:50:50; auto:70:30):", dependeDe: "bienes_comunes", valor: "Sí" },
      { campo: "tiene_hijos", texto: "¿Tienen hijos menores o incapaces? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "hijos_info", texto: "Nombres y edades de los hijos", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "quien_guarda", texto: "¿Quién solicita la guarda y custodia de los menores?", dependeDe: "tiene_hijos", valor: "Sí" },
      { campo: "direccion_hijos", texto: "Dirección donde vivirán los hijos:", dependeDe: "tiene_hijos", valor: "Sí" },
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
      { campo: "desea_agregar_otros_abogados", texto: "¿Deseas agregar más abogados?", opciones: ["Sí", "No"] },
      { campo: "abogados", texto: "Nombres y cédulas de los abogados ", dependeDe: "desea_agregar_otros_abogados", valor: "Sí" },
      { campo: "conoce_domicilio", texto: "¿Conoce el domicilio particular del demandado? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "direccion_demandado_si", texto: "Domicilio del demandado :", dependeDe: "conoce_domicilio", valor: "Sí"},
      { campo: "direccion_demandado_no", texto: "Domicilio donde puede ser notificado (ej. trabajo, negocio):", dependeDe: "conoce_domicilio", valor: "No"},
      { campo: "fecha_matrimonio", texto: "Fecha de celebración del matrimonio (ej: 03 de abril de 2008):" },
      { campo: "regimen_matrimonial", texto: "Régimen matrimonial (Sociedad conyugal / Separación de bienes):", opciones: ["Sociedad conyugal", "Separación de bienes"] },
      { campo: "bienes", texto: "¿Se adquirieron bienes durante el matrimonio? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "regimen", valor: "Sociedad conyugal" },
      { campo: "total_bienes", texto: "¿Cuántos bienes se declararán?:", dependeDe: "bienes_comunes", valor: "Sí" },
      { campo: "lista_bienes", texto: "Lista de bienes y porcentajes:", dependeDe: "bienes", valor: "Sí" },
      { campo: "proteccion", texto: "¿Desea solicitar orden de protección contra el demandado? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "direccion_ultimo", texto: "Último domicilio conyugal:" },
      { campo: "fecha_separacion", texto: "Fecha aproximada de separación (ej: marzo de 2023):" },
      { campo: "hijos", texto: "¿Procrearon hijos? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "hijos_info", texto: "Nombres y edades de los hijos:", dependeDe: "hijos", valor: "Sí" },
      { campo: "direccion_guarda", texto: "Dirección donde vivirán los hijos:", dependeDe: "hijos", valor: "Sí" },
      { campo: "incluir_guardia", texto: "¿Desea incluir guarda y custodia? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "hijos", valor: "Sí" },
      { campo: "guarda_titular", texto: "¿Quién tendrá la guarda y custodia de los menores?", dependeDe: "incluir_guardia", valor: "Sí" },
      { campo: "visitas_frecuencia", texto: "Frecuencia de convivencias (ej. 15 días):", dependeDe: "incluir_guardia", valor: "Sí" },
      { campo: "visitas_horario", texto: "Horario de convivencias (ej. 11:00 a 17:00 horas):", dependeDe: "incluir_guardia", valor: "Sí" },
      { campo: "incluir_alimentos", texto: "¿Desea incluir pensión alimenticia? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "hijos", valor: "Sí" },
      { campo: "porcentaje_alimentos", texto: "¿Cuál será el monto o porcentaje solicitado? (ej. 30):", dependeDe: "incluir_alimentos", valor: "Sí" }
    ],

    pension_alimenticia: [
      { campo: "promovente", texto: "Nombre del promovente:" },
      { campo: "parentesco", texto: "¿Qué relación tiene con los menores? (padre, madre, tutor)" },
      { campo: "hijos_info", texto: "Nombres y edades de los menores" },
      { campo: "direccion", texto: "Dirección del promovente" },
      { campo: "demandado", texto: "Nombre del demandado" },
      { campo: "desea_agregar_otros_abogados", texto: "¿Deseas agregar más abogados?", opciones: ["Sí", "No"] },
      { campo: "abogados", texto: "Nombres y cédulas de los abogados ", dependeDe: "desea_agregar_otros_abogados", valor: "Sí" }, 
      { campo: "ingresos", texto: "¿Cuál es el sueldo aproximado del demandado al mes?" },
      { campo: "incumplimiento", texto: "¿Ha incumplido con su obligación? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "retroactivos", texto: "¿Solicita pensión retroactiva? (Sí / No)", opciones: ["Sí", "No"] },
      { campo: "medidas", texto: "¿Solicita medidas precautorias? (Sí / No)", opciones: ["Sí", "No"] }
    ],

guarda_custodia: [
  { campo: "promovente", texto: "Nombre del promovente" },
  { campo: "parentesco", texto: "¿Qué relación tiene con los menores? (padre, madre, tutor)" },
  { campo: "menores", texto: "Nombres y edades de los menores" },
  { campo: "direccion_promovente", texto: "Dirección del promovente" },
  { campo: "demandado", texto: "Nombre del demandado" },
  { campo: "conoce_domicilio", texto: "¿Conoce el domicilio del demandado? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "direccion_demandado", texto: "Domicilio del demandado ", dependeDe: "conoce_domicilio", valor: "Sí" },
  { campo: "direccion_demandado_no", texto: "Domicilio donde puede ser notificado (ej. trabajo, negocio)", dependeDe: "conoce_domicilio", valor: "No" },
  { campo: "desea_agregar_otros_abogados", texto: "¿Deseas agregar más abogados?", opciones: ["Sí", "No"] },
  { campo: "abogados", texto: "Nombres y cédulas de los abogados", dependeDe: "desea_agregar_otros_abogados", valor: "Sí" }, 
  { campo: "tipo_relacion", texto: "¿Qué tipo de relación tuvo con el demandado? (ej. concubinato, matrimonio, noviazgo):" },
  { campo: "tiempo_convivencia", texto: "¿Durante cuánto tiempo convivieron? (ej. enero 2019 - abril 2023):" },
  { campo: "desea_visitas", texto: "¿Desea establecer régimen de convivencias? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "visitas", texto: "¿Qué régimen de visitas propone? (ej. fines de semana, vacaciones, etc.)", dependeDe: "desea_visitas", valor: "Sí" },
  { campo: "restricciones", texto: "¿Solicita restricciones en las visitas? (Sí / No)", opciones: ["Sí", "No"], dependeDe: "desea_visitas", valor: "Sí" },
  { campo: "motivo_guarda", texto: "Explique brevemente por qué solicita la guarda y custodia" }
],

reconocimiento_paternidad: [
  { campo: "promovente", texto: "Nombre del promovente:" },
  { campo: "menor", texto: "Nombre del menor:" },
  { campo: "edad_menor", texto: "Edad del menor:" },
  { campo: "fecha_nacimiento", texto: "Fecha de nacimiento del menor:" },
  { campo: "direccion", texto: "Dirección del promovente :" },
  { campo: "desea_agregar_otros_abogados", texto: "¿Deseas agregar más abogados?", opciones: ["Sí", "No"] },
  { campo: "abogados", texto: "Nombres y cédulas de los abogados (ej. Juan Pérez:1234567; María Ruiz:7654321):", dependeDe: "desea_agregar_otros_abogados", valor: "Sí" },
  { campo: "demandado", texto: "Nombre del presunto padre:" },
  { campo: "tipo_relacion", texto: "Tipo de relación que existió (noviazgo, concubinato, otro):" },
  { campo: "periodo_relacion", texto: "Periodo aproximado en que ocurrió la relación (ej. junio 2019 - marzo 2020):" },
  { campo: "motivo", texto: "¿Por qué considera que es el padre? (ej. aceptó verbalmente, vivieron juntos, etc.):" },
  { campo: "conoce_trabajo", texto: "¿Conoce el lugar de trabajo del demandado? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "trabajo", texto: "¿Dónde trabaja el demandado?", dependeDe: "conoce_trabajo", valor: "Sí" },
  { campo: "direccion_trabajo", texto: "Dirección del trabajo del demandado:", dependeDe: "conoce_trabajo", valor: "Sí" },
  { campo: "ingreso", texto: "Ingreso mensual aproximado del demandado:", dependeDe: "conoce_trabajo", valor: "Sí" },
  { campo: "direccion_demandado", texto: "¿Dónde vive actualmente el demandado?" },
  { campo: "solicita_pension", texto: "¿Desea solicitar pensión alimenticia? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "porcentaje", texto: "¿Qué porcentaje de los ingresos solicita como pensión?", dependeDe: "solicita_pension", valor: "Sí" },
  { campo: "fecha_incumplimiento", texto: "¿Desde cuándo no ha cumplido con la obligación alimentaria?", dependeDe: "solicita_pension", valor: "Sí" },
  { campo: "prueba_adn", texto: "¿Desea solicitar prueba de ADN? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "desea_testigos", texto: "¿Desea indicar testigos? (Sí / No)", opciones: ["Sí", "No"] },
  { campo: "testigos", texto: "Indique los nombres completos de los testigos (separados por coma):", dependeDe: "desea_testigos", valor: "Sí" }
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
    case "quien_guarda":
    case "uso_domicilio":
    case "guarda_titular":
    case "menor":
      if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(limpio)) return "El texto ingresado no debe contener números ni símbolos.";
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
/*MAYUSCULAS TODOS LOS NOMBRES QUE SE INGRESEN */
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };
/*CAMBIA si, SI, NO, no por los aceptados SÍ y No */
  const normalizarSiNo = (str) => {
  const limpio = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .trim()
      .toLowerCase();

    if (limpio === "si" || limpio === "sí") return "Sí";
    if (limpio === "no") return "No";
    return str; // si no es una de esas opciones, devuelve el original
  };
/*Normaliza Sociedad conyugal y separación de bienes*/
  const normalizarRegimen = (str) => {
  const limpio = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .toLowerCase()
      .trim();

    if (limpio === "sociedad conyugal") return "Sociedad conyugal";
    if (limpio === "separacion de bienes") return "Separación de bienes";
    return str;
  };

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
    // Fase de confirmación final
    if (fase === "confirmacion") {
    const respuesta = clean.toLowerCase();
    if (respuesta === "sí" || respuesta === "si") {
      setFase("finalizado");
      return enviarFormulario(respuestas);
    } else {
      setConversacion([
        ...conversacion,
        { de: "usuario", texto: mensaje },
        { de: "bot", texto: "Generación de documento cancelada. Puedes iniciar otra demanda si lo deseas." }
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
    valor = normalizarSiNo(valor);

  // Normaliza régimen matrimonial si corresponde
  if (preguntaActual.campo === "regimen_matrimonial") {
    valor = normalizarRegimen(valor);
  }
  // Aplica formato título si el campo es de nombre
  const camposNombre = ["promovente", "conyuge", "promovente1", "promovente2", "demandado", "menor", "quien_guarda", "uso_domicilio", "guarda_titular", "testigos"];
  if (camposNombre.includes(preguntaActual.campo)) {
    valor = toTitleCase(valor);
  }
  // Solo valida opciones si realmente existen
  if (Array.isArray(preguntaActual.opciones) && preguntaActual.opciones.length > 0) {
    const match = preguntaActual.opciones.find(opt => opt === valor);
    if (match) {
      setMensaje(match);
    } else {
      setConversacion([
        ...conversacion,
        { de: "usuario", texto: clean },
        { de: "bot", texto: `Respuesta inválida. Por favor responde con una de las siguientes opciones: ${preguntaActual.opciones.join(" / ")}` }
      ]);
      setMensaje("");
      return;
    }
  }

  //Validación ANTES de guardar y avanzar
  const errorValidacion = validarCampo(preguntaActual.campo, valor);
  console.log("Campo:", preguntaActual.campo, "Valor limpio:", clean, "Error:", errorValidacion);
  if (errorValidacion) {
    setError(errorValidacion);
    return;
  }
  setError("");

  // Mostrar texto formateado
  let nuevaConversacion = [
    ...conversacion,
    { de: "bot", texto: preguntaActual.texto }, // pregunta actual
    { de: "usuario", texto: valor }
  ];

  // Verifica si la siguiente pregunta será "desea_agregar_otros_abogados"
  const nuevasRespuestas = { ...respuestas, [preguntaActual.campo]: valor };
  const nuevasFiltradas = preguntas.filter(p => {
    if (!p.dependeDe) return true;
    return nuevasRespuestas[p.dependeDe] === p.valor;
  });

  const siguientePregunta = nuevasFiltradas[indice + 1];

  if (siguientePregunta?.campo === "desea_agregar_otros_abogados") {
    nuevaConversacion.push({
      de: "bot",
      texto: "Ya se ha agregado automáticamente tu nombre y cédula profesional como abogado promovente."
    });
  }
  // 🚀 Agregar AQUI los avisos según el campo:
  if (siguientePregunta?.campo === "abogados") {
    const aviso = "Debes escribir los abogados en el siguiente formato: Nombre:1234567; Nombre2:7654321";
    nuevaConversacion.push({ de: "bot", texto: aviso });
  }

  if (siguientePregunta?.campo === "hijos_info") {
    const aviso = "Debes escribir los hijos en el siguiente formato: Nombre:Edad; Nombre2:Edad";
    nuevaConversacion.push({ de: "bot", texto: aviso });
  }

  setRespuestas(nuevasRespuestas);
  setConversacion(nuevaConversacion);
  setMensaje("");

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
  setCargando(true);
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
    }  finally {
    setCargando(false);
  }
  };

  const obtenerResumen = async (datosManual = null) => {
  const datos = datosManual || respuestas;

  const formData = new FormData();
  for (let key in datos) {
    formData.append(key, datos[key] ?? "");
  }
  setCargando(true); // justo antes de llamar al backend
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
    ]);

    setFase("finalizado");
    await enviarFormulario(datos);
  } catch (err) {
    setError("Error al obtener el resumen del documento.");
  } finally {
  setCargando(false); // ocultar animación
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

  const [sesionExpirada, setSesionExpirada] = useState(false);
  useEffect(() => {
    const handleExpiracion = () => {
      setSesionExpirada(true);
    };
    window.addEventListener("sesionExpirada", handleExpiracion);
    return () => {
      window.removeEventListener("sesionExpirada", handleExpiracion);
    };
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
      <div className="flex-grow-1 overflow-y-auto w-100 mb-3" style={{ maxHeight: "65vh", maxWidth: "800px" }}>
        {conversacion.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 d-flex ${msg.de === "usuario" ? "justify-content-end" : "justify-content-start"}`}
          >
            {msg.de === "bot" ? (
              <div className="d-flex align-items-start">
                <img src={iconDoc} alt="bot" width={40} className="me-2" />
                {/* Burbujas de bot */}
                <div className="bg-white text-primary-custom p-3 rounded shadow-sm border chat-bubble">
                  {msg.texto === "Ya se ha agregado automáticamente tu nombre y cédula profesional como abogado promovente." ? (
                    <em style={{ fontWeight: "bold", color: "#0F4571" }}>{msg.texto}</em>
                  ) : (
                    msg.texto
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-lightblue p-3 rounded shadow-sm text-dark chat-bubble" >
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
              <div className="bg-white text-primary-custom p-3 rounded shadow-sm border chat-bubble">
                {preguntaActual.texto}
              </div>
            </div>
          </div>
        )}
         {/* Animación de carga */}
        {cargando && (
          <div className="mb-3 d-flex justify-content-start">
            <div className="d-flex align-items-start">
              <img src={iconDoc} alt="bot" width={40} className="me-2" />
              <div className="bg-white text-primary-custom p-3 rounded shadow-sm border chat-bubble">
                <TypingDots />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Formulario de respuesta */}
      <form onSubmit={handleSubmit} className="w-100 d-flex justify-content-center mt-2">
        <div className="d-flex align-items-center border rounded-pill px-3 py-2 shadow-sm" style={{ maxWidth: "700px", width: "100%", backgroundColor: "#fff"  }}>
          {preguntaActual?.campo?.includes("fecha") ? (
            <input
              className="form-control border-0 me-2"
              type="date"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />
          ) : preguntaActual?.campo?.includes("direccion") ? (
            <AutocompleteInput
              value={mensaje}
              onChange={(val) => setMensaje(val)}
              placeholder="Escribe la dirección completa"
            />
          ) : (
          <input
            className="form-control border-0 me-2"
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu respuesta"
            required
          />)}
          <button type="submit" className="btn p-0 border-0 bg-transparent">
            <img src={iconSend} alt="Enviar" width="20" />
          </button>
        </div>
      </form>
    </div>
    <LegalDisclaimerModal visible={mostrarAviso} onClose={cerrarAviso} />
    <SessionExpiredModal visible={sesionExpirada} />
  </div>
  
);

}