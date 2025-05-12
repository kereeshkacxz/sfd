from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, check_and_create_tables
from backend.routes import (
    auth,
    tasks,
    notifications,
    statistics,
    machines,
    triggers,
    data_source,
    admins,
    workers,
)
from backend.utils.generator import start_generator

app = FastAPI()

# --- Разрешаем CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Разрешить ВСЕ домены. ИЛИ укажите ['http://localhost:3000'] для фронтенда.
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить любые методы (GET, POST и т.д.)
    allow_headers=["*"],  # Разрешить любые заголовки
)

# Создание таблиц (если их нет)
Base.metadata.create_all(bind=engine)

# Подключение маршрутов с глобальным префиксом /api
app.include_router(auth)
app.include_router(tasks)
app.include_router(notifications)
app.include_router(statistics)
app.include_router(machines)
app.include_router(triggers)
app.include_router(data_source)
app.include_router(admins)
app.include_router(workers)


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


start_generator()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
