import os
import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv
from fastapi import HTTPException, Header
from typing import Optional

load_dotenv()

# Initialise Firebase Admin SDK once at module load
_service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "./serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(_service_account_path)
    firebase_admin.initialize_app(cred)


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    FastAPI dependency — validates the Bearer token from the Authorization header.
    Returns the decoded Firebase token payload (contains uid, email, name, etc.)
    Raises HTTP 401 if the token is missing or invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header.")

    id_token = authorization.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
