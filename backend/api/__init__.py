from fastapi import APIRouter
from .routes import auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/api/v1")

__all__ = ["api_router"]
