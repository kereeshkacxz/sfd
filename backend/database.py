from sqlalchemy import create_engine
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