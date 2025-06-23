# resumen_alimentos.py
from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import obtener_usuario_actual
import requests

router = APIRouter()

@router.post("/resumen/pension_alimenticia")
async def resumen_pension_alimenticia(
    promovente: str = Form(...),
    parentesco: str = Form(...),
    direccion: str = Form(...),
    demandado: str = Form(...),
    hijos_info: str = Form(...),
    ingresos: str = Form(...),
    incumplimiento: str = Form(...),
    retroactivos: str = Form(...),
    medidas: str = Form(...),
    usuario=Depends(obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    menores_list = [m.strip().replace(":", " de ") + " años" for m in hijos_info.split(";") if m.strip()]
    menores_texto = "; ".join(menores_list)

    resumen = (
        f"{promovente}, en calidad de {parentesco}, promueve demanda en representación de {menores_texto} contra {demandado}, "
        f"para el pago de pensión alimenticia en la Ciudad de México.\n"
        f"Los menores dependen económicamente del promovente. Se estima que el demandado percibe ingresos mensuales de ${ingresos}.\n"
    )

    if incumplimiento.lower().strip() == "sí":
        resumen += "El promovente manifiesta que el demandado ha incumplido reiteradamente con su obligación alimentaria.\n"
    else:
        resumen += "El promovente señala que el demandado no ha contribuido voluntariamente a la manutención.\n"

    if retroactivos.lower().strip() == "sí":
        resumen += "Se solicita el pago retroactivo de la pensión desde la presentación de la demanda.\n"
    if medidas.lower().strip() == "sí":
        resumen += "Se solicita embargo precautorio u otra medida para garantizar el cumplimiento de la pensión.\n"

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