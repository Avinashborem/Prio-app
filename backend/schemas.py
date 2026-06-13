from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SubtaskCreate(BaseModel):
    title: str

class SubtaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    task_id: int

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "medium"
    category: Optional[str] = "personal"
    deadline: Optional[str] = None
    completed: Optional[bool] = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    subtasks: List[SubtaskResponse] = []

    class Config:
        from_attributes = True