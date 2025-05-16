from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.mocks.data import Role
from backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/admins", tags=["Admins"])


@router.get("/")
def get_admins(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"].value != Role.superadmin.value:  # Сравниваем значения Enum
        raise HTTPException(status_code=403, detail="Only superadmin can view admins")

    admins = db.query(User).filter(User.role == Role.admin).all()
    if not admins:
        raise HTTPException(status_code=404, detail="No admins found")
    return admins


@router.post("/")
def create_admin(login: str, password: str, email: str, db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    if current_user["role"].value != Role.superadmin.value:
        raise HTTPException(status_code=403, detail="Only superadmin can create admins")

    if db.query(User).filter(User.login == login).first():
        raise HTTPException(status_code=400, detail="Login already exists")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    db_user = User(
        login=login,
        password_hash=password,
        email=email,
        role=Role.admin,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/current")
def get_current_user_id(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получение ID текущего авторизованного пользователя
    """
    # Проверяем, что пользователь авторизован (get_current_user уже делает эту проверку)
    user_id = current_user.get("id")
    
    if not user_id:
        raise HTTPException(
            status_code=404,
            detail="User ID not found in token"
        )
    
    return {"id": user_id}