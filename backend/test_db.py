from database import engine
from sqlalchemy.sql import text

try:
    with engine.connect() as connection:
        print("Подключение к базе данных успешно!")
        # Используем text() для выполнения SQL-запроса
        result = connection.execute(text("SELECT * FROM users LIMIT 1"))
        for row in result:
            print(row)
except Exception as e:
    print(f"Ошибка подключения: {e}")