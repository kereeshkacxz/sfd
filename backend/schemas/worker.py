from pydantic import BaseModel  # Импортируем BaseModel из pydantic
from backend.mocks.data import Role

class WorkerOut(BaseModel):
    id: int
    login: str
    email: str
    role: Role