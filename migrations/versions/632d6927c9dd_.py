"""empty message

Revision ID: 632d6927c9dd
Revises: 7e6076173d57
Create Date: 2022-04-13 22:04:03.010097

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '632d6927c9dd'
down_revision = '7e6076173d57'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'section', ['number'])
    op.create_unique_constraint(None, 'section', ['id', 'number'])
    op.drop_column('section', 'period_time')
    op.drop_column('section', 'period_days')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('section', sa.Column('period_days', sa.VARCHAR(length=10), nullable=False))
    op.add_column('section', sa.Column('period_time', sa.TIME(), nullable=False))
    op.drop_constraint(None, 'section', type_='unique')
    op.drop_constraint(None, 'section', type_='unique')
    # ### end Alembic commands ###
