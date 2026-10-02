"""
Authentication request and response schemas.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


#============================================================
# Authentication Schemas
#============================================================

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

# ============================================================
# Password Reset Schemas
# ============================================================


class ForgotPasswordRequest(BaseModel):
    """
    Forgot password request.
    """

    email: EmailStr


class VerifyOtpRequest(BaseModel):
    """
    Verify password reset OTP.
    """

    email: EmailStr

    otp: str = Field(
        min_length=6,
        max_length=6,
    )


class ResetPasswordRequest(BaseModel):
    """
    Reset password request.
    """

    email: EmailStr

    otp: str = Field(
        min_length=6,
        max_length=6,
    )

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )

    confirm_password: str = Field(
        min_length=8,
        max_length=128,
    )


class MessageResponse(BaseModel):
    """
    Generic success response.
    """

    message: str


class OtpVerificationResponse(BaseModel):
    """
    OTP verification response.
    """

    verified: bool

    message: str