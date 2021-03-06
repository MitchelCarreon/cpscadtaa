"""empty message

Revision ID: 835bc1d2b8ed
Revises: de95507a1b50
Create Date: 2022-03-21 20:44:00.308548

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '835bc1d2b8ed'
down_revision = 'de95507a1b50'
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
    sa.Column('email_confirmation_sent_on', sa.DateTime(), nullable=True),
    sa.Column('email_confirmed', sa.Boolean(), nullable=True),
    sa.Column('email_confirmed_on', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    # ### end Alembic commands ###
