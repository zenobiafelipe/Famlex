# models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy import ForeignKey
from database import Base  # así todos los modelos usan la misma base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    nombre_completo = Column(String, nullable=False)  # 👈 nuevo campo
    cedula_profesional = Column(String, nullable=False)  # 👈 nuevo campo
    fecha_registro = Column(DateTime, default=datetime.utcnow)

class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre = Column(String, nullable=False)
    ruta = Column(String, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
