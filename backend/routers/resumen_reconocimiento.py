# resumen_reconocimiento.py
from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import obtener_usuario_actual
import requests

router = APIRouter()

@router.post("/resumen/reconocimiento_paternidad")
async def resumen_reconocimiento_paternidad(
    promovente: str = Form(...),
    menor: str = Form(...),
    edad_menor: str = Form(...),
    fecha_nacimiento: str = Form(...),
    demandado: str = Form(...),
    tipo_relacion: str = Form(...),
    periodo_relacion: str = Form(...),
    motivo: str = Form(...),
    conoce_trabajo: str = Form(...),
    trabajo: str = Form(None),
    direccion_trabajo: str = Form(None),
    ingreso: str = Form(None),
    direccion_demandado: str = Form(...),
    solicita_pension: str = Form(...),
    porcentaje: str = Form(None),
    fecha_incumplimiento: str = Form(None),
    prueba_adn: str = Form(...),
    desea_testigos: str = Form(...),
    testigos: str = Form(None),
    desea_agregar_otros_abogados: str = Form(...),
    abogados: str = Form(None),
    usuario=Depends(obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    resumen = (
        f"{promovente}, en representación de la menor {menor} de {edad_menor} años, nacida el {fecha_nacimiento}, "
        f"promueve demanda contra {demandado} para el reconocimiento judicial de paternidad. "
        f"Ambos sostuvieron una relación de tipo {tipo_relacion} durante el periodo {periodo_relacion}, "
        f"y se considera al demandado como padre debido a que {motivo}.\n"
    )

    if conoce_trabajo.lower() == "sí" and trabajo and direccion_trabajo and ingreso:
        resumen += (
            f"El demandado labora en {trabajo}, ubicado en {direccion_trabajo}, con ingresos mensuales aproximados de ${ingreso}.\n"
        )
    else:
        resumen += "Se desconoce el lugar de trabajo actual del demandado.\n"

    resumen += f"El demandado reside en {direccion_demandado} y no ha reconocido voluntariamente a la menor.\n"

    if solicita_pension.lower() == "sí" and porcentaje and fecha_incumplimiento:
        resumen += (
            f"Se solicita pensión alimenticia equivalente al {porcentaje}% de sus ingresos, debido a un incumplimiento desde {fecha_incumplimiento}.\n"
        )

    if prueba_adn.lower() == "sí":
        resumen += "Se solicita la práctica de prueba pericial en genética molecular (ADN).\n"

    if desea_testigos.lower() == "sí" and testigos:
        resumen += f"Se cuenta con testigos propuestos: {testigos}.\n"

    # Información de abogados
    resumen += f"El promovente está representado legalmente por {usuario.nombre_completo} (Cédula {usuario.cedula_profesional}). "
    if desea_agregar_otros_abogados.lower() == "sí" and abogados:
        resumen += "También autoriza a los abogados adicionales: "
        lista_abogados = [ab.strip() for ab in abogados.split(";") if ab.strip()]
        resumen += "; ".join([f"{a.split(':')[0]} (Cédula {a.split(':')[1]})" for a in lista_abogados]) + ".\n"

    # Generación de resumen jurídico con modelo
    prompt = (
        "Resume jurídicamente, en un solo párrafo y con lenguaje técnico-formal, el siguiente escrito legal:\n"
        f"{resumen}\nResumen:"
    )

    # NUEVO: llamada a la API HTTP de Ollama
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma:2b-instruct",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        resumen_generado = data.get("response", "No se pudo generar el resumen.")
    except Exception as e:
        resumen_generado = f"Error al generar el resumen: {str(e)}"

    return JSONResponse({"resumen": resumen_generado})