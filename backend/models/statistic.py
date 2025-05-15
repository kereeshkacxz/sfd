from sqlalchemy import Column, Integer, Enum, JSON, DateTime
from sqlalchemy.sql import func
from backend.database import Base
import enum

class StatisticType(enum.Enum):
    worker = "worker"
    task = "task"
    machine = "machine"
    production = "production"

class Statistic(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True)
    type = Column(Enum(StatisticType), nullable=False)
    data = Column(JSON, nullable=False)
    generated_at = Column(DateTime, server_default=func.current_timestamp())  # Добавляем


