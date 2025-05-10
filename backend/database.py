from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Загружаем .env или DB.env
load_dotenv(".env")
if not os.getenv("DATABASE_URL"):
    load_dotenv("DB.env")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admuser:0000@192.168.31.207:5432/postgres")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_and_create_tables():
    from backend.models import User, Task, Notification, Machine, Trigger, Statistic, DataGenerator
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    if "users" not in existing_tables:
        Base.metadata.create_all(bind=engine)