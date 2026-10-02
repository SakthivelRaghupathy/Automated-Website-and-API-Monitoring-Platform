"""
OTP helper functions.
"""

import secrets
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 10


def generate_otp() -> str:
    """
    Generate a random 6-digit OTP.
    """
    MIN = 10**(OTP_LENGTH-1)
    MAX= (10**OTP_LENGTH)-1
    return str(secrets.randbelow(MAX-MIN+1)+MIN)


def hash_otp(otp: str) -> str:
    """
    Hash OTP before storing.
    """
    return pwd_context.hash(otp)


def verify_otp(
    plain_otp: str,
    hashed_otp: str,
) -> bool:
    """
    Verify entered OTP.
    """
    return pwd_context.verify(
        plain_otp,
        hashed_otp,
    )


def get_expiry_time() -> datetime:
    """
    OTP expiry timestamp.
    """
    return datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=OTP_EXPIRY_MINUTES
    )


def is_expired(expires_at: datetime) -> bool:
    """
    Check if OTP has expired.
    """
    return datetime.now(
        timezone.utc
    ) > expires_at