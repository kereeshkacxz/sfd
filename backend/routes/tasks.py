from fastapi import APIRouter, Depends, HTTPException
from mocks.data import tasks, users, Role, TaskStatus
from schemas.task import TaskCreate, TaskUpdate, TaskOut
from utils.auth import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("/", response_model=TaskOut)
def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can create tasks")

    worker = next((u for u in users if u["id"] == task.assigned_to), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    new_task = {
        "id": max(t["id"] for t in tasks) + 1,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "deadline": task.deadline,
        "assigned_to": task.assigned_to
    }
    tasks.append(new_task)
    return new_task


@router.get("/", response_model=list[TaskOut])
def get_tasks(status: TaskStatus | None = None, assigned_to: int | None = None,
              current_user: dict = Depends(get_current_user)):
    filtered_tasks = tasks
    if status:
        filtered_tasks = [t for t in filtered_tasks if t["status"] == status]
    if assigned_to:
        filtered_tasks = [t for t in filtered_tasks if t["assigned_to"] == assigned_to]

    if current_user["role"] == Role.worker:
        filtered_tasks = [t for t in filtered_tasks if t["assigned_to"] == current_user["id"]]

    return filtered_tasks


@router.get("/{id}", response_model=TaskOut)
def get_task(id: int, current_user: dict = Depends(get_current_user)):
    task = next((t for t in tasks if t["id"] == id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user["role"] == Role.worker and task["assigned_to"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this task")

    return task


@router.put("/{id}", response_model=TaskOut)
def update_task(id: int, task_update: TaskUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can update tasks")

    task = next((t for t in tasks if t["id"] == id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_update.title:
        task["title"] = task_update.title
    if task_update.description:
        task["description"] = task_update.description
    if task_update.status:
        task["status"] = task_update.status
    if task_update.deadline:
        task["deadline"] = task_update.deadline
    if task_update.assigned_to:
        worker = next((u for u in users if u["id"] == task_update.assigned_to), None)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        task["assigned_to"] = task_update.assigned_to

    return task


@router.delete("/{id}")
def delete_task(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can delete tasks")

    task = next((t for t in tasks if t["id"] == id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    tasks.remove(task)
    return {"message": "Task deleted successfully"}