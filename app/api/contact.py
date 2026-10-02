from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.services.email_service import EmailService


router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=3, max_length=150)
    message: str = Field(min_length=10, max_length=5000)


class ContactResponse(BaseModel):
    message: str


@router.post(
    "",
    response_model=ContactResponse,
    status_code=status.HTTP_200_OK,
)
def send_contact_message(request: ContactRequest):

    email_service = EmailService()

    success = email_service.send_contact_message(
        sender_name=request.name,
        sender_email=str(request.email),
        subject=request.subject,
        message=request.message,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send your message. Please try again later.",
        )

    return {
        "message": "Your message has been sent successfully."
    }