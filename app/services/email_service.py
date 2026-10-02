"""
Email service for sending emails using SMTP.
"""

import logging
import smtplib
from email.message import EmailMessage

from app.config import settings


logger = logging.getLogger(__name__)


class EmailService:
    """Reusable email service."""

    def __init__(self) -> None:
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.username = settings.SMTP_USERNAME
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL
        self.from_name = settings.SMTP_FROM_NAME

    def _send(
        self,
        recipient: str,
        subject: str,
        body: str,
        reply_to: str | None = None,
    ) -> bool:
        """
        Internal method to send an email.
        """

        message = EmailMessage()

        message["Subject"] = subject
        message["From"] = (
            f"{self.from_name} <{self.from_email}>"
        )
        message["To"] = recipient

        if reply_to:
            message["Reply-To"] = reply_to

        message.set_content(body)

        try:
            with smtplib.SMTP(
                self.host,
                self.port,
            ) as smtp:

                smtp.starttls()

                smtp.login(
                    self.username,
                    self.password,
                )

                smtp.send_message(message)

            logger.info(
                "Email sent successfully to %s",
                recipient,
            )

            return True

        except Exception as exc:

            logger.exception(
                "Failed to send email: %s",
                exc,
            )

            return False

    def send_otp(
        self,
        recipient: str,
        username: str,
        otp: str,
    ) -> bool:
        """
        Send password reset OTP.
        """

        subject = "DevGuardian Password Reset OTP"

        body = f"""
Hello {username},

We received a request to reset your DevGuardian password.

Your One-Time Password (OTP) is:

{otp}

This OTP is valid for 10 minutes.

If you did not request this password reset,
please ignore this email.

Regards,
DevGuardian Team
"""

        return self._send(
            recipient=recipient,
            subject=subject,
            body=body,
        )

    def send_password_changed(
        self,
        recipient: str,
        username: str,
    ) -> bool:
        """
        Notify user that password was changed.
        """

        subject = "DevGuardian Password Updated"

        body = f"""
Hello {username},

Your password has been changed successfully.

If you made this change,
no further action is required.

If you did NOT change your password,
please contact support immediately.

Regards,
DevGuardian Team
"""

        return self._send(
            recipient=recipient,
            subject=subject,
            body=body,
        )

    def send_welcome(
        self,
        recipient: str,
        username: str,
    ) -> bool:
        """
        Welcome email after registration.
        """

        subject = "Welcome to DevGuardian"

        body = f"""
Hello {username},

Welcome to DevGuardian!

Your account has been created successfully.

You can now login and start monitoring
your websites and APIs.

Happy Coding!

DevGuardian Team
"""

        return self._send(
            recipient=recipient,
            subject=subject,
            body=body,
        )

    def send_contact_message(
        self,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> bool:
        """
        Send a message submitted through
        the DevGuardian contact form.
        """

        email_subject = (
            f"DevGuardian Contact: {subject}"
        )

        email_body = f"""
Hello DevGuardian Team,

You received a new message from the
DevGuardian website contact form.

Name:
{sender_name}

Email:
{sender_email}

Subject:
{subject}

Message:
{message}

----------------------------------------
DevGuardian Contact Form
"""

        return self._send(
            recipient=self.from_email,
            subject=email_subject,
            body=email_body,
            reply_to=sender_email,
        )