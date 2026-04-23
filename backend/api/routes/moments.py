import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Any
import firebase_admin
from firebase_admin import firestore

from core.security import get_current_user
from api.routes.upload import delete_cloudinary_image

router = APIRouter(prefix="/moments", tags=["moments"])

# Firestore client — reuses the already-initialised Firebase Admin app
db = firestore.client()


class MomentPayload(BaseModel):
    templateId: str
    customization: dict[str, Any]
    status: str | None = "draft"
    title: str | None = None


@router.get("")
async def list_moments(user: dict = Depends(get_current_user)):
    """Return all saved moments for the authenticated user."""
    uid = user["uid"]
    docs = (
        db.collection("moments")
        .where(filter=firestore.FieldFilter("uid", "==", uid))
        .stream()
    )
    
    # Sort in memory to avoid the need for a Firestore Composite Index
    moments = [{"id": doc.id, **doc.to_dict()} for doc in docs]
    moments.sort(key=lambda x: x.get("savedAt", ""), reverse=True)
    
    return moments


@router.post("", status_code=201)
async def save_moment(payload: MomentPayload, user: dict = Depends(get_current_user)):
    """Save a new moment for the authenticated user."""
    uid = user["uid"]
    moment_id = str(uuid.uuid4())
    moment_data = {
        "uid": uid,
        "templateId": payload.templateId,
        "title": payload.title,
        "status": payload.status,
        "customization": payload.customization,
        "savedAt": datetime.now(timezone.utc).isoformat(),
        "viewerSessions": [],
    }
    db.collection("moments").document(moment_id).set(moment_data)
    return {"id": moment_id, **moment_data}


@router.patch("/{moment_id}", status_code=200)
async def update_moment(moment_id: str, payload: MomentPayload, user: dict = Depends(get_current_user)):
    """Update an existing moment's customization — only if it belongs to the authenticated user."""
    uid = user["uid"]
    ref = db.collection("moments").document(moment_id)
    doc = ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Moment not found.")

    if doc.to_dict().get("uid") != uid:
        raise HTTPException(status_code=403, detail="Not authorised to edit this moment.")

    updated_data = {
        "templateId": payload.templateId,
        "title": payload.title,
        "status": payload.status,
        "customization": payload.customization,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    ref.update(updated_data)
    return {"id": moment_id, **doc.to_dict(), **updated_data}


@router.get("/public/{moment_id}")
async def get_public_moment(moment_id: str, visitorId: str | None = None):
    """Public endpoint to fetch a moment for the shared recipient link. No auth required."""
    doc_ref = db.collection("moments").document(moment_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Moment not found")
        
    data = doc.to_dict()
    
    # Validation Logic
    base_time_str = data.get("updatedAt") or data.get("savedAt")
    if base_time_str:
        try:
            base_time = datetime.fromisoformat(base_time_str)
            # Temporarily set to 5 minutes (300 seconds) for testing
            if (datetime.now(timezone.utc) - base_time).total_seconds() >= 300:
                raise HTTPException(status_code=410, detail="This moment link has expired due to time limit.")
        except ValueError:
            pass # Handle legacy or malformed dates gracefully
            
    if data.get("status") == "shared":
        viewer_sessions = data.get("viewerSessions", [])
        if visitorId:
            if visitorId not in viewer_sessions:
                if len(viewer_sessions) >= 4:
                    raise HTTPException(status_code=403, detail="This moment link has reached its maximum viewer limit.")
                else:
                    # Add new visitor ID
                    viewer_sessions.append(visitorId)
                    doc_ref.update({"viewerSessions": viewer_sessions})
        elif len(viewer_sessions) >= 4:
            raise HTTPException(status_code=403, detail="This moment link has reached its maximum viewer limit.")

    # Only return necessary public data
    return {
        "id": doc.id,
        "templateId": data.get("templateId"),
        "customization": data.get("customization")
    }

@router.post("/{moment_id}/reactivate", status_code=200)
async def reactivate_moment(moment_id: str, user: dict = Depends(get_current_user)):
    """Reactivate an expired moment."""
    uid = user["uid"]
    ref = db.collection("moments").document(moment_id)
    doc = ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Moment not found.")

    if doc.to_dict().get("uid") != uid:
        raise HTTPException(status_code=403, detail="Not authorised to reactivate this moment.")

    updated_data = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "viewerSessions": []
    }
    ref.update(updated_data)
    return {"id": moment_id, **doc.to_dict(), **updated_data}


@router.delete("/{moment_id}", status_code=204)
async def delete_moment(moment_id: str, user: dict = Depends(get_current_user)):
    """Delete a specific moment — only if it belongs to the authenticated user."""
    uid = user["uid"]
    ref = db.collection("moments").document(moment_id)
    doc = ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Moment not found.")

    moment_data = doc.to_dict()

    if moment_data.get("uid") != uid:
        raise HTTPException(status_code=403, detail="Not authorised to delete this moment.")

    # Delete all associated Cloudinary images
    def delete_all_images_in_customization(data):
        if isinstance(data, dict):
            for value in data.values():
                delete_all_images_in_customization(value)
        elif isinstance(data, list):
            for item in data:
                delete_all_images_in_customization(item)
        elif isinstance(data, str) and "res.cloudinary.com" in data and "moment-maker" in data:
            delete_cloudinary_image(data)
            
    try:
        delete_all_images_in_customization(moment_data.get("customization", {}))
    except Exception as e:
        print(f"Error cleaning up images: {e}")

    ref.delete()
    return None


@router.get("/favorites")
async def get_favorites(user: dict = Depends(get_current_user)):
    """Fetch the authenticated user's favorite templates."""
    uid = user["uid"]
    doc = db.collection("users").document(uid).get()
    
    if not doc.exists:
        return {"favorites": []}
        
    return {"favorites": doc.to_dict().get("favorites", [])}


@router.post("/favorites/{template_id}")
async def toggle_favorite(template_id: str, user: dict = Depends(get_current_user)):
    """Toggle a template in the user's favorites array."""
    uid = user["uid"]
    ref = db.collection("users").document(uid)
    doc = ref.get()
    
    if not doc.exists:
        ref.set({"favorites": [template_id]}, merge=True)
        return {"favorites": [template_id], "status": "added"}
        
    favorites = doc.to_dict().get("favorites", [])
    if template_id in favorites:
        favorites.remove(template_id)
        status = "removed"
    else:
        favorites.append(template_id)
        status = "added"
        
    ref.update({"favorites": favorites})
    return {"favorites": favorites, "status": status}
