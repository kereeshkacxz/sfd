from fastapi import APIRouter, Depends, HTTPException
from mocks.data import users, tasks, notifications, Role
from schemas.worker import WorkerOut
from schemas.task import TaskOut
from schemas.notification import NotificationOut
from utils.auth import get_current_user

router = APIRouter(prefix="/api/workers", tags=["workers"])


@router.get("/", response_model=list[WorkerOut])
def get_workers(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view workers")
    return [user for user in users if user["role"] == Role.worker]


@router.get("/{id}/tasks", response_model=list[TaskOut])
def get_worker_tasks(id: int, current_user: dict = Depends(get_current_user)):
    worker = next((u for u in users if u["id"] == id and u["role"] == Role.worker), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    if current_user["role"] == Role.worker and current_user["id"] != id:
        raise HTTPException(status_code=403, detail="Not authorized to view this worker's tasks")

    return [task for task in tasks if task["assigned_to"] == id]


@router.get("/{id}/notifications", response_model=list[NotificationOut])
def get_worker_notifications(id: int, current_user: dict = Depends(get_current_user)):
    worker = next((u for u in users if u["id"] == id and u["role"] == Role.worker), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    if current_user["role"] == Role.worker and current_user["id"] != id:
        raise HTTPException(status_code=403, detail="Not authorized to view this worker's notifications")

    return [notification for notification in notifications if notification["user_id"] == id]


@router.get("/{id}/statistics")
def get_worker_statistics(id: int, current_user: dict = Depends(get_current_user)):
    worker = next((u for u in users if u["id"] == id and u["role"] == Role.worker), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view worker statistics")

    # Подсчитываем статистику
    worker_tasks = [task for task in tasks if task["assigned_to"] == id]
    completed_tasks = len([task for task in worker_tasks if task["status"] == "completed"])
    total_tasks = len(worker_tasks)

    return {
        "worker_id": id,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    }