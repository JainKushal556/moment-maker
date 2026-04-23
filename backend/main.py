import os
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.routes import moments, upload

load_dotenv()  # Load .env before any module reads os.getenv()

app = FastAPI(title="WishCraft API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(moments.router)
app.include_router(upload.router)


@app.get("/health")
def health():
    # Used by Render and Docker HEALTHCHECK (must remain open)
    return {"status": "ok", "service": "WishCraft API"}

@app.get("/cron/keep-alive")
def keep_alive(x_cron_secret: str | None = Header(None)):
    """
    Endpoint for cron-job.org to keep the Render instance awake.
    Requires an X-Cron-Secret header that matches the CRON_SECRET_KEY env var.
    """
    expected_secret = os.getenv("CRON_SECRET_KEY")
    
    if not expected_secret:
        raise HTTPException(status_code=500, detail="CRON_SECRET_KEY not configured on server")
        
    if x_cron_secret != expected_secret:
        raise HTTPException(status_code=401, detail="Unauthorized cron request")
        
    return {"status": "awake", "message": "Instance kept alive successfully"}
