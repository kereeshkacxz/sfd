from sqlalchemy import Column, Integer, String, Enum
from backend.database import Base
from backend.mocks.data import Role

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(Enum(Role), nullable=False)
    created_at = Column(String)
    updated_at = Column(String)