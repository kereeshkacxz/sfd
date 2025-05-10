import sys
import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserCreate, UserOut
from backend.utils.auth import create_access_token, get_current_user
from backend.mocks.data import Role
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.get("/users")
def get_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view users")
    return db.query(User).all()

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if user.role == Role.admin and current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can create admin")

    if db.query(User).filter(User.login == user.login).first():
        raise HTTPException(status_code=400, detail="Login already exists")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Временное хеширование отключено, используем пароль как есть
    db_user = User(
        login=user.login,
        password_hash=user.password,  # Сохраняем пароль как есть
        email=user.email,
        role=user.role,
        created_at=str(datetime.utcnow()),
        updated_at=str(datetime.utcnow())
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "login": db_user.login, "role": db_user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login == form_data.username).first()
    if not user or user.password_hash != form_data.password:  # Прямое сравнение
        raise HTTPException(status_code=401, detail="Incorrect login or password")

    access_token = create_access_token(
        data={"sub": str(user.id), "login": user.login, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.delete("/delete/{id}")
def delete_user(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == Role.superadmin:
        raise HTTPException(status_code=403, detail="Cannot delete superadmin")
    if user.role == Role.admin and current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can delete admin")
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can delete worker")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.get("/", response_model=list[UserOut])
def get_users(role: Role | None = None, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view users")

    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()