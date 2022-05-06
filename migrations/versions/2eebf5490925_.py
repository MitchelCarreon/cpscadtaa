"""empty message

Revision ID: 2eebf5490925
Revises: 8fd55d69ddd0
Create Date: 2022-03-17 01:48:29.652944

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2eebf5490925'
down_revision = '8fd55d69ddd0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=40), nullable=False),
    sa.Column('accessLevel', sa.String(length=20), nullable=False),
    sa.Column('password', sa.String(length=40), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    # ### end Alembic commands ###