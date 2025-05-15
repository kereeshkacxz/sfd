# create_admin.py

from backend.database import SessionLocal
from backend.models import User
from backend.mocks.data import Role
from datetime import datetime

def create_first_admin():
    db = SessionLocal()

    admin_login = "admin"
    admin_email = "admin@example.com"
    admin_password = "admin123"

    existing = db.query(User).filter_by(login=admin_login).first()
    if existing:
        print(f"ℹ️ Администратор уже существует: {existing.login}")
        db.close()
        return

    now = datetime.utcnow().isoformat()

    admin = User(
        login=admin_login,
        email=admin_email,
        password_hash=admin_password,  # пока без хеширования
        role=Role.admin,               # если в Enum у тебя есть admin
        created_at=now,
        updated_at=now,
    )

    db.add(admin)
    db.commit()
    print(f"✅ Администратор '{admin_login}' создан с паролем: {admin_password}")
    db.close()


if __name__ == "__main__":
    create_first_admin()
