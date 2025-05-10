from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.task import Task, TaskStatus
from backend.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("/")
def get_tasks(status: TaskStatus | None = None, db: Session = Depends(get_db)):
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    return query.all()


@router.post("/")
def create_task(
        title: str,
        status: TaskStatus,
        deadline: str,
        assigned_to: int,
        created_by: int,
        description: str | None = None,  # Необязательный параметр в конце
        db: Session = Depends(get_db)
):
    db_task = Task(
        title=title,
        description=description,
        status=status,
        deadline=deadline,
        assigned_to=assigned_to,
        created_by=created_by,
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


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}