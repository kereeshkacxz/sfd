from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from backend.database import get_db, SessionLocal
from backend.models.task import Task, TaskStatus
from backend.models.notification import Notification, NotificationType
from backend.models.machine import Machine, MachineStatus
from backend.models.user import User
from backend.models.data_source import DataGenerator
from backend.mocks.data import Role, data_source_settings
from datetime import datetime
from models import Trigger

scheduler = AsyncIOScheduler()

def generate_data():
    db: Session = SessionLocal()
    try:
        # Получаем настройки
        frequency = data_source_settings["frequency"]
        object_types = data_source_settings["object_types"]
        max_objects = data_source_settings["max_objects"]

        # Проверяем, не превышает ли количество объектов максимум
        if db.query(DataGenerator).count() >= max_objects:
            return

        # Генерируем данные для каждого типа объекта
        for obj_type in object_types:
            if obj_type == "task":
                new_task = Task(
                    title=f"Generated Task {db.query(Task).count() + 1}",
                    description="Automatically generated task",
                    status=TaskStatus.planned,
                    deadline=datetime(2025, 12, 31),
                    assigned_to=3,  # worker1
                    created_by=1    # superadmin или другой пользователь
                )
                db.add(new_task)
                db.commit()
                db.refresh(new_task)

                db_data_source = DataGenerator(
                    name=f"Task_{new_task.id}",
                    parameters={"type": obj_type, "data": {"id": new_task.id}},
                    created_by=1
                )
                db.add(db_data_source)
                db.commit()

            elif obj_type == "worker":
                new_worker = User(
                    login=f"worker{db.query(User).count() + 1}",
                    password_hash=f"generated_pass{db.query(User).count() + 1}",
                    email=f"worker{db.query(User).count() + 1}@example.com",
                    role=Role.worker
                )
                db.add(new_worker)
                db.commit()
                db.refresh(new_worker)

                db_data_source = DataGenerator(
                    name=f"Worker_{new_worker.id}",
                    parameters={"type": obj_type, "data": {"id": new_worker.id}},
                    created_by=1
                )
                db.add(db_data_source)
                db.commit()

            elif obj_type == "machine":
                new_machine = Machine(
                    name=f"Machine {db.query(Machine).count() + 1}",
                    status=MachineStatus.working
                )
                db.add(new_machine)
                db.commit()
                db.refresh(new_machine)

                db_data_source = DataGenerator(
                    name=f"Machine_{new_machine.id}",
                    parameters={"type": obj_type, "data": {"id": new_machine.id}},
                    created_by=1
                )
                db.add(db_data_source)
                db.commit()

        # Проверяем триггеры и создаём уведомления
        triggers = db.query(Trigger).all()  # Используем модель Trigger
        for trigger in triggers:
            # Проверяем триггер на основе условия (пример для машины)
            if "machine" in trigger.name.lower() or "machine" in trigger.action.lower():  # Временная замена type
                for machine in db.query(Machine).all():
                    if machine.status == MachineStatus.idle and str(trigger.condition).find("idle") > -1:  # Простая проверка условия
                        new_notification = Notification(
                            message=f"Machine {machine.name} idle for too long",
                            type=NotificationType.machine,
                            recipient_id=3  # worker1
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