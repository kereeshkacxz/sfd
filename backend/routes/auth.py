import sys
import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
# Добавляем корневую директорию backend/ в sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.mocks.data import users, Role  # Абсолютный импорт
from fastapi import APIRouter
from backend.schemas.user import UserCreate, UserLogin, UserOut
from backend.utils.auth import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/users")
def get_users():
    return users


@router.post("/register")
def register_user(user: UserCreate, current_user: dict = Depends(get_current_user)):
    if user.role == Role.admin and current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can create admin")

    if any(u["login"] == user.login for u in users):
        raise HTTPException(status_code=400, detail="Login already exists")
    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "id": max(u["id"] for u in users) + 1,
        "login": user.login,
        "password": user.password,  # В реальном проекте нужно хешировать пароль
        "email": user.email,
        "role": user.role
    }
    users.append(new_user)
    access_token = create_access_token(
        data={"sub": str(new_user["id"]), "login": new_user["login"], "role": new_user["role"].value})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = next((u for u in users if u["login"] == form_data.username), None)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=401, detail="Incorrect login or password")

    access_token = create_access_token(
        data={"sub": str(user["id"]), "login": user["login"], "role": user["role"].value})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.delete("/delete/{id}")
def delete_user(id: int, current_user: dict = Depends(get_current_user)):
    user = next((u for u in users if u["id"] == id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["role"] == Role.superadmin:
        raise HTTPException(status_code=403, detail="Cannot delete superadmin")
    if user["role"] == Role.admin and current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can delete admin")
    if current_user["role"] != Role.admin and current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only admin can delete worker")

    users.remove(user)
    return {"message": "User deleted successfully"}


@router.get("/", response_model=list[UserOut])
def get_users(role: Role | None = None, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view users")

    filtered_users = users
    if role:
        filtered_users = [user for user in users if user["role"] == role]
    return filtered_users