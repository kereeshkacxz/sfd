from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.tasks import router as tasks_router
from routes.notifications import router as notifications_router
from routes.statistics import router as statistics_router
from routes.machines import router as machines_router
from routes.triggers import router as triggers_router
from routes.data_source import router as data_source_router
from routes.admins import router as admins_router
from routes.workers import router as workers_router
from utils.generator import scheduler, generate_data
from mocks.data import data_source_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код, запускаемый при старте
    scheduler.add_job(
        generate_data, "interval", seconds=data_source_settings["frequency"]
    )
    scheduler.start()
    yield
    # Код, запускаемый при завершении
    scheduler.shutdown()


app = FastAPI(
    title="Ваш API",
    description="Описание вашего API",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/docs",  # Изменение URL для Swagger UI
    redoc_url="/api/redoc",  # Изменение URL для ReDoc
    lifespan=lifespan,
)


app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(notifications_router)
app.include_router(statistics_router)
app.include_router(machines_router)
app.include_router(triggers_router)
app.include_router(data_source_router)
app.include_router(admins_router)
app.include_router(workers_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
