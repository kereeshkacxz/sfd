from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from backend.database import get_db, SessionLocal
from backend.models.task import Task, TaskStatus
from backend.models.notification import Notification, NotificationType
from backend.models.user import User
from backend.models.data_source import DataGenerator
from backend.mocks.data import Role, data_source_settings
from datetime import datetime, timedelta
from backend.models import Trigger
import random

scheduler = AsyncIOScheduler()

def generate_data():
    db: Session = SessionLocal()
    try:
        # Получаем настройки
        frequency = data_source_settings["frequency"]
        max_objects = data_source_settings["max_objects"]

        # Проверяем, не превышает ли количество задач максимум
        if db.query(Task).count() >= max_objects:
            return

        # Генерируем новую задачу для случайного сотрудника
        workers = db.query(User).filter(User.role == Role.worker).all()
        if not workers:
            return

        worker = random.choice(workers)
        new_task = Task(
            title=f"Сгенерированное задание {db.query(Task).count() + 1}",
            description="Автоматически сгенерированное задание",
            status=TaskStatus.planned,
            deadline=datetime.utcnow() + timedelta(days=7),  # Срок через 7 дней
            assigned_to=worker.id,
            created_by=3  # superadmin или другой пользователь
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        # Создаём соответствующую запись DataGenerator
        db_data_source = DataGenerator(
            name=f"Task_{new_task.id}",
            parameters={"type": "task", "data": {"id": new_task.id}},
            created_by=1
        )
        db.add(db_data_source)
        db.commit()

        # Изменяем статусы существующих задач
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
            # Проверяем триггер на основе условия (для задач)
            if "task" in trigger.name.lower() or "task" in trigger.action.lower():
                tasks = db.query(Task).all()
                for task in tasks:
                    if task.status == TaskStatus.overdue and str(trigger.condition).find("overdue") > -1:
                        print(f"Trigger {trigger.name} activated for overdue task {task.id}")
                        # Создаём уведомление после срабатывания триггера
                        new_notification = Notification(
                            message=f"Задача {task.title} (ID: {task.id}) просрочена",
                            type=NotificationType.warning,  # Тип уведомления
                            recipient_id=task.assigned_to  # Уведомление отправляется исполнителю задачи
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