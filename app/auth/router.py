"""
Authentication routes.
"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.models.user import User
from app.auth.repository import AuthRepository
from app.auth.service import AuthService
from app.database.session import get_db

from app.auth.schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    OtpVerificationResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
    VerifyOtpRequest,
)

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.middleware.rate_limit import limiter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
@limiter.limit("5/minute")
def register(
    request: Request,
    data:RegisterRequest,
    db: Session = Depends(get_db),
):
    repository = AuthRepository(db)

    service = AuthService(repository)

    return service.register(data)


@router.post(
    "/login",
    response_model=TokenResponse,
)
@limiter.limit("5/minute")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db),
):

    repository = AuthRepository(db)

    service = AuthService(repository)

    result = service.login(data)

    return TokenResponse (
        access_token=result["access_token"],
        token_type=result["token_type"],
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_profile(
    current_user: User = Depends(
        get_current_user,
    ),
):

    return current_user

@router.post(
    "/forgot-password",
    response_model=MessageResponse,
)
@limiter.limit("3/5minutes")
def forgot_password(
    request:Request,
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):

    repository = AuthRepository(db)

    service = AuthService(repository)

    return service.forgot_password(data)


@router.post(
    "/verify-otp",
    response_model=OtpVerificationResponse,
)
@limiter.limit("5/minute")
def verify_otp(
    request:Request,
    data: VerifyOtpRequest,
    db: Session = Depends(get_db),
):

    repository = AuthRepository(db)

    service = AuthService(repository)

    return service.verify_reset_otp(data)


@router.post(
    "/reset-password",
    response_model=MessageResponse,
)
def reset_password(
    request: Request,
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):

    repository = AuthRepository(db)

    service = AuthService(repository)

    return service.reset_password(data)