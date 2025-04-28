from pydantic import BaseModel
from enum import Enum

class MachineStatus(str, Enum):
    idle = "idle"
    working = "working"
    minor_damage = "minor_damage"
    critical_damage = "critical_damage"

class MachineCreate(BaseModel):
    name: str
    status: MachineStatus

class MachineUpdate(BaseModel):
    name: str | None = None
    status: MachineStatus | None = None

class MachineOut(BaseModel):
    id: int
    name: str
    status: MachineStatus