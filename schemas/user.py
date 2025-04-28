from pydantic import BaseModel
from mocks.data import Role

class UserCreate(BaseModel):
    login: str
    password: str
    email: str
    role: Role = Role.worker

class UserLogin(BaseModel):
    login: str
    password: str

class UserOut(BaseModel):
    id: int
    login: str
    email: str
    role: Role