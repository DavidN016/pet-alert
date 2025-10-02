from fastapi import APIRouter
from .routes import auth, reports, alerts, similarity

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/api/v1")
api_router.include_router(reports.router, prefix="/api/v1")
api_router.include_router(alerts.router, prefix="/api/v1")
api_router.include_router(similarity.router, prefix="/api/v1")

__all__ = ["api_router"]
