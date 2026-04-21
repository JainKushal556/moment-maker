from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import moments, upload

app = FastAPI(title="WishCraft API", version="0.1.0")

# Allow requests from the Vite dev server and production domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev
        "http://localhost:4173",   # Vite preview
        "https://wishcraft.app",   # Production (update when live)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(moments.router)
app.include_router(upload.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "WishCraft API"}
