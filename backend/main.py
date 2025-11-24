from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, constr
from typing import List

app = FastAPI(title="Digital Item Catalog API")

# CORS: allow frontend (Vite default is 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    id: int
    name: str
    shortDescription: str
    fullDescription: str


class Submission(BaseModel):
    name: constr(min_length=1)
    email: EmailStr
    message: constr(min_length=1, max_length=500)


class SubmissionResponse(BaseModel):
    success: bool
    message: str


ITEMS_DB: List[Item] = [
    Item(
        id=1,
        name="Wireless Mouse",
        shortDescription="Compact 2.4GHz wireless mouse",
        fullDescription="A compact 2.4GHz wireless mouse with ergonomic design, "
                        "silent clicks, and up to 12 months of battery life."
    ),
    Item(
        id=2,
        name="Mechanical Keyboard",
        shortDescription="RGB mechanical keyboard (blue switches)",
        fullDescription="Full-size mechanical keyboard with RGB backlight, blue switches, "
                        "and detachable USB-C cable for gamers and programmers."
    ),
    Item(
        id=3,
        name="Noise Cancelling Headphones",
        shortDescription="Over-ear ANC Bluetooth headphones",
        fullDescription="Over-ear Bluetooth headphones with active noise cancellation, "
                        "30 hours battery life, and fast charging support."
    ),
]


@app.get("/items", response_model=List[Item])
def list_items() -> List[Item]:
    return ITEMS_DB


@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int) -> Item:
    for item in ITEMS_DB:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@app.post("/items/{item_id}/submit", response_model=SubmissionResponse)
def submit_item_feedback(item_id: int, submission: Submission) -> SubmissionResponse:
    for item in ITEMS_DB:
        if item.id == item_id:
            print(f"Received submission for item {item_id}: {submission}")
            return SubmissionResponse(
                success=True,
                message=f"Thank you {submission.name}, your message for '{item.name}' was received."
            )

    raise HTTPException(status_code=404, detail="Item not found")


@app.get("/")
def root():
    return {"status": "ok", "message": "Digital Item Catalog API"}
