from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.task import Task, TaskStatus
from backend.utils.auth import get_current_user
from backend.schemas.task import TaskDeleteRequest
from datetime import datetime
from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class TaskStatus(str, Enum):
    planned = "planned"
    in_progress = "in_progress"
    completed = "completed"
    overdue = "overdue"
    evaluation = "evaluation"

class TaskCreate(BaseModel):
    title: str
    status: TaskStatus
    deadline: str  # ISO-строка, либо можно `datetime` и указать формат
    assigned_to: int
    created_by: int
    description: str | None = None

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("/")
def get_tasks(status: TaskStatus | None = None, db: Session = Depends(get_db)):
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    return query.all()


@router.post("/")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        deadline=task.deadline,
        assigned_to=task.assigned_to,
        created_by=task.created_by,
        updated_at=datetime.utcnow()
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}")
def update_task(
        task_id: int,
        title: str | None = None,
        description: str | None = None,
        status: TaskStatus | None = None,
        deadline: str | None = None,
        assigned_to: int | None = None,
        db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if title:
        task.title = title
    if description:
        task.description = description
    if status:
        task.status = status
    if deadline:
        task.deadline = deadline
    if assigned_to:
        task.assigned_to = assigned_to
    task.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(task)
    return task


@router.delete("/", response_model=dict)
def delete_tasks(
    payload: TaskDeleteRequest,
    db: Session = Depends(get_db),
):
    tasks = db.query(Task).filter(Task.id.in_(payload.ids)).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found")
    for task in tasks:
        db.delete(task)
    db.commit()
    return {"message": f"{len(tasks)} task(s) deleted successfully"}