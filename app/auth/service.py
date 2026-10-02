"""
Authentication service.

Contains business logic for:
- User registration
- User login
- JWT authentication
- Account lockout
- Forgot password
- OTP verification
- Password reset
"""

from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

from app.auth.models.password_reset_token import PasswordResetToken
from app.auth.otp import (
    generate_otp,
    get_expiry_time,
    hash_otp,
    is_expired,
    verify_otp,
)
from app.auth.repository import AuthRepository
from app.auth.schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
)
from app.auth.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.auth.validators import validate_password
from app.services.email_service import EmailService


class AuthService:
    """
    Authentication business logic.
    """

    def __init__(
        self,
        repository: AuthRepository,
    ):
        self.repository = repository

    # =========================================================
    # REGISTER
    # =========================================================

    def register(
        self,
        request: RegisterRequest,
    ):
        """
        Register a new user.
        """

        # Check password confirmation
        if request.password != request.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match.",
            )

        # Validate password strength
        validate_password(
            request.password
        )

        # Check username
        if self.repository.get_by_username(
            request.username
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists.",
            )

        # Check email
        if self.repository.get_by_email(
            request.email
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists.",
            )

        # Hash password
        password_hash = hash_password(
            request.password
        )

        # Create user
        return self.repository.create_user(
            username=request.username,
            email=request.email,
            password_hash=password_hash,
        )

    # =========================================================
    # LOGIN
    # =========================================================

    def login(
        self,
        request: LoginRequest,
    ):
        """
        Authenticate user and generate JWT.

        Security:
        - Maximum 5 failed attempts
        - 15-minute temporary lock
        - Failed counter resets after successful login
        """

        MAX_LOGIN_ATTEMPTS = 5
        LOCKOUT_MINUTES = 15

        # Find user
        user = self.repository.get_by_username(
            request.username
        )

        # Do not reveal whether username exists
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password.",
            )

        now = datetime.now(timezone.utc)

        # -----------------------------------------------------
        # Check whether account is currently locked
        # -----------------------------------------------------

        if (
            user.locked_until is not None
            and user.locked_until > now
        ):
            remaining_seconds = (
                user.locked_until - now
            ).total_seconds()

            remaining_minutes = max(
                1,
                int(
                    remaining_seconds // 60
                ),
            )

            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=(
                    "Account temporarily locked. "
                    f"Try again in approximately "
                    f"{remaining_minutes} minute(s)."
                ),
            )

        # -----------------------------------------------------
        # Unlock account if previous lock expired
        # -----------------------------------------------------

        if (
            user.locked_until is not None
            and user.locked_until <= now
        ):
            self.repository.reset_failed_login_attempts(
                user
            )

        # -----------------------------------------------------
        # Verify password
        # -----------------------------------------------------

        if not verify_password(
            request.password,
            user.password_hash,
        ):
            # Increase failed login counter
            self.repository.increment_failed_login_attempts(
                user
            )

            # Check whether maximum attempts reached
            if (
                user.failed_login_attempts
                >= MAX_LOGIN_ATTEMPTS
            ):
                locked_until = (
                    now
                    + timedelta(
                        minutes=LOCKOUT_MINUTES
                    )
                )

                self.repository.lock_user(
                    user,
                    locked_until,
                )

                raise HTTPException(
                    status_code=status.HTTP_423_LOCKED,
                    detail=(
                        "Too many failed login attempts. "
                        "Account temporarily locked for "
                        "15 minutes."
                    ),
                )

            remaining_attempts = (
                MAX_LOGIN_ATTEMPTS
                - user.failed_login_attempts
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=(
                    "Invalid username or password. "
                    f"{remaining_attempts} "
                    "attempt(s) remaining."
                ),
            )

        # -----------------------------------------------------
        # Successful login
        # -----------------------------------------------------

        self.repository.reset_failed_login_attempts(
            user
        )

        self.repository.update_last_login(
            user
        )

        # Create JWT
        token = create_access_token(
            {
                "sub": str(user.id),
                "username": user.username,
                "role": user.role,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }

    # =========================================================
    # FORGOT PASSWORD
    # =========================================================

    def forgot_password(
        self,
        request: ForgotPasswordRequest,
    ):
        """
        Generate password-reset OTP and send it by email.
        """

        # Find user by email
        user = self.repository.get_user_by_email(
            request.email.lower()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        # Remove previous reset tokens
        self.repository.delete_old_reset_tokens(
            user.id
        )

        # Generate OTP
        otp = generate_otp()

        # Create password reset token
        token = PasswordResetToken(
            user_id=user.id,
            otp_hash=hash_otp(otp),
            expires_at=get_expiry_time(),
        )

        # Store token
        self.repository.create_password_reset_token(
            token
        )

        # Send OTP email
        email_service = EmailService()

        email_service.send_otp(
            recipient=user.email,
            username=user.username,
            otp=otp,
        )

        return {
            "message": "OTP sent successfully."
        }

    # =========================================================
    # VERIFY RESET OTP
    # =========================================================

    def verify_reset_otp(
        self,
        request: VerifyOtpRequest,
    ):
        """
        Verify password-reset OTP.
        """

        # Find user
        user = self.repository.get_user_by_email(
            request.email.lower()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        # Get latest reset token
        token = (
            self.repository
            .get_latest_password_reset_token(
                user.id
            )
        )

        if token is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OTP not found.",
            )

        # Check whether token was already used
        if token.is_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP already used.",
            )

        # Check expiration
        if is_expired(
            token.expires_at
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP expired.",
            )

        # Verify OTP
        if not verify_otp(
            request.otp,
            token.otp_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP.",
            )

        # Mark OTP as verified
        self.repository.mark_token_verified(
            token
        )

        return {
            "verified": True,
            "message": "OTP verified successfully.",
        }

    # =========================================================
    # RESET PASSWORD
    # =========================================================

    def reset_password(
        self,
        request: ResetPasswordRequest,
    ):
        """
        Reset user password after successful OTP verification.
        """

        # Check password confirmation
        if (
            request.new_password
            != request.confirm_password
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match.",
            )

        # Validate new password
        validate_password(
            request.new_password
        )

        # Find user
        user = self.repository.get_user_by_email(
            request.email.lower()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        # Get latest reset token
        token = (
            self.repository
            .get_latest_password_reset_token(
                user.id
            )
        )

        if token is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OTP not found.",
            )

        # Check whether token was already used
        if token.is_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP already used.",
            )

        # OTP must be verified first
        if not token.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verify OTP first.",
            )

        # Check expiration
        if is_expired(
            token.expires_at
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP expired.",
            )

        # Hash new password
        password_hash = hash_password(
            request.new_password
        )

        # Update password
        self.repository.update_user_password(
            user,
            password_hash,
        )

        # Mark reset token as used
        self.repository.mark_token_used(
            token
        )

        # Send confirmation email
        email_service = EmailService()

        email_service.send_password_changed(
            recipient=user.email,
            username=user.username,
        )

        return {
            "message": "Password reset successful."
        }