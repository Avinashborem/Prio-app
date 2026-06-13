from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(
    search: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    completed: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Task)
    if search:
        query = query.filter(models.Task.title.contains(search))
    if category and category != "all":
        query = query.filter(models.Task.category == category)
    if priority and priority != "all":
        query = query.filter(models.Task.priority == priority)
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
    return query.order_by(models.Task.created_at.desc()).all()

@router.post("/", response_model=schemas.TaskResponse, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}

@router.get("/stats/summary")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(models.Task).count()
    completed = db.query(models.Task).filter(models.Task.completed == True).count()
    by_category = {cat: db.query(models.Task).filter(models.Task.category == cat).count() for cat in ["work", "personal", "study"]}
    by_priority = {pri: db.query(models.Task).filter(models.Task.priority == pri).count() for pri in ["high", "medium", "low"]}
    return {
        "total": total,
        "completed": completed,
        "pending": total - completed,
        "completion_rate": round((completed / total * 100) if total > 0 else 0, 1),
        "by_category": by_category,
        "by_priority": by_priority
    }

# ── Subtask routes ──

@router.post("/{task_id}/subtasks", response_model=schemas.SubtaskResponse, status_code=201)
def add_subtask(task_id: int, subtask: schemas.SubtaskCreate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_subtask = models.Subtask(title=subtask.title, task_id=task_id)
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask

@router.put("/{task_id}/subtasks/{subtask_id}", response_model=schemas.SubtaskResponse)
def toggle_subtask(task_id: int, subtask_id: int, db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(
        models.Subtask.id == subtask_id,
        models.Subtask.task_id == task_id
    ).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    subtask.completed = not subtask.completed
    db.commit()
    db.refresh(subtask)
    return subtask

@router.delete("/{task_id}/subtasks/{subtask_id}")
def delete_subtask(task_id: int, subtask_id: int, db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(
        models.Subtask.id == subtask_id,
        models.Subtask.task_id == task_id
    ).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    db.delete(subtask)
    db.commit()
    return {"message": "Subtask deleted"}