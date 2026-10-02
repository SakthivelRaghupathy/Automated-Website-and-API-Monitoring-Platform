"""
Health check endpoints.
"""

from datetime import datetime

from fastapi import APIRouter

from app.config import settings

router = APIRouter(
    prefix="/health",
    redirect_slashes=False,
    tags=["Health"],
)


@router.get("/")
async def health_check():
    """
    Basic health check endpoint.
    """

    return {
        "status": "healthy",
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "timestamp": datetime.utcnow().isoformat(),
    }