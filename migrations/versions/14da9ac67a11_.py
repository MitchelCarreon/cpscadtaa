"""empty message

Revision ID: 14da9ac67a11
Revises: 083a4cff4055
Create Date: 2022-04-24 19:20:11.953195

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '14da9ac67a11'
down_revision = '083a4cff4055'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('instructor', sa.Column('section_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'instructor', 'section', ['section_id'], ['id'])
    op.drop_constraint(None, 'section', type_='foreignkey')
    op.drop_column('section', 'assignedInstructor')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('section', sa.Column('assignedInstructor', sa.INTEGER(), nullable=True))
    op.create_foreign_key(None, 'section', 'instructor', ['assignedInstructor'], ['id'])
    op.drop_constraint(None, 'instructor', type_='foreignkey')
    op.drop_column('instructor', 'section_id')
    # ### end Alembic commands ###
