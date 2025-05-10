from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User  # Предполагаем, что модель User уже есть
from backend.mocks.data import Role
from backend.utils.auth import get_current_user
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
        login: str,
        password: str,
        email: str,
        db: Session = Depends(get_db),
        current_user: dict = Depends(get_current_user)
):
    # Проверяем права доступа (только admin или superadmin могут создавать)
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can create workers")

    # Проверяем уникальность login и email
    if db.query(User).filter(User.login == login).first():
        raise HTTPException(status_code=400, detail="Login already exists")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Временное сохранение пароля как есть (нужно добавить хеширование, если требуется)
    db_worker = User(
        login=login,
        password_hash=password,
        email=email,
        role=Role.worker,
        updated_at=datetime.utcnow()
    )
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker


@router.get("/{worker_id}")
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(User).filter(User.id == worker_id, User.role == Role.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.put("/{worker_id}")
def update_worker(
        worker_id: int,
        login: str | None = None,
        password: str | None = None,
        email: str | None = None,
        db: Session = Depends(get_db)
):
    worker = db.query(User).filter(User.id == worker_id, User.role == Role.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    if login and db.query(User).filter(User.login == login).first() and login != worker.login:
        raise HTTPException(status_code=400, detail="Login already exists")
    if email and db.query(User).filter(User.email == email).first() and email != worker.email:
        raise HTTPException(status_code=400, detail="Email already exists")

    if login:
        worker.login = login
    if password:
        worker.password_hash = password  # Временное решение, нужно хеширование
    if email:
        worker.email = email
    worker.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(worker)
    return worker


@router.delete("/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Проверяем права доступа
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can delete workers")

    worker = db.query(User).filter(User.id == worker_id, User.role == Role.worker).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(worker)
    db.commit()
    return {"message": "Worker deleted successfully"}