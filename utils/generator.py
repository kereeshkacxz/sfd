from apscheduler.schedulers.asyncio import AsyncIOScheduler
from mocks.data import (
    data_source_settings, data_source_objects, tasks, notifications, machines, users, triggers, Role
)
from datetime import datetime

scheduler = AsyncIOScheduler()


def generate_data():
    # Получаем настройки
    frequency = data_source_settings["frequency"]
    object_types = data_source_settings["object_types"]
    max_objects = data_source_settings["max_objects"]

    # Проверяем, не превышает ли количество объектов максимум
    if len(data_source_objects) >= max_objects:
        return

    # Генерируем данные для каждого типа объекта
    for obj_type in object_types:
        if obj_type == "task":
            new_task = {
                "id": max(t["id"] for t in tasks) + 1,
                "title": f"Generated Task {len(tasks) + 1}",
                "description": "Automatically generated task",
                "status": "planned",
                "deadline": datetime(2025, 12, 31),
                "assigned_to": 3  # worker1
            }
            tasks.append(new_task)
            data_source_objects.append({
                "id": max(o["id"] for o in data_source_objects) + 1,
                "type": obj_type,
                "data": new_task
            })
        elif obj_type == "worker":
            new_worker = {
                "id": max(u["id"] for u in users) + 1,
                "login": f"worker{len(users) + 1}",
                "password": "generated_pass",
                "email": f"worker{len(users) + 1}@example.com",
                "role": Role.worker
            }
            users.append(new_worker)
            data_source_objects.append({
                "id": max(o["id"] for o in data_source_objects) + 1,
                "type": obj_type,
                "data": new_worker
            })
        elif obj_type == "machine":
            new_machine = {
                "id": max(m["id"] for m in machines) + 1,
                "name": f"Machine {len(machines) + 1}",
                "status": "working"
            }
            machines.append(new_machine)
            data_source_objects.append({
                "id": max(o["id"] for o in data_source_objects) + 1,
                "type": obj_type,
                "data": new_machine
            })

    # Проверяем триггеры и создаём уведомления
    for trigger in triggers:
        if trigger["type"] == "machine":
            for machine in machines:
                if machine["status"] == "idle" and trigger["condition"] == "Machine idle > 5 min":
                    new_notification = {
                        "id": max(n["id"] for n in notifications) + 1,
                        "message": trigger["message"],
                        "created_at": datetime.now(),
                        "user_id": 3  # worker1
                    }
                    notifications.append(new_notification)


def start_generator():
    scheduler.add_job(generate_data, "interval", seconds=data_source_settings["frequency"])
    scheduler.start()