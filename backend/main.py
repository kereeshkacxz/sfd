# from fastapi import FastAPI
# from backend.routes import auth, tasks, notifications, statistics, machines, triggers, data_source, admins, workers
# from backend.utils.generator import start_generator
#
# app = FastAPI()
#
# app.include_router(auth)
# app.include_router(tasks)
# app.include_router(notifications)
# app.include_router(statistics)
# app.include_router(machines)
# app.include_router(triggers)
# app.include_router(data_source)
# app.include_router(admins)
# app.include_router(workers)
#
# start_generator()
#
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI
from database import engine, Base
from routes import admins, auth, data_source, machines, notifications, statistics, tasks, triggers, workers

app = FastAPI()

# Создание таблиц (если их нет)
Base.metadata.create_all(bind=engine)

# Подключение маршрутов
app.include_router(admins.router)
app.include_router(auth.router)
app.include_router(data_source.router)
app.include_router(machines.router)
app.include_router(notifications.router)
app.include_router(statistics.router)
app.include_router(tasks.router)
app.include_router(triggers.router)
app.include_router(workers.router)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}