from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from backend.database import get_db, SessionLocal
from backend.models.task import Task, TaskStatus
from backend.models.notification import Notification, NotificationType
from backend.models.user import User
from backend.models.machine import Machine, MachineStatus
from backend.models.statistic import Statistic, StatisticType
from backend.models.data_source import DataGenerator
from backend.mocks.data import Role, data_source_settings, MachineStatus as MachineStatusEnum
from datetime import datetime, timedelta
from backend.models import Trigger
import random
import uuid
import string

scheduler = AsyncIOScheduler()

def generate_data():
    db: Session = SessionLocal()
    try:
        # Получаем настройки
        frequency = data_source_settings["frequency"]
        object_types = data_source_settings["object_types"]
        max_objects = data_source_settings["max_objects"]

        # Проверяем, не превышает ли общее количество объектов максимум
        if db.query(Statistic).count() >= max_objects:
            return

        # Текущее время для generated_at и timestamp
        now = datetime.utcnow()
        now_str = now.strftime("%Y-%m-%dT%H:%M:%S")
        now_str_z = now.strftime("%Y-%m-%dT%H:%M:%SZ")

        # Генерируем псевдостатистику для каждого типа объекта
        for obj_type in object_types:
            if obj_type == "worker":
                # Генерируем псевдостатистику для работника
                worker_statistic = Statistic(
                    type=StatisticType.worker,
                    data={
                        "ID": str(uuid.uuid4()),
                        "status": random.choice(["active", "inactive"]),
                        "timestamp": now_str_z,
                        "type": "worker",
                        "data": {
                            "workerID": f"worker_{random.randint(1, 100)}",
                            "name": f"Worker_{''.join(random.choices(string.ascii_uppercase, k=5))}",
                            "status": random.choice(["active", "inactive"])
                        }
                    },
                    generated_at=now
                )
                db.add(worker_statistic)
                db.commit()

            elif obj_type == "task":
                # Генерируем псевдостатистику для задачи
                task_statistic = Statistic(
                    type=StatisticType.task,
                    data={
                        "ID": str(uuid.uuid4()),
                        "status": random.choice([s.value for s in TaskStatus]),
                        "timestamp": now_str_z,
                        "type": "task",
                        "data": {
                            "taskName": f"Generated Task {random.randint(1, 100)}",
                            "duration": random.randint(30, 120),
                            "assignedTo": f"worker_{random.randint(1, 100)}"
                        }
                    },
                    generated_at=now
                )
                db.add(task_statistic)
                db.commit()

            elif obj_type == "machine":
                # Генерируем псевдостатистику для машины
                machine_statistic = Statistic(
                    type=StatisticType.machine,
                    data={
                        "ID": str(uuid.uuid4()),
                        "status": random.choice([s.value for s in MachineStatusEnum]),
                        "timestamp": now_str_z,
                        "type": "machine",
                        "data": {
                            "machineID": f"machine_{random.randint(1, 100)}",
                            "status": random.choice([s.value for s in MachineStatusEnum]),
                            "lastMaintenance": (now - timedelta(days=random.randint(10, 30))).strftime("%Y-%m-%dT%H:%M:%SZ")
                        }
                    },
                    generated_at=now
                )
                db.add(machine_statistic)
                db.commit()

        # Изменяем статусы существующих задач (если они есть)
        tasks = db.query(Task).all()
        for task in tasks:
            if task.status == TaskStatus.planned and datetime.utcnow() > task.deadline:
                task.status = TaskStatus.overdue
            elif task.status == TaskStatus.planned:
                task.status = random.choice([TaskStatus.in_progress, TaskStatus.planned])
            elif task.status == TaskStatus.in_progress:
                task.status = random.choice([TaskStatus.completed, TaskStatus.in_progress])
            db.commit()

        # Имитация срабатывания триггеров и создание уведомлений
        triggers = db.query(Trigger).all()
        for trigger in triggers:
            if "task" in trigger.name.lower() or "task" in trigger.action.lower():
                tasks = db.query(Task).all()
                for task in tasks:
                    if task.status == TaskStatus.overdue and str(trigger.condition).find("overdue") > -1:
                        print(f"Trigger {trigger.name} activated for overdue task {task.id}")
                        new_notification = Notification(
                            message=f"Задача {task.title} (ID: {task.id}) просрочена",
                            type=NotificationType.warning,
                            recipient_id=random.choice([u.id for u in db.query(User).all()] or [1])  # Берем случайного пользователя
                        )
                        db.add(new_notification)
                        db.commit()

    except Exception as e:
        print(f"Error in generate_data: {e}")
    finally:
        db.close()

def start_generator():
    scheduler.add_job(generate_data, "interval", seconds=data_source_settings["frequency"])
    scheduler.start()

if __name__ == "__main__":
    start_generator()