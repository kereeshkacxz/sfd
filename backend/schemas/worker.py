from pydantic import BaseModel  # Импортируем BaseModel из pydantic
from backend.mocks.data import Role
from typing import Optional

class WorkerOut(BaseModel):
    id: int
    login: str
    email: str
    role: Role

class WorkerUpdate(BaseModel):
    login: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None