from app.services.email_service import EmailService

service = EmailService()

service.send_otp(
    recipient="abithaabee49@gmail.com",
    username="Sakthivel",
    otp="123456",
)