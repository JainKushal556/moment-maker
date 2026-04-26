import os
import re
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from core.security import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])

# Configure Cloudinary using environment variables (loaded by main.py via dotenv)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = "moment-crafter/user-moments",
    user: dict = Depends(get_current_user)
):
    """
    Accepts an image file, uploads it to a specific folder in Cloudinary.
    """
    # Basic content-type validation
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    # 5 MB size limit
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be smaller than 5 MB.")

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="image",
            overwrite=False,
            unique_filename=True,
        )
        return {"url": result["secure_url"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")


@router.delete("/image")
async def delete_image(
    url: str,
    user: dict = Depends(get_current_user)
):
    """
    Deletes an image from Cloudinary using its URL.
    Only allows deletion if the URL belongs to our Cloudinary folder.
    """
    delete_cloudinary_image(url)
    return {"status": "success", "message": "Image deleted if it existed"}


def delete_cloudinary_image(url: str):
    """
    Extracts the public_id from a Cloudinary URL and deletes it from Cloudinary.
    """
    if not url or "res.cloudinary.com" not in url or "moment-crafter" not in url:
        return
        
    match = re.search(r'/upload/(?:v\d+/)?(moment-crafter/[^.]+)', url)
    if match:
        public_id = match.group(1)
        try:
            cloudinary.uploader.destroy(public_id)
            print(f"Deleted from Cloudinary: {public_id}")
        except Exception as e:
            print(f"Failed to delete {public_id} from Cloudinary: {e}")
