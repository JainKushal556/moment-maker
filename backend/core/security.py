import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Header
from typing import Optional


def _init_firebase():
    """
    Initialise Firebase Admin SDK once.

    Priority order:
      1. FIREBASE_SERVICE_ACCOUNT_JSON  — raw JSON string (used in production / Render)
      2. FIREBASE_SERVICE_ACCOUNT_PATH  — path to a local .json file (used in local dev)
    """
    if firebase_admin._apps:
        return  # already initialised

    raw_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    if raw_json:
        # Production path: Render injects the entire JSON as an env var.
        # Write it to a temp file so firebase-admin can read it via Certificate().
        service_account_info = json.loads(raw_json)
        # Use from_service_account_info directly — no temp file needed
        cred = credentials.Certificate(service_account_info)
    else:
        # Local dev path: fall back to the .json file on disk
        path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "./serviceAccountKey.json")
        cred = credentials.Certificate(path)

    firebase_admin.initialize_app(cred)


_init_firebase()


import time

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    FastAPI dependency — validates the Bearer token from the Authorization header.
    Returns the decoded Firebase token payload (contains uid, email, name, etc.)
    Raises HTTP 401 if the token is missing or invalid.
    Includes a retry logic for clock skew (Token used too early).
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or malformed Authorization header.",
        )

    id_token = authorization.split("Bearer ")[1]

    try:
        return auth.verify_id_token(id_token)
    except Exception as e:
        error_msg = str(e)
        if "Token used too early" in error_msg:
            # More aggressive wait for larger skews (common in local dev)
            print(f"⚠️ Clock skew detected: {error_msg}")
            print("💡 TIP: Sync your computer clock (Settings > Date & Time > Sync now) to fix this permanently.")
            print("🔄 Retrying in 3s...")
            time.sleep(3)
            try:
                return auth.verify_id_token(id_token)
            except Exception as retry_e:
                error_msg = str(retry_e)
        
        print(f"❌ Auth verification failed: {error_msg}")
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {error_msg}")
