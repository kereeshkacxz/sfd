from backend.schemas.trigger import TriggerDeleteRequest
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.trigger import Trigger
from backend.utils.auth import get_current_user
from datetime import datetime
from backend.mocks.data import Role
from typing import List

router = APIRouter(prefix="/api/triggers", tags=["Triggers"])


@router.get("/")
def get_triggers(db: Session = Depends(get_db)):
    return db.query(Trigger).all()


@router.post("/")
def create_trigger(
        name: str,
        condition: dict,
        action: str,
        created_by: int,
        db: Session = Depends(get_db)
):
    db_trigger = Trigger(
        name=name,
        condition=condition,
        action=action,
        created_by=created_by,
        updated_at=datetime.utcnow()
    )
    db.add(db_trigger)
    db.commit()
    db.refresh(db_trigger)
    return db_trigger


@router.get("/{trigger_id}")
def get_trigger(trigger_id: int, db: Session = Depends(get_db)):
    trigger = db.query(Trigger).filter(Trigger.id == trigger_id).first()
    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")
    return trigger


@router.put("/{trigger_id}")
def update_trigger(
        trigger_id: int,
        name: str | None = None,
        condition: dict | None = None,
        action: str | None = None,
        db: Session = Depends(get_db)
):
    trigger = db.query(Trigger).filter(Trigger.id == trigger_id).first()
    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")

    if name:
        trigger.name = name
    if condition:
        trigger.condition = condition
    if action:
        trigger.action = action
    trigger.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(trigger)
    return trigger


@router.delete("/")
def delete_triggers(
    request: TriggerDeleteRequest,  # Используем Pydantic модель
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin can delete triggers")
    
    # Логируем полученные данные
    print(f"Получены ID для удаления: {request.trigger_ids}")
    
    # Проверяем существование триггеров
    existing = db.query(Trigger.id).filter(Trigger.id.in_(request.trigger_ids)).all()
    existing_ids = {t.id for t in existing}
    
    if len(existing_ids) != len(request.trigger_ids):
        missing = set(request.trigger_ids) - existing_ids
        raise HTTPException(
            status_code=404,
            detail=f"Triggers not found: {missing}"
        )
    
    # Удаление
    db.query(Trigger).filter(Trigger.id.in_(request.trigger_ids)).delete(synchronize_session=False)
    db.commit()
    
    return {"message": f"Deleted {len(request.trigger_ids)} triggers"}