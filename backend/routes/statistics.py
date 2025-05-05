from fastapi import APIRouter, Depends, HTTPException
from backend.mocks.data import statistics, machines, Role
from backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/statistics", tags=["statistics"])  # Этого может не быть!

@router.get("/production")
def get_production_statistics(type: str | None = None, filter: str | None = None, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view production statistics")
    return statistics["production"]

@router.get("/machines/{id}")
def get_machine_statistics(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view machine statistics")
    machine = next((m for m in machines if m["id"] == id), None)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return {"machine_id": id, "status": machine["status"], "uptime": "90%"}