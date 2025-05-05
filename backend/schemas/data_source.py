from pydantic import BaseModel
from typing import List, Dict
from backend.mocks.data import ObjectType


class DataSourceSettings(BaseModel):
    frequency: int
    object_types: List[ObjectType]
    max_objects: int
    data_range: Dict[str, int]

class DataSourceSettingsUpdate(BaseModel):
    frequency: int | None = None
    object_types: List[ObjectType] | None = None
    max_objects: int | None = None
    data_range: Dict[str, int] | None = None

class DataSourceObjectCreate(BaseModel):
    type: ObjectType
    data: Dict[str, str]

class DataSourceObjectUpdate(BaseModel):
    type: ObjectType | None = None
    data: Dict[str, str] | None = None

class DataSourceObjectOut(BaseModel):
    id: int
    type: ObjectType
    data: Dict[str, str]