"""
Centralized application logging.

Uses Loguru for console and file logging.
"""

from pathlib import Path

from loguru import logger

from app.config import settings

# Create log directory if it doesn't exist
log_dir = Path(settings.LOG_DIRECTORY)
log_dir.mkdir(parents=True, exist_ok=True)

# Remove default logger
logger.remove()

# Console logging
logger.add(
    sink=lambda msg: print(msg, end=""),
    level=settings.LOG_LEVEL,
    colorize=True,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    ),
)

# Application log
logger.add(
    log_dir / "app.log",
    rotation="10 MB",
    retention="30 days",
    compression="zip",
    level="INFO",
)

# Error log
logger.add(
    log_dir / "error.log",
    rotation="10 MB",
    retention="60 days",
    compression="zip",
    level="ERROR",
)

__all__ = ["logger"]