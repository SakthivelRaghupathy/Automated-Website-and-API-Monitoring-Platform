"""
Global exception handlers.
"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from app.exceptions.responses import error_response
from app.utils.logger import logger


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):

        logger.warning(
            f"{request.method} {request.url.path} -> {exc.detail}"
        )

        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(
                message=exc.detail,
            ),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):

        logger.warning(
            f"Validation Error : {request.method} {request.url.path}"
        )

        return JSONResponse(
            status_code=422,
            content=error_response(
                message="Validation failed",
                errors=exc.errors(),
            ),
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):

        logger.exception(exc)

        return JSONResponse(
            status_code=500,
            content=error_response(
                message="Internal server error",
            ),
        )