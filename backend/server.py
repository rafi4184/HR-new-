"""
HR — The Mediator API (FastAPI port of the original Express + SQLite server).

Endpoints:
  POST /api/requests/{type}         Submit a request (airport, hotel, government, program)
  GET  /api/requests/track          Track a request by ticket + name + dob
  POST /api/requests/{id}/pay       Simulate paying a fee for an approved request
  POST /api/staff/login             Staff login -> JWT
  GET  /api/staff/requests          List all requests (staff only)
  POST /api/staff/requests/{id}/approve  Approve (optionally with a fee)
"""

import os
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Optional, Literal

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ValidationError, field_validator
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("hr-mediator")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

JWT_SECRET = os.environ["JWT_SECRET"]
STAFF_USERNAME = os.environ["STAFF_USERNAME"]
STAFF_PASSWORD = os.environ["STAFF_PASSWORD"]
STAFF_PASSWORD_HASH = bcrypt.hashpw(STAFF_PASSWORD.encode("utf-8"), bcrypt.gensalt(10))

TICKET_START = 100000  # ticket ids look like HRM-100001, HRM-100002, ...

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]
requests_col = db["requests"]
counters_col = db["counters"]


async def next_request_id() -> int:
    doc = await counters_col.find_one_and_update(
        {"_id": "requests"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    seq = int(doc["seq"])
    return TICKET_START + seq


def ticket_of(request_id: int) -> str:
    return f"HRM-{request_id}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Models — mirror the Zod schemas from the original server
# ---------------------------------------------------------------------------
class IdentityFields(BaseModel):
    name: str = Field(min_length=1)
    dob: str = Field(min_length=1)
    phone: str = Field(min_length=1)
    email: EmailStr

    @field_validator("name", "dob", "phone", mode="before")
    @classmethod
    def strip_strings(cls, v: Any) -> Any:
        if isinstance(v, str):
            return v.strip()
        return v


class AirportRequest(IdentityFields):
    flight: str = Field(min_length=1)
    airport: str = Field(min_length=1)
    date: str = Field(min_length=1)
    time: str = ""
    purpose: str = Field(min_length=1)
    travelers: int = 1
    notes: str = ""


class HotelRequest(IdentityFields):
    city: str = Field(min_length=1)
    tier: str = "Standard"
    checkin: str = Field(min_length=1)
    checkout: str = Field(min_length=1)
    car: str = ""
    pickup: str = ""
    notes: str = ""


class GovernmentRequest(IdentityFields):
    service: str = Field(min_length=1)
    urgency: str = "Standard"
    description: str = Field(min_length=1)


class ProgramRequest(IdentityFields):
    program: Literal["study", "media", "gulf"]
    batch: str = ""
    background: str = ""
    notes: str = ""


REQUEST_SCHEMAS: dict[str, type[IdentityFields]] = {
    "airport": AirportRequest,
    "hotel": HotelRequest,
    "government": GovernmentRequest,
    "program": ProgramRequest,
}

TYPE_LABELS: dict[str, str] = {
    "airport": "Airport VIP",
    "hotel": "Hotel & Car",
    "government": "Government Request",
    "program": "Program Enrollment",
}

PROGRAM_LABELS: dict[str, str] = {
    "study": "Study Abroad Consultation",
    "media": "Media & Public Speaking Academy",
    "gulf": "Gulf & Overseas Employment",
}


def summary_for(type_: str, fields: dict[str, Any]) -> str:
    if type_ == "airport":
        return f"{fields['flight']} arriving {fields['date']}"
    if type_ == "hotel":
        return f"{fields['city']}, {fields['checkin']} → {fields['checkout']}"
    if type_ == "government":
        return fields["service"]
    if type_ == "program":
        return PROGRAM_LABELS.get(fields["program"], fields["program"])
    return ""


class StaffLogin(BaseModel):
    username: str
    password: str


class ApproveBody(BaseModel):
    fee: Optional[float | int | str] = None


class PayBody(BaseModel):
    method: Literal["bkash", "nagad", "card"]


# ---------------------------------------------------------------------------
# Serialization
# ---------------------------------------------------------------------------
def serialize_request(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["_id"],
        "ticket": row["ticket"],
        "type": row["type"],
        "summary": row["summary"],
        "name": row["name"],
        "dob": row["dob"],
        "phone": row["phone"],
        "email": row["email"],
        "status": row["status"],
        "fee": row.get("fee"),
        "serviceLabel": row.get("service_label"),
        "paymentMethod": row.get("payment_method"),
        "details": row.get("details", {}),
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
security = HTTPBearer(auto_error=False)


def sign_staff_token() -> str:
    payload = {
        "role": "staff",
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def require_staff(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict[str, Any]:
    if not creds or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Sign in as staff to continue.")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Your session has expired. Sign in again.")
    if payload.get("role") != "staff":
        raise HTTPException(status_code=401, detail="Your session has expired. Sign in again.")
    return payload


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="HR — The Mediator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, bool]:
    return {"ok": True}


# ----- Public request routes -----------------------------------------------
@app.post("/api/requests/{type_}", status_code=201)
async def submit_request(type_: str, payload: dict[str, Any]) -> dict[str, Any]:
    schema = REQUEST_SCHEMAS.get(type_)
    if schema is None:
        raise HTTPException(status_code=404, detail="Unknown request type.")

    try:
        parsed = schema.model_validate(payload)
    except ValidationError as err:
        first_msg = err.errors()[0].get("msg") if err.errors() else "Invalid submission."
        raise HTTPException(status_code=400, detail=first_msg)

    fields = parsed.model_dump()
    identity_keys = {"name", "dob", "phone", "email"}
    rest = {k: v for k, v in fields.items() if k not in identity_keys}

    request_id = await next_request_id()
    now = now_iso()
    doc = {
        "_id": request_id,
        "ticket": ticket_of(request_id),
        "type": TYPE_LABELS[type_],
        "summary": summary_for(type_, fields),
        "name": fields["name"],
        "dob": fields["dob"],
        "phone": fields["phone"],
        "email": fields["email"],
        "status": "received",
        "fee": None,
        "service_label": fields["service"] if type_ == "government" else None,
        "payment_method": None,
        "details": rest,
        "created_at": now,
        "updated_at": now,
    }
    await requests_col.insert_one(doc)
    return serialize_request(doc)


@app.get("/api/requests/track")
async def track_request(
    ticket: str = Query(""),
    name: str = Query(""),
    dob: str = Query(""),
) -> dict[str, Any]:
    ticket_u = ticket.strip().upper()
    name_l = name.strip().lower()
    dob_v = dob.strip()

    if not ticket_u or not name_l or not dob_v:
        raise HTTPException(
            status_code=400,
            detail="Ticket number, name, and date of birth are all required.",
        )

    row = await requests_col.find_one({"ticket": ticket_u})
    if (
        not row
        or row["name"].strip().lower() != name_l
        or row["dob"] != dob_v
    ):
        raise HTTPException(
            status_code=404,
            detail=(
                "No matching request. Double-check the ticket number, "
                "name, and date of birth."
            ),
        )
    return serialize_request(row)


@app.post("/api/requests/{request_id}/pay")
async def pay_request(request_id: int, body: PayBody) -> dict[str, Any]:
    row = await requests_col.find_one({"_id": request_id})
    if not row:
        raise HTTPException(status_code=404, detail="Request not found.")
    if row.get("status") != "approved" or row.get("fee") is None:
        raise HTTPException(status_code=409, detail="This request isn't awaiting payment.")

    await requests_col.update_one(
        {"_id": request_id},
        {
            "$set": {
                "status": "paid",
                "payment_method": body.method,
                "updated_at": now_iso(),
            }
        },
    )
    updated = await requests_col.find_one({"_id": request_id})
    return serialize_request(updated)


# ----- Staff routes --------------------------------------------------------
@app.post("/api/staff/login")
async def staff_login(body: StaffLogin) -> dict[str, str]:
    if (
        body.username != STAFF_USERNAME
        or not bcrypt.checkpw(body.password.encode("utf-8"), STAFF_PASSWORD_HASH)
    ):
        raise HTTPException(status_code=401, detail="Incorrect username or password.")
    return {"token": sign_staff_token()}


@app.get("/api/staff/requests")
async def staff_list_requests(_: dict = Depends(require_staff)) -> list[dict[str, Any]]:
    rows = await requests_col.find({}).sort("_id", -1).to_list(length=1000)
    return [serialize_request(r) for r in rows]


@app.post("/api/staff/requests/{request_id}/approve")
async def staff_approve(
    request_id: int,
    body: ApproveBody,
    _: dict = Depends(require_staff),
) -> dict[str, Any]:
    row = await requests_col.find_one({"_id": request_id})
    if not row:
        raise HTTPException(status_code=404, detail="Request not found.")
    if row.get("status") != "received":
        raise HTTPException(status_code=409, detail="This request has already been reviewed.")

    fee: Optional[int] = None
    if body.fee is not None and body.fee != "":
        try:
            fee = max(0, round(float(body.fee)))
        except (TypeError, ValueError):
            raise HTTPException(status_code=400, detail="Fee must be a number.")

    await requests_col.update_one(
        {"_id": request_id},
        {"$set": {"status": "approved", "fee": fee, "updated_at": now_iso()}},
    )
    updated = await requests_col.find_one({"_id": request_id})
    return serialize_request(updated)


# ----- Fallback for unknown /api routes -----------------------------------
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def api_not_found(path: str, request: Request) -> None:
    raise HTTPException(status_code=404, detail="Not found.")


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    mongo_client.close()
