# schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime


class UsuarioCreate(BaseModel):
    email: EmailStr
    password: str
    nombre_completo: str
    cedula_profesional: str

class UsuarioOut(BaseModel):
    id: int
    email: EmailStr
    nombre_completo: str
    cedula_profesional: str
    
class DocumentoOut(BaseModel):
    id: int
    nombre: str
    ruta: str
    fecha_creacion: datetime

    class Config:
        orm_mode = True

 
