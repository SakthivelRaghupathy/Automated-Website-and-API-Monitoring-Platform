"""
Authentication repository.
Handles database operations.
"""

import email

from sqlalchemy.orm import Session

from app.auth.models.user import User

from datetime import datetime, timezone

from datetime import datetime, timezone

from app.auth.models.user import User
from app.auth.models.password_reset_token import PasswordResetToken


class AuthRepository:
    """
    Repository for authentication-related database operations.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> User | None:
        return (
            self.db.query(User)
            .filter(User.username == username)
            .first()
        )

    def get_by_email(self, email: str) -> User | None:
        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

    def create_user(
        self,
        username: str,
        email: str,
        password_hash: str,
    ) -> User:

        user = User(
            username=username,
            email=email,
            password_hash=password_hash,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user

    def update_last_login(self, user: User) -> None:
        
            user.last_login = datetime.now(timezone.utc)
        
            self.db.commit()
    def get_user_by_email(
                self,
                email: str,
            ) -> User | None:
        """
        find user using email address
        """
        return (
                    self.db.query(User)
                    .filter(User.email == email)
                    .first()
                )

    def create_password_reset_token(
        self,
        token: PasswordResetToken,
    ) -> PasswordResetToken:
        """
        Save password reset token.
        """

        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)

        return token


    def get_latest_password_reset_token(
        self,
        user_id,
    ) -> PasswordResetToken | None:
        """
        Get latest unused password reset token.
        """

        return (
            self.db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.user_id == user_id,
                PasswordResetToken.is_used == False,
            )
            .order_by(
                PasswordResetToken.created_at.desc()
            )
            .first()
        )


    def delete_old_reset_tokens(
        self,
        user_id,
    ) -> None:
        """
        Delete previous password reset tokens.
        """

        (
            self.db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.user_id == user_id,
            )
            .delete()
        )

        self.db.commit()


    def mark_token_verified(
        self,
        token: PasswordResetToken,
    ) -> None:
        """
        Mark OTP as verified.
        """

        token.is_verified = True

        self.db.commit()


    def mark_token_used(
        self,
        token: PasswordResetToken,
    ) -> None:
        """
        Mark OTP as used.
        """

        token.is_used = True

        self.db.commit()


    def update_user_password(
        self,
        user: User,
        password_hash: str,
    ) -> None:
        """
        Update user password.
        """

        user.password_hash = password_hash
        user.updated_at = datetime.now(
            timezone.utc,
        )

        self.db.commit()
    def increment_failed_login_attempts(self,user: User) -> None:
        """
    Increase failed login counter.
        """
        user.failed_login_attempts += 1

        self.db.commit()


    def reset_failed_login_attempts(self,user: User) -> None:
      """
    Reset failed login counter.
    """
      user.failed_login_attempts = 0
      user.locked_until = None

      self.db.commit()


    def lock_user(
        self,
        user: User,
        locked_until: datetime,
    ) -> None:
       """
    Temporarily lock user account.
    """
       user.locked_until = locked_until
       
       self.db.commit()