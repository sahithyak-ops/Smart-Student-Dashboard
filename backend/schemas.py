from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional


class SubjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    total_topics: int = Field(default=0, ge=0)

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("Subject name cannot be blank")
        return value


class SubjectUpdate(SubjectCreate):
    completed_topics: int = Field(default=0, ge=0)


class SubjectResponse(BaseModel):
    id: int
    name: str
    total_topics: int
    completed_topics: int

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    priority: str = "Medium"
    due_date: Optional[date] = None
    subject_id: Optional[int] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("Task title cannot be blank")
        return value

    @field_validator("priority")
    @classmethod
    def priority_must_be_supported(cls, value):
        if value not in {"Low", "Medium", "High"}:
            raise ValueError("Priority must be Low, Medium, or High")
        return value


class TaskUpdate(TaskCreate):
    completed: bool = False


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
