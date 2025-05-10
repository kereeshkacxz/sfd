from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.statistic import Statistic, StatisticType
from backend.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])


@router.get("/")
def get_statistics(type: StatisticType | None = None, db: Session = Depends(get_db)):
    query = db.query(Statistic)
    if type:
        query = query.filter(Statistic.type == type)
    return query.all()


@router.post("/")
def create_statistic(
        type: StatisticType,
        data: dict,
        db: Session = Depends(get_db)
):
    db_statistic = Statistic(
        type=type,
        data=data
    )
    db.add(db_statistic)
    db.commit()
    db.refresh(db_statistic)
    return db_statistic


@router.get("/{type}")
def get_statistic(type: StatisticType, db: Session = Depends(get_db)):
    statistic = db.query(Statistic).filter(Statistic.type == type).first()
    if not statistic:
        raise HTTPException(status_code=404, detail="Statistic not found")
    return statistic


@router.put("/{type}")
def update_statistic(
        type: StatisticType,
        data: dict,
        db: Session = Depends(get_db)
):
    statistic = db.query(Statistic).filter(Statistic.type == type).first()
    if not statistic:
        raise HTTPException(status_code=404, detail="Statistic not found")

    statistic.data = data
    db.commit()
    db.refresh(statistic)
    return statistic


@router.delete("/{type}")
def delete_statistic(type: StatisticType, db: Session = Depends(get_db)):
    statistic = db.query(Statistic).filter(Statistic.type == type).first()
    if not statistic:
        raise HTTPException(status_code=404, detail="Statistic not found")
    db.delete(statistic)
    db.commit()
    return {"message": "Statistic deleted successfully"}