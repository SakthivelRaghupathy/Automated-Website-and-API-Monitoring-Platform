"""add account lockout fields

Revision ID: 215024f7e462
Revises: b72c0c8333b3
Create Date: 2026-08-20 20:32:08.601289

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '215024f7e462'
down_revision: Union[str, Sequence[str], None] = 'b72c0c8333b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "failed_login_attempts",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "locked_until",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    # Remove the database-level default after
    # existing rows have been populated.
    op.alter_column(
        "users",
        "failed_login_attempts",
        server_default=None,
    )

def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "users",
        "locked_until",
    )

    op.drop_column(
        "users",
        "failed_login_attempts",
    )