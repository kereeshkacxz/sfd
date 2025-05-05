from pydantic import BaseModel
from datetime import datetime
from backend.mocks.data import TaskStatus

class TaskCreate(BaseModel):
    title: str
    description: str
    status: TaskStatus = TaskStatus.planned
    deadline: datetime
    assigned_to: int

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
    deadline: datetime | None = None
    assigned_to: int | None = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus
    deadline: datetime
    assigned_to: int