from fastapi import APIRouter, Depends, HTTPException
from mocks.data import users, Role
from schemas.user import UserCreate, UserOut
from utils.auth import create_access_token, get_current_user

router = APIRouter(prefix="/api/admins", tags=["admins"])


@router.post("/", response_model=UserOut)
def create_admin(user: UserCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can create admins")

    if user.role != Role.admin:
        raise HTTPException(status_code=400, detail="This endpoint can only create admins")

    if any(u["login"] == user.login for u in users):
        raise HTTPException(status_code=400, detail="Login already exists")
    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email already exists")

    new_admin = {
        "id": max(u["id"] for u in users) + 1,
        "login": user.login,
        "password": user.password,  # В реальном проекте нужно хешировать пароль
        "email": user.email,
        "role": user.role
    }
    users.append(new_admin)
    return new_admin


@router.get("/", response_model=list[UserOut])
def get_admins(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin or superadmin can view admins")

    return [user for user in users if user["role"] == Role.admin]


@router.delete("/{id}")
def delete_admin(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.superadmin:
        raise HTTPException(status_code=403, detail="Only superadmin can delete admins")

    admin = next((u for u in users if u["id"] == id and u["role"] == Role.admin), None)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    users.remove(admin)
    return {"message": "Admin deleted successfully"}