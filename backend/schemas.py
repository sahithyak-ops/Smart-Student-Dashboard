from pydantic import BaseModel
from datetime import date
from typing import Optional


class SubjectCreate(BaseModel):
    name: str
    total_topics: int = 0


class SubjectResponse(BaseModel):
    id: int
    name: str
    total_topics: int
    completed_topics: int

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "Medium"
    due_date: Optional[date] = None
    subject_id: Optional[int] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    due_date: Optional[date]
    completed: bool
    subject_id: Optional[int]

    class Config:
        from_attributes = True


class StudySessionCreate(BaseModel):
    subject_id: Optional[int] = None
    duration: float
    date: date