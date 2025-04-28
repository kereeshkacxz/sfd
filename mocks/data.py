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

class ObjectType(str, Enum):
    worker = "worker"
    task = "task"
    machine = "machine"

# Заглушки для данных
users = [
    {"id": 1, "login": "superadmin", "password": "superadmin_pass", "email": "superadmin@example.com", "role": Role.superadmin},
    {"id": 2, "login": "admin1", "password": "admin_pass", "email": "admin1@example.com", "role": Role.admin},
    {"id": 3, "login": "worker1", "password": "worker_pass", "email": "worker1@example.com", "role": Role.worker}
]

tasks = [
    {"id": 1, "title": "Task 1", "description": "Description 1", "status": TaskStatus.planned, "deadline": datetime(2025, 12, 31), "assigned_to": 3}
]

notifications = [
    {"id": 1, "message": "Machine idle", "created_at": datetime(2023, 10, 1, 12, 0), "user_id": 3}
]

triggers = [
    {"id": 1, "condition": "Machine idle > 5 min", "message": "Machine idle", "type": "machine", "target_id": 1}
]

machines = [
    {"id": 1, "name": "Machine 1", "status": MachineStatus.working}
]

statistics = {
    "production": {
        "total_tasks": 150,
        "completed_tasks": 120,
        "idle_machines": 5,
        "active_workers": 20
    }
}


data_source_settings = {
    "frequency": 60,
    "object_types": ["worker", "task", "machine"],
    "max_objects": 100,
    "data_range": {"min_value": 0, "max_value": 100}
}

data_source_objects = [
    {"id": 1, "type": "machine", "data": {"name": "Machine 1", "status": "working"}}
]