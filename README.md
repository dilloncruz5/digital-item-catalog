# Digital Item Catalog Viewer

Intern technical task – simple digital item catalog viewer.

## Tech Stack

- **Frontend:** React + Vite + TypeScript, CSS
- **Backend:** FastAPI (Python)

---

## How to Run

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn[standard] pydantic[email]
uvicorn main:app --reload --port 8000
