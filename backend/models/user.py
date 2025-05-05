from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from backend.database import Base
import enum

class UserRole(enum.Enum):
    worker = "worker"
    admin = "admin"
    superadmin = "superadmin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    login = Column(String(20), unique=True, nullable=False)
    password_hash = Column(String(64), nullable=False)
    email = Column(String(64), unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp())