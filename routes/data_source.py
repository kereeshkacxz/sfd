from fastapi import APIRouter, Depends, HTTPException
from mocks.data import data_source_settings, data_source_objects, Role
from schemas.data_source import (
    DataSourceSettings,
    DataSourceSettingsUpdate,
    DataSourceObjectCreate,
    DataSourceObjectUpdate,
    DataSourceObjectOut
)
from utils.auth import get_current_user

router = APIRouter(prefix="/api/data-source", tags=["data-source"])


@router.get("/settings", response_model=DataSourceSettings)
def get_settings(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view data source settings")
    return data_source_settings


@router.put("/settings", response_model=DataSourceSettings)
def update_settings(settings: DataSourceSettingsUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can update data source settings")

    if settings.frequency is not None:
        data_source_settings["frequency"] = settings.frequency
    if settings.object_types is not None:
        data_source_settings["object_types"] = settings.object_types
    if settings.max_objects is not None:
        data_source_settings["max_objects"] = settings.max_objects
    if settings.data_range is not None:
        data_source_settings["data_range"] = settings.data_range

    return data_source_settings


@router.post("/objects", response_model=DataSourceObjectOut)
def create_object(obj: DataSourceObjectCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can create data source objects")

    new_object = {
        "id": max(o["id"] for o in data_source_objects) + 1,
        "type": obj.type,
        "data": obj.data
    }
    data_source_objects.append(new_object)
    return new_object


@router.get("/objects", response_model=list[DataSourceObjectOut])
def get_objects(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can view data source objects")
    return data_source_objects


@router.put("/objects/{id}", response_model=DataSourceObjectOut)
def update_object(id: int, obj_update: DataSourceObjectUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can update data source objects")

    obj = next((o for o in data_source_objects if o["id"] == id), None)
    if not obj:
        raise HTTPException(status_code=404, detail="Data source object not found")

    if obj_update.type is not None:
        obj["type"] = obj_update.type
    if obj_update.data is not None:
        obj["data"] = obj_update.data

    return obj


@router.delete("/objects/{id}")
def delete_object(id: int, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Only admin can delete data source objects")

    obj = next((o for o in data_source_objects if o["id"] == id), None)
    if not obj:
        raise HTTPException(status_code=404, detail="Data source object not found")

    data_source_objects.remove(obj)
    return {"message": "Data source object deleted successfully"}