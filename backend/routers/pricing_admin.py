"""
API endpoints для управления AI-агентами и ценообразованием (Админ-панель).
Включает Калькулятор Маржинальности.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, AiEngine, PricingConfiguration, FusionChain, GenerationType
from schemas import (
    AiEngineCreate, AiEngineUpdate, AiEngineResponse,
    PricingConfigurationResponse, PricingConfigurationUpdate,
    FusionChainResponse, FusionChainCreate,
    MarginCalculatorResponse
)
from auth import get_current_active_user
from pricing_utils import calculate_margin_summary, get_generation_price, update_all_generation_prices
from logging_config import logger

router = APIRouter(prefix="/api/admin/pricing", tags=["Admin Pricing"])


def require_admin(current_user: User = Depends(get_current_active_user)):
    """Проверка прав администратора"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    return current_user


# ==================== AI ENGINES ====================

@router.get("/engines", response_model=List[AiEngineResponse])
async def list_ai_engines(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Получить список всех AI-движков.
    """
    engines = db.query(AiEngine).all()
    return engines


@router.post("/engines", response_model=AiEngineResponse, status_code=status.HTTP_201_CREATED)
async def create_ai_engine(
    engine_data: AiEngineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Создать новый AI-движок.
    """
    # Проверка уникальности имени
    existing = db.query(AiEngine).filter(AiEngine.name == engine_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"AI Engine with name '{engine_data.name}' already exists"
        )
    
    engine = AiEngine(**engine_data.dict())
    db.add(engine)
    db.commit()
    db.refresh(engine)
    
    logger.info(f"Admin {current_user.username} created AI Engine: {engine.name}")
    return engine


@router.patch("/engines/{engine_id}", response_model=AiEngineResponse)
async def update_ai_engine(
    engine_id: int,
    engine_data: AiEngineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Обновить AI-движок (изменить себестоимость, наценку и т.д.).
    """
    engine = db.query(AiEngine).filter(AiEngine.id == engine_id).first()
    if not engine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Engine not found"
        )
    
    update_data = engine_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(engine, field, value)
    
    db.commit()
    db.refresh(engine)
    
    logger.info(f"Admin {current_user.username} updated AI Engine: {engine.name}")
    return engine


@router.delete("/engines/{engine_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ai_engine(
    engine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Удалить AI-движок (или деактивировать).
    """
    engine = db.query(AiEngine).filter(AiEngine.id == engine_id).first()
    if not engine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI Engine not found"
        )
    
    # Деактивируем вместо удаления для сохранения истории
    engine.is_active = False
    db.commit()
    
    logger.info(f"Admin {current_user.username} deactivated AI Engine: {engine.name}")
    return None


# ==================== PRICING CONFIGURATION ====================

@router.get("/config", response_model=List[PricingConfigurationResponse])
async def get_pricing_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Получить глобальные настройки ценообразования (курс USD/RUB и др.).
    """
    configs = db.query(PricingConfiguration).all()
    return configs


@router.patch("/config/{key}", response_model=PricingConfigurationResponse)
async def update_pricing_config(
    key: str,
    config_data: PricingConfigurationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Обновить глобальную настройку (например, курс USD/RUB).
    """
    config = db.query(PricingConfiguration).filter(PricingConfiguration.key == key).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Configuration key '{key}' not found"
        )
    
    config.value = config_data.value
    db.commit()
    db.refresh(config)
    
    logger.info(f"Admin {current_user.username} updated pricing config '{key}' to {config_data.value}")
    
    # Пересчитываем все цены
    updated_prices = update_all_generation_prices(db)
    logger.info(f"Updated generation prices: {updated_prices}")
    
    return config


# ==================== FUSION CHAINS ====================

@router.get("/fusion-chains", response_model=List[FusionChainResponse])
async def list_fusion_chains(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Получить список всех Fusion-цепочек.
    """
    chains = db.query(FusionChain).all()
    return chains


@router.post("/fusion-chains", response_model=FusionChainResponse, status_code=status.HTTP_201_CREATED)
async def create_fusion_chain(
    chain_data: FusionChainCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Создать новую Fusion-цепочку.
    """
    existing = db.query(FusionChain).filter(FusionChain.name == chain_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Fusion Chain with name '{chain_data.name}' already exists"
        )
    
    chain = FusionChain(**chain_data.dict())
    db.add(chain)
    db.commit()
    db.refresh(chain)
    
    logger.info(f"Admin {current_user.username} created Fusion Chain: {chain.name}")
    return chain


# ==================== MARGIN CALCULATOR ====================

@router.get("/margin-calculator", response_model=List[MarginCalculatorResponse])
async def get_margin_calculator(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Калькулятор Маржинальности.
    Показывает полный расчет цен для всех типов генерации:
    - Себестоимость API (USD)
    - Курс USD/RUB
    - Себестоимость (₽)
    - Наценка (%)
    - Финальная цена для клиента (₽)
    - Прибыль платформы (₽)
    - Процент прибыли
    """
    summary = calculate_margin_summary(db)
    return summary


@router.get("/margin-calculator/{generation_type}", response_model=MarginCalculatorResponse)
async def get_margin_for_type(
    generation_type: GenerationType,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Получить расчет маржинальности для конкретного типа генерации.
    """
    price_info = get_generation_price(db, generation_type)
    return {
        "generation_type": generation_type.value,
        **price_info
    }

