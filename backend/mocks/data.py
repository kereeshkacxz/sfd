from datetime import datetime
from enum import Enum

# Перечисления для ролей и статусов
class Role(str, Enum):
    worker = "worker"
    admin = "admin"
    superadmin = "superadmin"

class TaskStatus(str, Enum):
    planned = "planned"
    in_progress = "in_progress"
    completed = "completed"
    overdue = "overdue"
    evaluation = "evaluation"

class MachineStatus(str, Enum):
    idle = "idle"
    working = "working"
    minor_damage = "minor_damage"
    critical_damage = "critical_damage"

class NotificationType(str, Enum):
    task = "task"
    machine = "machine"
    system = "system"

class ObjectType(str, Enum):
    worker = "worker"
    task = "task"
    machine = "machine"

# Заглушки для данных
users = [
    {
        "id": 1,
        "login": "superadmin",
        "password_hash": "superadmin",  # Временная замена
        "email": "superadmin@example.com",
        "role": Role.superadmin,
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    },
    {
        "id": 2,
        "login": "admin1",
        "password_hash": "admin",  # Временная замена
        "email": "admin1@example.com",
        "role": Role.admin,
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    },
    {
        "id": 3,
        "login": "worker1",
        "password_hash": "worker",  # Временная замена
        "email": "worker1@example.com",
        "role": Role.worker,
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    }
]

tasks = [
    {
        "id": 1,
        "title": "Task 1",
        "description": "Description 1",
        "status": TaskStatus.planned,
        "deadline": datetime(2025, 12, 31),
        "assigned_to": 3,
        "created_by": 1,  # Добавлено
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    }
]

notifications = [
    {
        "id": 1,
        "message": "Machine idle",
        "type": NotificationType.machine,  # Добавлено
        "recipient_id": 3,  # Исправлено с user_id
        "is_read": False,  # Добавлено
        "created_at": datetime(2023, 10, 1, 12, 0)
    }
]

triggers = [
    {
        "id": 1,
        "name": "Machine idle trigger",
        "condition": {"idle_time": "> 5 min"},  # Исправлено на JSON
        "action": "Send notification",  # Исправлено с message
        "created_by": 1,  # Добавлено
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    }
]

machines = [
    {
        "id": 1,
        "name": "Machine 1",
        "status": MachineStatus.working,
        "assigned_to": 3,  # Добавлено
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    }
]

statistics = {
    "production": {
        "type": "production",
        "data": {
            "total_tasks": 150,
            "completed_tasks": 120,
            "idle_machines": 5,
            "active_workers": 20
        },
        "generated_at": datetime(2023, 1, 1, 12, 0)
    }
}

data_source_settings = {
    "frequency": 120,
    "object_types": ["task"],
    "max_objects": 100
}

data_source_objects = [
    {
        "id": 1,
        "name": "Machine Data Source",
        "parameters": {"status": "working"},
        "created_by": 1,
        "created_at": datetime(2023, 1, 1, 12, 0),
        "updated_at": datetime(2023, 1, 1, 12, 0)
    }
]