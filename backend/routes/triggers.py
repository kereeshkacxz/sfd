from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.trigger import Trigger
from backend.utils.auth import get_current_user
from datetime import datetime

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


@router.delete("/{trigger_id}")
def delete_trigger(trigger_id: int, db: Session = Depends(get_db)):
    trigger = db.query(Trigger).filter(Trigger.id == trigger_id).first()
    if not trigger:
        raise HTTPException(status_code=404, detail="Trigger not found")
    db.delete(trigger)
    db.commit()
    return {"message": "Trigger deleted successfully"}