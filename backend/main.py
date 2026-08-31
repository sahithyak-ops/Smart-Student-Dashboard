from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas

from database import engine, get_db


models.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Smart Student Productivity Dashboard",
    description="API for managing student productivity, tasks and study sessions.",
    version="1.0.0"
)


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# HOME

@app.get("/")
def home():
    return {
        "message": "Smart Student Productivity Dashboard API is running!"
    }


# =========================
# SUBJECTS
# =========================

@app.post("/subjects", response_model=schemas.SubjectResponse)
def create_subject(
    subject: schemas.SubjectCreate,
    db: Session = Depends(get_db)
):

    new_subject = models.Subject(
        name=subject.name,
        total_topics=subject.total_topics
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject


@app.get("/subjects", response_model=list[schemas.SubjectResponse])
def get_subjects(
    db: Session = Depends(get_db)
):

    return db.query(models.Subject).all()


# =========================
# TASKS
# =========================

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):

    new_task = models.Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        subject_id=task.subject_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@app.get("/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(
    db: Session = Depends(get_db)
):

    return db.query(models.Task).all()


# COMPLETE / UNCOMPLETE TASK

@app.put("/tasks/{task_id}/toggle")
def toggle_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.completed = not task.completed

    db.commit()
    db.refresh(task)

    return task


# DELETE TASK

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }


@app.put("/subjects/{subject_id}/progress")
def update_subject_progress(
    subject_id: int,
    completed_topics: int,
    db: Session = Depends(get_db)
):

    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    if completed_topics < 0:
        raise HTTPException(
            status_code=400,
            detail="Completed topics cannot be negative"
        )

    if completed_topics > subject.total_topics:
        raise HTTPException(
            status_code=400,
            detail="Completed topics cannot exceed total topics"
        )

    subject.completed_topics = completed_topics

    db.commit()
    db.refresh(subject)

    return subject

from datetime import date
# =========================
# STUDY SESSIONS
# =========================

@app.post("/study-sessions")
def create_study_session(
    session: schemas.StudySessionCreate,
    db: Session = Depends(get_db)
):

    new_session = models.StudySession(
        subject_id=session.subject_id,
        duration=session.duration,
        date=session.date
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


@app.get("/study-sessions")
def get_study_sessions(
    db: Session = Depends(get_db)
):

    return db.query(models.StudySession).order_by(
        models.StudySession.date.desc()
    ).all()


@app.get("/study-sessions/total")
def get_total_study_time(
    db: Session = Depends(get_db)
):

    sessions = db.query(models.StudySession).all()

    total_minutes = sum(
        session.duration
        for session in sessions
    )

    return {
        "total_minutes": total_minutes
    }
# =========================
# ANALYTICS
# =========================

@app.get("/analytics/weekly-study")
def weekly_study(
    db: Session = Depends(get_db)
):
    from datetime import date, timedelta

    today = date.today()
    start_date = today - timedelta(days=6)

    sessions = db.query(models.StudySession).filter(
        models.StudySession.date >= start_date
    ).all()

    result = []

    for i in range(7):

        current_date = start_date + timedelta(days=i)

        total_minutes = sum(
            session.duration
            for session in sessions
            if session.date == current_date
        )

        result.append({
            "date": current_date.isoformat(),
            "day": current_date.strftime("%a"),
            "minutes": round(total_minutes, 2)
        })

    return result


@app.get("/analytics/tasks")
def task_analytics(
    db: Session = Depends(get_db)
):

    total_tasks = db.query(models.Task).count()

    completed_tasks = db.query(models.Task).filter(
        models.Task.completed == True
    ).count()

    pending_tasks = total_tasks - completed_tasks

    return {
        "total": total_tasks,
        "completed": completed_tasks,
        "pending": pending_tasks
    }


@app.get("/analytics/subjects")
def subject_analytics(
    db: Session = Depends(get_db)
):

    subjects = db.query(models.Subject).all()

    result = []

    for subject in subjects:

        progress = 0

        if subject.total_topics > 0:
            progress = (
                subject.completed_topics /
                subject.total_topics
            ) * 100

        result.append({
            "name": subject.name,
            "progress": round(progress, 1),
            "completed_topics": subject.completed_topics,
            "total_topics": subject.total_topics
        })

    return result

# =========================
# PRODUCTIVITY STREAK
# =========================

@app.get("/analytics/streak")
def get_streak(
    db: Session = Depends(get_db)
):
    from datetime import date, timedelta

    sessions = db.query(models.StudySession).all()

    study_dates = {
        session.date
        for session in sessions
    }

    today = date.today()

    streak = 0
    current_date = today

    while current_date in study_dates:

        streak += 1

        current_date -= timedelta(days=1)

    return {
        "streak": streak
    }
