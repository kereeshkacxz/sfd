from sqlalchemy import Column, Integer, Text, Enum, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base
import enum

class NotificationType(enum.Enum):
    task = "task"
    machine = "machine"
    system = "system"

class Notification(Base):
    __tablename__ = "notification"

    id = Column(Integer, primary_key=True)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.current_timestamp())