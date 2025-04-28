from fastapi import APIRouter, Depends, HTTPException
from mocks.data import triggers, Role
from schemas.trigger import TriggerCreate, TriggerUpdate, TriggerOut
from utils.auth import get_current_user

router = APIRouter(prefix="/api/triggers", tags=["triggers"])


@router.post("/", response_model=TriggerOut)
def create_trigger(trigger: TriggerCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can create triggers")

    new_trigger = {
        "id": max(t["id"] for t in triggers) + 1,
        "condition": trigger.condition,
        "message": trigger.message,
        "type": trigger.type,
        "target_id": trigger.target_id
    }
    triggers.append(new_trigger)
    return new_trigger


@router.get("/", response_model=list[TriggerOut])
def get_triggers(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view triggers")
    return triggers


@router.get("/{id}", response_model=TriggerOut)
def get_trigger(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view triggers")

    trigger = next((t for t in triggers if t["id"] == id), None)
    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")
    return trigger


@router.put("/{id}", response_model=TriggerOut)
def update_trigger(id: int, trigger_update: TriggerUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can update triggers")

    trigger = next((t for t in triggers if t["id"] == id), None)
    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")

    if trigger_update.condition:
        trigger["condition"] = trigger_update.condition
    if trigger_update.message:
        trigger["message"] = trigger_update.message
    if trigger_update.type:
        trigger["type"] = trigger_update.type
    if trigger_update.target_id:
        trigger["target_id"] = trigger_update.target_id

    return trigger


@router.delete("/{id}")
def delete_trigger(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can delete triggers")

    trigger = next((t for t in triggers if t["id"] == id), None)
    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")

    triggers.remove(trigger)
    return {"message": f"Trigger with ID {id} deleted successfully"}