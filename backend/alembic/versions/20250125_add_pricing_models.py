"""Add pricing models for middleman business model

Revision ID: 0002_add_pricing_models
Revises: 0001_initial
Create Date: 2025-01-25 12:00:00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_add_pricing_models'
down_revision = None  # Set to '0001_initial' if you have a previous migration
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Создание новых таблиц для посреднической модели:
    - pricing_configuration: глобальные настройки (курс USD/RUB)
    - ai_engines: AI-движки с себестоимостью и наценкой
    - fusion_chains: Fusion-цепочки для комплексных генераций
    """
    
    # Создание таблицы pricing_configuration
    op.create_table(
        'pricing_configuration',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('key', sa.String(), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )
    
    # Создание enum для типов генерации (если еще не создан)
    generation_type_enum = sa.Enum(
        'static_image', 
        'animated_image', 
        'video_morph', 
        'contextual_photo', 
        'ai_scoring',
        'vector_creative',  # NEW: Recraft.ai
        'branded_set',  # NEW: Fusion
        name='generationtype',
        create_type=True
    )
    
    # Создание таблицы ai_engines
    op.create_table(
        'ai_engines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('api_endpoint', sa.String(), nullable=True),
        sa.Column('api_key_encrypted', sa.String(), nullable=True),
        sa.Column('internal_cost_usd_per_unit', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('markup_percentage', sa.Float(), nullable=False, server_default='300.0'),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('generation_type', generation_type_enum, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    
    # Создание таблицы fusion_chains
    op.create_table(
        'fusion_chains',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('generation_type', generation_type_enum, nullable=False),
        sa.Column('chain_config', sa.Text(), nullable=False),
        sa.Column('total_cost_usd', sa.Float(), nullable=False),
        sa.Column('markup_percentage', sa.Float(), nullable=False, server_default='250.0'),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )


def downgrade() -> None:
    """
    Откат миграции: удаление таблиц и enum типов
    """
    op.drop_table('fusion_chains')
    op.drop_table('ai_engines')
    op.drop_table('pricing_configuration')
    
    # Drop the enum type
    sa.Enum(name='generationtype').drop(op.get_bind(), checkfirst=True)

