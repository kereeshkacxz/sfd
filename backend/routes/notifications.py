from fastapi import APIRouter, Depends
from backend.mocks.data import notifications, Role
from backend.schemas.notification import NotificationOut
from backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("/", response_model=list[NotificationOut])
def get_notifications(type: str | None = None, current_user: dict = Depends(get_current_user)):
    user_notifications = [n for n in notifications if n["user_id"] == current_user["id"]]
    if type == "unread":
        user_notifications = [n for n in user_notifications if not hasattr(n, "read") or not n["read"]]
    return user_notifications