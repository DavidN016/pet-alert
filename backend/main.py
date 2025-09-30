from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from db.database import connect_to_mongo, close_mongo_connection
from api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)

# Serve static files (e.g., images for testing) from /static
app.mount("/images", StaticFiles(directory="static/images"), name="images")

@app.get("/")
async def root():
    return {"message": "Pet Alert API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
