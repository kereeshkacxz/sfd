from pydantic import BaseModel
from enum import Enum  # Импортируем Enum
from typing import List


# Исправляем TriggerType на перечисление
class TriggerType(str, Enum):  # Наследуем от Enum и str для совместимости с Pydantic
    task = "task"
    worker = "worker"
    machine = "machine"

class TriggerCreate(BaseModel):
    condition: str
    message: str
    type: TriggerType  # Теперь Pydantic сможет обработать TriggerType
    target_id: int

class TriggerUpdate(BaseModel):
    condition: str | None = None
    message: str | None = None
    type: TriggerType | None = None  # Теперь это тоже работает
    target_id: int | None = None

class TriggerOut(BaseModel):
    id: int
    condition: str
    message: str
    type: TriggerType  # И здесь всё корректно
    target_id: int

class TriggerDeleteRequest(BaseModel):
    trigger_ids: List[int]