"""empty message

Revision ID: d950b6fcba82
Revises: 
Create Date: 2024-07-27 13:59:31.216592

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d950b6fcba82"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("bikeparking_submissions", schema=None) as batch_op:
        batch_op.alter_column(
            "comments",
            existing_type=sa.VARCHAR(length=256),
            type_=sa.Text(),
            existing_nullable=True,
        )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("bikeparking_submissions", schema=None) as batch_op:
        batch_op.alter_column(
            "comments",
            existing_type=sa.Text(),
            type_=sa.VARCHAR(length=256),
            existing_nullable=True,
        )

    # ### end Alembic commands ###
