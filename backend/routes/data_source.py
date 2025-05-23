from backend.mocks.data import Role
from backend.schemas.data_source import DataSourceDeleteRequest
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.data_source import DataGenerator
from backend.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/data_source", tags=["DataSource"])


@router.get("/")
def get_data_sources(db: Session = Depends(get_db)):
    return db.query(DataGenerator).all()


@router.post("/")
def create_data_source(
        name: str,
        parameters: dict,
        created_by: int,
        db: Session = Depends(get_db)
):
    db_data_source = DataGenerator(
        name=name,
        parameters=parameters,
        created_by=created_by,
        updated_at=datetime.utcnow()
    )
    db.add(db_data_source)
    db.commit()
    db.refresh(db_data_source)
    return db_data_source


@router.get("/{data_source_id}")
def get_data_source(data_source_id: int, db: Session = Depends(get_db)):
    data_source = db.query(DataGenerator).filter(DataGenerator.id == data_source_id).first()
    if not data_source:
        raise HTTPException(status_code=404, detail="Data source not found")
    return data_source


@router.put("/{data_source_id}")
def update_data_source(
        data_source_id: int,
        name: str | None = None,
        parameters: dict | None = None,
        db: Session = Depends(get_db)
):
    data_source = db.query(DataGenerator).filter(DataGenerator.id == data_source_id).first()
    if not data_source:
        raise HTTPException(status_code=404, detail="Data source not found")

    if name:
        data_source.name = name
    if parameters:
        data_source.parameters = parameters
    data_source.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(data_source)
    return data_source


@router.delete("/")
def delete_data_sources(
    request: DataSourceDeleteRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Массовое удаление источников данных"""
    if current_user["role"] not in [Role.admin, Role.superadmin]:
        raise HTTPException(status_code=403, detail="Only admin can delete data sources")
    
    # Проверяем существование источников
    existing = db.query(DataGenerator.id).filter(DataGenerator.id.in_(request.data_source_ids)).all()
    existing_ids = {ds.id for ds in existing}
    missing_ids = set(request.data_source_ids) - existing_ids
    
    if missing_ids:
        raise HTTPException(
            status_code=404,
            detail=f"Data sources not found: {sorted(missing_ids)}"
        )
    
    # Массовое удаление
    db.query(DataGenerator).filter(DataGenerator.id.in_(request.data_source_ids)).delete(synchronize_session=False)
    db.commit()
    
    return {"message": f"Deleted {len(request.data_source_ids)} data sources"}