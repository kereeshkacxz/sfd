from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.mocks.data import Role
from backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/admins", tags=["Admins"])

@router.get("/")
def get_admins(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can view admins")
    return db.query(User).filter(User.role == Role.admin).all()

@router.post("/")
def create_admin(login: str, password: str, email: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can create admins")
    if db.query(User).filter(User.login == login).first():
        raise HTTPException(status_code=400, detail="Login already exists")
    # Здесь должна быть логика хеширования пароля
    db_user = User(login=login, password_hash=password, email=email, role=Role.admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user