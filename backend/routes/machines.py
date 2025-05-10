from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.machine import Machine, MachineStatus
from backend.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/machines", tags=["Machines"])


@router.get("/")
def get_machines(status: MachineStatus | None = None, db: Session = Depends(get_db)):
    query = db.query(Machine)
    if status:
        query = query.filter(Machine.status == status)
    return query.all()


@router.post("/")
def create_machine(
        name: str,
        status: MachineStatus,
        assigned_to: int | None = None,
        db: Session = Depends(get_db)
):
    db_machine = Machine(
        name=name,
        status=status,
        assigned_to=assigned_to,
        updated_at=datetime.utcnow()
    )
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine


@router.get("/{machine_id}")
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine


@router.put("/{machine_id}")
def update_machine(
        machine_id: int,
        name: str | None = None,
        status: MachineStatus | None = None,
        assigned_to: int | None = None,
        db: Session = Depends(get_db)
):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    if name:
        machine.name = name
    if status:
        machine.status = status
    if assigned_to:
        machine.assigned_to = assigned_to
    machine.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(machine)
    return machine


@router.delete("/{machine_id}")
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    db.delete(machine)
    db.commit()
    return {"message": "Machine deleted successfully"}