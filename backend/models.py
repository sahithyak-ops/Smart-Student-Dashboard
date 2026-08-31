from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Float
from sqlalchemy.orm import relationship

from database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    total_topics = Column(Integer, default=0)
    completed_topics = Column(Integer, default=0)

    tasks = relationship("Task", back_populates="subject")
    study_sessions = relationship("StudySession", back_populates="subject")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(String, default="Medium")
    due_date = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)

    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)

    subject = relationship("Subject", back_populates="tasks")


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    duration = Column(Float, nullable=False)
    date = Column(Date, nullable=False)

    subject = relationship("Subject", back_populates="study_sessions")