# resumen_admin.py
from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from routers.auth import obtener_usuario_actual
import requests

router = APIRouter()

@router.post("/resumen/divorcio_admin")
async def resumen_divorcio_admin(
    promovente: str = Form(...),
    conyuge: str = Form(...),
    direccion: str = Form(...),
    fecha_matrimonio: str = Form(...),
    regimenadm: str = Form(...),
    usuario=Depends(obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    contenido_legal = f"""
        Quienes suscribimos, {promovente} y {conyuge}, por nuestro propio derecho, señalando como domicilio el ubicado en {direccion},
        comparecemos respetuosamente para exponer:

        Que por medio del presente escrito, y con fundamento en el artículo 272 del Código Civil para la Ciudad de México,
        venimos a solicitar de manera conjunta y de común acuerdo el divorcio por la vía administrativa.

        1. Con fecha {fecha_matrimonio}, contrajimos matrimonio civil en la Ciudad de México.
        2. Ambos comparecientes somos mayores de edad.
        3. No procreamos hijos menores ni dependientes económicos.
        4. La compareciente no está embarazada.
        5. Ninguno requiere pensión alimenticia.
        6. El régimen matrimonial fue: {regimenadm}.
        """

    prompt = f"Resume jurídicamente en un solo párrafo, usando lenguaje técnico, el siguiente escrito legal:\n{contenido_legal}\nResumen:"

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