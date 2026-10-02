"""
Application entry point.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.contact import router as contact_router
from app.config import settings
from app.utils.logger import logger

from app.middleware.cors import add_cors_middleware
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from fastapi.middleware.cors import CORSMiddleware

from app.exceptions.handlers import register_exception_handlers

from app.auth.router import router as auth_router

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.middleware.rate_limit import limiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events.
    """

    logger.info("=" * 60)
    logger.info("Starting DevGuardian")
    logger.info(f"Environment : {settings.APP_ENV}")
    logger.info(f"Version     : {settings.APP_VERSION}")
    logger.info("=" * 60)

    yield

    logger.info("Stopping DevGuardian")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(contact_router)

add_cors_middleware(app)
register_exception_handlers(app)
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(RequestLoggingMiddleware)

app.include_router(auth_router)
app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint.
    """

    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health",
    }

# uvicorn app.main:app --reload