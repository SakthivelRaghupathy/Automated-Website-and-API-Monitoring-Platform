"""
Application configuration.

Loads all settings from environment variables using Pydantic Settings.

This module should be the single source of truth for configuration values.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    # -------------------------------------------------
    # Application
    # -------------------------------------------------

    APP_NAME: str = Field(default="DevGuardian")
    APP_ENV: str = Field(default="development")

    APP_HOST: str = Field(default="127.0.0.1")
    APP_PORT: int = Field(default=8000)

    APP_VERSION: str = Field(default="1.0.0")

    DEBUG: bool = Field(default=True)

    # -------------------------------------------------
    # Security
    # -------------------------------------------------

    SECRET_KEY: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)

    ALGORITHM: str = Field(default="HS256")

    # -------------------------------------------------
    # Database
    # -------------------------------------------------

    DATABASE_URL: str

    # -------------------------------------------------
    # Logging
    # -------------------------------------------------

    LOG_LEVEL: str = Field(default="INFO")

    LOG_DIRECTORY: str = Field(default="logs")

    # -------------------------------------------------
    # Scheduler
    # -------------------------------------------------

    SCHEDULER_ENABLED: bool = Field(default=True)

    # -------------------------------------------------
    # Environment
    # -------------------------------------------------

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )
    #-------------------------------------------------
    # Email 
    #-------------------------------------------------
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str


@lru_cache
def get_settings() -> Settings:
    """
    Returns cached application settings.

    lru_cache ensures the settings are loaded only once.
    """
    return Settings()


settings = get_settings()