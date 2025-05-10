from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base
import enum

class TaskStatus(enum.Enum):
    planned = "planned"
    in_progress = "in_progress"
    completed = "completed"
    overdue = "overdue"
    evaluation = "evaluation"

class Task(Base):
    __tablename__ = "task"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), nullable=False)
    deadline = Column(DateTime)
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp())