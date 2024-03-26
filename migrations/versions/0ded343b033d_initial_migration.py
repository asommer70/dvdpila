"""Initial migration.

Revision ID: 0ded343b033d
Revises: 
Create Date: 2022-01-18 16:15:14.223190

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0ded343b033d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('dvd',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('abstract_txt', sa.Text(), nullable=True),
    sa.Column('abstract_source', sa.String(length=255), nullable=True),
    sa.Column('abstract_url', sa.String(length=255), nullable=True),
    sa.Column('image_url', sa.String(length=255), nullable=True),
    sa.Column('file_url', sa.String(length=255), nullable=True),
    sa.Column('playback_time', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tag',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('episode',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('file_url', sa.String(length=255), nullable=True),
    sa.Column('playback_time', sa.Integer(), nullable=True),
    sa.Column('dvd_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['dvd_id'], ['dvd.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tags',
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.Column('dvd_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['dvd_id'], ['dvd.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], ),
    sa.PrimaryKeyConstraint('tag_id', 'dvd_id')
    )
    op.create_table('bookmark',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('dvd_id', sa.Integer(), nullable=True),
    sa.Column('episode_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['dvd_id'], ['dvd.id'], ),
    sa.ForeignKeyConstraint(['episode_id'], ['episode.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('bookmark')
    op.drop_table('tags')
    op.drop_table('episode')
    op.drop_table('tag')
    op.drop_table('dvd')
    # ### end Alembic commands ###