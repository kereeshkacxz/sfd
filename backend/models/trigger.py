from sqlalchemy import Column, Integer, String, JSON, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base

class Trigger(Base):
    __tablename__ = "trigger_"  # Исправлено с tablename на __tablename__
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    condition = Column(JSON)
    action = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp())