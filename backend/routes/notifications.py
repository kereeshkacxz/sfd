from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.notification import Notification, NotificationType
from backend.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("/")
def get_notifications(is_read: bool | None = None, db: Session = Depends(get_db)):
    query = db.query(Notification)
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
    return query.all()


@router.post("/")
def create_notification(
        message: str,
        type: NotificationType,
        recipient_id: int,
        db: Session = Depends(get_db)
):
    db_notification = Notification(
        message=message,
        type=type,
        recipient_id=recipient_id,
        updated_at=datetime.utcnow()
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


@router.put("/{notification_id}")
def update_notification(
        notification_id: int,
        is_read: bool | None = None,
        db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    if is_read is not None:
        notification.is_read = is_read
    notification.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(notification)
    return notification


@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted successfully"}