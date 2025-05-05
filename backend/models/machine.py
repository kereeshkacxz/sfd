from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base
import enum

class MachineStatus(enum.Enum):
    idle = "idle"
    working = "working"
    minor_damage = "minor_damage"
    critical_damage = "critical_damage"

class Machine(Base):
    __tablename__ = "machine"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    status = Column(Enum(MachineStatus), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp())