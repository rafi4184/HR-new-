"""
HR — The Mediator API.

Public routes: submit / track / pay a request.
Auth routes:   /api/auth/login (returns JWT with role)
Staff routes:  approve, reject, delete pending requests (staff or admin).
Admin routes:  create/list/delete staff users.
"""

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Optional, Literal

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Query, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ValidationError, field_validator
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from emails import approval_email, rejection_email, send_html  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("hr-mediator")

# --- Config ----------------------------------------------------------------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

JWT_SECRET = os.environ["JWT_SECRET"]
BOOTSTRAP_ADMIN_USERNAME = os.environ.get("STAFF_USERNAME", "admin")
BOOTSTRAP_ADMIN_PASSWORD = os.environ.get("STAFF_PASSWORD", "admin@2026")

TICKET_START = 100000

# --- DB --------------------------------------------------------------------
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]
requests_col = db["requests"]
counters_col = db["counters"]
users_col = db["users"]
audit_col = db["audit_log"]


async def log_audit(actor: dict[str, Any], action: str, target: dict[str, Any], meta: Optional[dict] = None) -> None:
    """Fire-and-forget audit line. Never raises."""
    try:
        entry = {
            "_id": str(uuid.uuid4()),
            "actor_id": actor.get("_id"),
            "actor_username": actor.get("username"),
            "actor_role": actor.get("role"),
            "action": action,  # approve | reject | delete_request | create_user | delete_user | password_reset
            "target_type": target.get("type"),
            "target_id": str(target.get("id")),
            "target_label": target.get("label"),
            "meta": meta or {},
            "at": now_iso(),
        }
        await audit_col.insert_one(entry)
    except Exception as e:  # noqa: BLE001
        logger.warning("audit-log write failed: %s", e)


async def next_request_id() -> int:
    doc = await counters_col.find_one_and_update(
        {"_id": "requests"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    return TICKET_START + int(doc["seq"])


def ticket_of(request_id: int) -> str:
    return f"HRM-{request_id}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(10)).decode("utf-8")


def check_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:  # noqa: BLE001
        return False


# --- Models — client-side request schemas mirror the original app ----------
class IdentityFields(BaseModel):
    name: str = Field(min_length=1)
    dob: str = Field(min_length=1)
    phone: str = Field(min_length=1)
    email: EmailStr

    @field_validator("name", "dob", "phone", mode="before")
    @classmethod
    def strip_strings(cls, v: Any) -> Any:
        return v.strip() if isinstance(v, str) else v


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

TYPE_LABELS = {
    "airport": "Airport VIP",
    "hotel": "Hotel & Car",
    "government": "Government Request",
    "program": "Program Enrollment",
}

PROGRAM_LABELS = {
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


class LoginBody(BaseModel):
    username: str
    password: str


class ApproveBody(BaseModel):
    fee: Optional[float | int | str] = None


class RejectBody(BaseModel):
    reason: str = Field(default="", max_length=800)


class PayBody(BaseModel):
    method: Literal["bkash", "nagad", "card"]


class CreateUserBody(BaseModel):
    username: str = Field(min_length=3, max_length=40)
    password: str = Field(min_length=6, max_length=200)
    name: str = Field(min_length=1, max_length=120)
    role: Literal["admin", "staff"] = "staff"


class ChangePasswordBody(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=200)


# --- Serializers -----------------------------------------------------------
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
        "rejectionReason": row.get("rejection_reason"),
        "details": row.get("details", {}),
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def serialize_user(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["_id"],
        "username": row["username"],
        "name": row.get("name", ""),
        "role": row["role"],
        "mustResetPassword": bool(row.get("must_reset_password", False)),
        "createdAt": row.get("created_at"),
        "createdBy": row.get("created_by"),
    }


def serialize_audit(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["_id"],
        "actorId": row.get("actor_id"),
        "actorUsername": row.get("actor_username"),
        "actorRole": row.get("actor_role"),
        "action": row.get("action"),
        "targetType": row.get("target_type"),
        "targetId": row.get("target_id"),
        "targetLabel": row.get("target_label"),
        "meta": row.get("meta", {}),
        "at": row.get("at"),
    }


# --- Auth helpers ----------------------------------------------------------
security = HTTPBearer(auto_error=False)


def sign_token(user: dict[str, Any]) -> str:
    payload = {
        "sub": user["_id"],
        "username": user["username"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


async def current_user(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict[str, Any]:
    if not creds or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Sign in to continue.")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Your session has expired. Sign in again.")
    user = await users_col.find_one({"_id": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=401, detail="Your account no longer exists.")
    return user


def require_admin(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    return user


# --- App -------------------------------------------------------------------
app = FastAPI(title="HR — The Mediator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def seed_bootstrap_admin() -> None:
    # Migrate any legacy admin doc, then ensure a bootstrap admin exists.
    existing = await users_col.find_one({"username": BOOTSTRAP_ADMIN_USERNAME})
    if existing:
        if existing.get("role") != "admin":
            await users_col.update_one(
                {"_id": existing["_id"]}, {"$set": {"role": "admin"}}
            )
            logger.info("bootstrap admin '%s' role upgraded to admin", BOOTSTRAP_ADMIN_USERNAME)
        return
    admin = {
        "_id": str(uuid.uuid4()),
        "username": BOOTSTRAP_ADMIN_USERNAME,
        "password_hash": hash_password(BOOTSTRAP_ADMIN_PASSWORD),
        "name": "Desk Administrator",
        "role": "admin",
        "must_reset_password": False,
        "created_at": now_iso(),
        "created_by": "system",
    }
    await users_col.insert_one(admin)
    logger.info("bootstrap admin '%s' seeded", BOOTSTRAP_ADMIN_USERNAME)


@app.get("/api/health")
async def health() -> dict[str, bool]:
    return {"ok": True}


# --- Public: submit / track / pay -----------------------------------------
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
        "rejection_reason": None,
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
    if not row or row["name"].strip().lower() != name_l or row["dob"] != dob_v:
        raise HTTPException(
            status_code=404,
            detail="No matching request. Double-check the ticket number, name, and date of birth.",
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
        {"$set": {"status": "paid", "payment_method": body.method, "updated_at": now_iso()}},
    )
    updated = await requests_col.find_one({"_id": request_id})
    return serialize_request(updated)


# --- Auth -----------------------------------------------------------------
@app.post("/api/auth/login")
async def login(body: LoginBody) -> dict[str, Any]:
    user = await users_col.find_one({"username": body.username})
    if not user or not check_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password.")
    return {"token": sign_token(user), "user": serialize_user(user)}


# Legacy alias for the old client
@app.post("/api/staff/login")
async def staff_login_legacy(body: LoginBody) -> dict[str, Any]:
    return await login(body)


@app.get("/api/auth/me")
async def me(user: dict = Depends(current_user)) -> dict[str, Any]:
    return serialize_user(user)


@app.post("/api/auth/change-password")
async def change_password(
    body: ChangePasswordBody,
    user: dict = Depends(current_user),
) -> dict[str, Any]:
    if not check_password(body.current_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="Pick a password different from the old one.")
    await users_col.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password_hash": hash_password(body.new_password),
                "must_reset_password": False,
                "password_updated_at": now_iso(),
            }
        },
    )
    fresh = await users_col.find_one({"_id": user["_id"]})
    await log_audit(
        user,
        "password_reset",
        {"type": "user", "id": user["_id"], "label": user.get("username")},
    )
    return {"ok": True, "user": serialize_user(fresh)}


# --- Staff routes ---------------------------------------------------------
@app.get("/api/staff/requests")
async def staff_list_requests(_: dict = Depends(current_user)) -> list[dict[str, Any]]:
    rows = await requests_col.find({}).sort("_id", -1).to_list(length=1000)
    return [serialize_request(r) for r in rows]


@app.post("/api/staff/requests/{request_id}/approve")
async def staff_approve(
    request_id: int,
    body: ApproveBody,
    background: BackgroundTasks,
    _: dict = Depends(current_user),
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
    serialized = serialize_request(updated)
    subject, html = approval_email(serialized)
    background.add_task(send_html, serialized["email"], subject, html)
    await log_audit(
        _,
        "approve",
        {"type": "request", "id": request_id, "label": serialized["ticket"]},
        {"fee": fee, "customer": serialized["email"]},
    )
    return serialized


@app.post("/api/staff/requests/{request_id}/reject")
async def staff_reject(
    request_id: int,
    body: RejectBody,
    background: BackgroundTasks,
    _: dict = Depends(current_user),
) -> dict[str, Any]:
    row = await requests_col.find_one({"_id": request_id})
    if not row:
        raise HTTPException(status_code=404, detail="Request not found.")
    if row.get("status") != "received":
        raise HTTPException(status_code=409, detail="This request has already been reviewed.")

    reason = (body.reason or "").strip()
    await requests_col.update_one(
        {"_id": request_id},
        {
            "$set": {
                "status": "rejected",
                "rejection_reason": reason or None,
                "updated_at": now_iso(),
            }
        },
    )
    updated = await requests_col.find_one({"_id": request_id})
    serialized = serialize_request(updated)
    subject, html = rejection_email(serialized, reason or None)
    background.add_task(send_html, serialized["email"], subject, html)
    await log_audit(
        _,
        "reject",
        {"type": "request", "id": request_id, "label": serialized["ticket"]},
        {"reason": reason, "customer": serialized["email"]},
    )
    return serialized


@app.delete("/api/staff/requests/{request_id}")
async def staff_delete_request(
    request_id: int,
    user: dict = Depends(current_user),
) -> dict[str, Any]:
    row = await requests_col.find_one({"_id": request_id})
    if not row:
        raise HTTPException(status_code=404, detail="Request not found.")
    # Only pending requests may be deleted by anyone; admins can nuke any.
    if row.get("status") != "received" and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only pending requests can be deleted.")
    await requests_col.delete_one({"_id": request_id})
    await log_audit(
        user,
        "delete_request",
        {"type": "request", "id": request_id, "label": row.get("ticket")},
        {"prior_status": row.get("status")},
    )
    return {"ok": True, "id": request_id}


# --- Admin: user management ----------------------------------------------
@app.get("/api/staff/users")
async def list_users(_: dict = Depends(require_admin)) -> list[dict[str, Any]]:
    rows = await users_col.find({}).sort("created_at", 1).to_list(length=200)
    return [serialize_user(r) for r in rows]


@app.post("/api/staff/users", status_code=201)
async def create_user(
    body: CreateUserBody,
    admin: dict = Depends(require_admin),
) -> dict[str, Any]:
    if await users_col.find_one({"username": body.username}):
        raise HTTPException(status_code=409, detail="That username is already taken.")
    doc = {
        "_id": str(uuid.uuid4()),
        "username": body.username.strip(),
        "password_hash": hash_password(body.password),
        "name": body.name.strip(),
        "role": body.role,
        "must_reset_password": True,
        "created_at": now_iso(),
        "created_by": admin["_id"],
    }
    await users_col.insert_one(doc)
    await log_audit(
        admin,
        "create_user",
        {"type": "user", "id": doc["_id"], "label": doc["username"]},
        {"role": doc["role"]},
    )
    return serialize_user(doc)


@app.delete("/api/staff/users/{user_id}")
async def delete_user(
    user_id: str,
    admin: dict = Depends(require_admin),
) -> dict[str, Any]:
    target = await users_col.find_one({"_id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found.")
    if target["_id"] == admin["_id"]:
        raise HTTPException(status_code=400, detail="You can't delete your own account.")
    if target["role"] == "admin":
        remaining_admins = await users_col.count_documents({"role": "admin"})
        if remaining_admins <= 1:
            raise HTTPException(status_code=400, detail="At least one admin must remain.")
    await users_col.delete_one({"_id": user_id})
    await log_audit(
        admin,
        "delete_user",
        {"type": "user", "id": user_id, "label": target.get("username")},
        {"role": target.get("role")},
    )
    return {"ok": True, "id": user_id}


@app.get("/api/staff/audit-log")
async def read_audit_log(
    limit: int = Query(default=200, ge=1, le=1000),
    _: dict = Depends(require_admin),
) -> list[dict[str, Any]]:
    rows = await audit_col.find({}).sort("at", -1).to_list(length=limit)
    return [serialize_audit(r) for r in rows]


# --- Fallback -------------------------------------------------------------
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def api_not_found(path: str, request: Request) -> None:
    raise HTTPException(status_code=404, detail="Not found.")


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    mongo_client.close()
