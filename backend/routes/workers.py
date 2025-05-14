from fastapi import APIRouter, Depends, HTTPException, Form, Body 
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User  # Предполагаем, что модель User уже есть
# from backend.schemas import WorkerUpdate
from backend.mocks.data import Role
from backend.utils.auth import get_current_user
from backend.schemas.worker import WorkerUpdate
from backend.schemas import UserCreate
from datetime import datetime

router = APIRouter(prefix="/api/workers", tags=["Workers"])


@router.get("/")
def get_workers(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Проверяем права доступа (только admin или superadmin могут просматривать)
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view workers")

    # Получаем всех пользователей с ролью worker
    workers = db.query(User).filter(User.role == Role.worker).all()
    return workers


@router.post("/")
def create_worker(
        user_data: UserCreate,
        db: Session = Depends(get_db),
        current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can create workers")

    if db.query(User).filter(User.login == user_data.login).first():
        raise HTTPException(status_code=400, detail="Login already exists")
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    db_worker = User(
        login=user_data.login,
        password_hash=user_data.password,  # Пока без хеша, потом добавишь
        email=user_data.email,
        role=Role.worker,
        updated_at=datetime.utcnow()
    )
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker



@router.get("/{worker_id}")
def get_worker(worker_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"].value not in [Role.admin.value, Role.superadmin.value]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view workers")

    worker = db.query(User).filter(User.id == worker_id, User.role == Role.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.put("/{worker_id}")
async def update_worker(
    worker_id: int,
    worker_update: WorkerUpdate = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"].value not in [Role.admin.value, Role.superadmin.value]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can update workers")

    worker = db.query(User).filter(User.id == worker_id, User.role == Role.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    if worker_update.login and db.query(User).filter(User.login == worker_update.login).first() and worker_update.login != worker.login:
        raise HTTPException(status_code=400, detail="Login already exists")
    if worker_update.email and db.query(User).filter(User.email == worker_update.email).first() and worker_update.email != worker.email:
        raise HTTPException(status_code=400, detail="Email already exists")

    if worker_update.login:
        worker.login = worker_update.login
    if worker_update.password:
        worker.password_hash = worker_update.password
    if worker_update.email:
        worker.email = worker_update.email

    worker.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(worker)
    return worker


@router.delete("/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"].value not in [Role.admin.value, Role.superadmin.value]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can delete workers")

    worker = db.query(User).filter(User.id == worker_id, User.role == Role.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(worker)
    db.commit()
    return {"message": "Worker deleted successfully"}