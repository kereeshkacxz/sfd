from fastapi import APIRouter, Depends, HTTPException
from backend.mocks.data import machines, notifications, Role, MachineStatus
from backend.schemas.machine import MachineCreate, MachineUpdate, MachineOut
from backend.schemas.notification import NotificationOut
from backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/data-source/machines", tags=["machines"])


@router.post("/", response_model=MachineOut)
def create_machine(machine: MachineCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can create machines")

    new_machine = {
        "id": max(m["id"] for m in machines) + 1,
        "name": machine.name,
        "status": machine.status
    }
    machines.append(new_machine)
    return new_machine


@router.get("/", response_model=list[MachineOut])
def get_machines(current_user: dict = Depends(get_current_user)):
    return machines


@router.put("/{id}", response_model=MachineOut)
def update_machine(id: int, machine_update: MachineUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can update machines")

    machine = next((m for m in machines if m["id"] == id), None)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    if machine_update.name:
        machine["name"] = machine_update.name
    if machine_update.status:
        machine["status"] = machine_update.status

    return machine


@router.delete("/{id}")
def delete_machine(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can delete machines")

    machine = next((m for m in machines if m["id"] == id), None)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    machines.remove(machine)
    return {"message": "Machine deleted successfully"}


# Эндпоинт для уведомлений о станках (переиспользуем /api/notifications)
@router.get("/notifications", response_model=list[NotificationOut])
def get_machine_notifications(current_user: dict = Depends(get_current_user)):
    # Фильтруем уведомления, связанные с текущим пользователем
    user_notifications = [n for n in notifications if n["user_id"] == current_user["id"]]
    return user_notifications


# Эндпоинт для статистики по станку (перемещён из /api/statistics/machines/{id})
@router.get("/{id}/statistics")
def get_machine_statistics(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view machine statistics")

    machine = next((m for m in machines if m["id"] == id), None)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    return {"machine_id": id, "status": machine["status"], "uptime": "90%"}