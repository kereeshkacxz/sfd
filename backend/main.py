from fastapi import FastAPI
from routes import auth, tasks, notifications, statistics, machines, triggers, data_source, admins, workers
from utils.generator import start_generator

app = FastAPI()

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(notifications.router)
app.include_router(statistics.router)
app.include_router(machines.router)
app.include_router(triggers.router)
app.include_router(data_source.router)
app.include_router(admins.router)
app.include_router(workers.router)

start_generator()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)