import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(tmp_path, monkeypatch):
    """Load the app against a fresh SQLite database for every test."""
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{tmp_path / 'test.db'}")
    monkeypatch.syspath_prepend(str(Path(__file__).resolve().parents[1]))
    for module in ("main", "database", "models", "schemas"):
        sys.modules.pop(module, None)
    import main
    with TestClient(main.app) as test_client:
        yield test_client


def create_subject(client, name="Mathematics", topics=8):
    response = client.post("/subjects", json={"name": name, "total_topics": topics})
    assert response.status_code == 200
    return response.json()


def create_task(client, subject_id=None):
    return client.post("/tasks", json={
        "title": "Revise chapter one", "description": "Notes and examples",
        "priority": "High", "due_date": "2026-11-01", "subject_id": subject_id,
    })


def test_subject_create_edit_and_blank_name_rejected(client):
    subject = create_subject(client)
    updated = client.put(f"/subjects/{subject['id']}", json={
        "name": "Advanced Mathematics", "total_topics": 10, "completed_topics": 3,
    })
    assert updated.status_code == 200
    assert updated.json()["name"] == "Advanced Mathematics"
    assert client.post("/subjects", json={"name": "   ", "total_topics": 0}).status_code == 422


def test_subject_delete_is_blocked_when_history_exists(client):
    subject = create_subject(client)
    assert create_task(client, subject["id"]).status_code == 200
    dependencies = client.get(f"/subjects/{subject['id']}/dependencies")
    assert dependencies.json() == {"tasks": 1, "study_sessions": 0}
    deleted = client.delete(f"/subjects/{subject['id']}")
    assert deleted.status_code == 409
    assert client.get("/subjects").json()[0]["id"] == subject["id"]


def test_subject_without_dependencies_can_be_deleted(client):
    subject = create_subject(client)
    assert client.delete(f"/subjects/{subject['id']}").status_code == 200
    assert client.get("/subjects").json() == []


def test_task_crud_completion_and_persistence(client):
    subject = create_subject(client)
    created = create_task(client, subject["id"])
    assert created.status_code == 200
    task = created.json()
    updated = client.put(f"/tasks/{task['id']}", json={
        "title": "Revise updated chapter", "description": "Updated notes",
        "priority": "Medium", "due_date": "2026-11-02", "subject_id": subject["id"], "completed": False,
    })
    assert updated.status_code == 200
    assert client.put(f"/tasks/{task['id']}/toggle").json()["completed"] is True
    assert client.get("/tasks").json()[0]["title"] == "Revise updated chapter"
    assert client.delete(f"/tasks/{task['id']}").status_code == 200
    assert client.get("/tasks").json() == []


def test_tasks_and_sessions_require_real_subjects(client):
    assert create_task(client, 999).status_code == 404
    response = client.post("/study-sessions", json={"subject_id": 999, "duration": 20, "date": "2026-10-28"})
    assert response.status_code == 404
