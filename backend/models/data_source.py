from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base

class DataGenerator(Base):
    __tablename__ = "data_generator"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    parameters = Column(JSON)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp())