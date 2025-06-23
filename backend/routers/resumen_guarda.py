# resumen_guarda.py
from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import obtener_usuario_actual
import requests

router = APIRouter()

@router.post("/resumen/guarda_custodia")
async def resumen_guarda_custodia(
    promovente: str = Form(...),
    parentesco: str = Form(...),
    menores: str = Form(...),
    demandado: str = Form(...),
    conoce_domicilio: str = Form(...),
    direccion_demandado: str = Form(None),
    direccion_demandado_no: str = Form(None),
    tipo_relacion: str = Form(...),
    tiempo_convivencia: str = Form(...),
    motivo_guarda: str = Form(...),
    desea_visitas: str = Form(...),
    visitas: str = Form(None),
    restricciones: str = Form(None),
    usuario=Depends(obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    menores_list = [m.strip().replace(":", " de ") + " años" for m in menores.split(";") if m.strip()]
    menores_texto = "; ".join(menores_list)

    resumen = (
        f"{promovente}, en calidad de {parentesco}, solicita la guarda y custodia de {menores_texto}.\n"
        f"La demanda se presenta en contra de {demandado}.\n"
        f"Relación entre las partes: {tipo_relacion}, con convivencia de {tiempo_convivencia}.\n"
        f"Motivo de la solicitud: {motivo_guarda}.\n"
    )

    if conoce_domicilio.lower().strip() == "si" and direccion_demandado:
        resumen += f"El promovente conoce el domicilio del demandado: {direccion_demandado}.\n"
    elif direccion_demandado_no:
        resumen += f"No se conoce el domicilio exacto del demandado. Posible domicilio: {direccion_demandado_no}.\n"

    if desea_visitas.lower().strip() == "si" and visitas:
        resumen += f"Se propone régimen de visitas: {visitas}.\n"
        if restricciones and restricciones.lower().strip() == "si":
            resumen += f"Se solicitan restricciones a las visitas por razones de seguridad.\n"

    prompt = (
        f"Resume jurídicamente en un solo párrafo, usando lenguaje técnico, el siguiente escrito legal:\n"
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