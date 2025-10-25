"""
Утилиты для расчета цен в посреднической модели.
Формула: Финальная Цена (₽) = (Стоимость API в USD × Курс USD/RUB) × (1 + Наценка (%) / 100)
"""

from sqlalchemy.orm import Session
from models import PricingConfiguration, AiEngine, FusionChain, GenerationType
from typing import Dict, Optional
import math


def get_exchange_rate(db: Session) -> float:
    """
    Получить текущий курс USD/RUB из БД.
    По умолчанию: 100 рублей за доллар
    """
    config = db.query(PricingConfiguration).filter(
        PricingConfiguration.key == "usd_to_rub_exchange_rate"
    ).first()
    
    return config.value if config else 100.0


def calculate_final_price(
    base_cost_usd: float,
    markup_percentage: float,
    exchange_rate: float
) -> int:
    """
    Рассчитать финальную цену для клиента в кредитах (рублях).
    
    Args:
        base_cost_usd: Себестоимость API в USD
        markup_percentage: Процент наценки (например, 300 для 300%)
        exchange_rate: Курс USD/RUB
    
    Returns:
        int: Финальная цена в кредитах (округлено до целого числа)
    """
    cost_rub = base_cost_usd * exchange_rate
    final_price = cost_rub * (1 + markup_percentage / 100)
    return math.ceil(final_price)  # Округляем вверх


def get_generation_price(
    db: Session,
    generation_type: GenerationType
) -> Dict[str, float]:
    """
    Получить полный расчет цены для типа генерации.
    
    Returns:
        Dict с полями:
        - base_cost_usd: Себестоимость в USD
        - exchange_rate: Курс USD/RUB
        - cost_rub: Себестоимость в рублях
        - markup_percentage: Процент наценки
        - final_price_rub: Финальная цена для клиента
        - profit_rub: Прибыль платформы
        - profit_percentage: Процент прибыли от финальной цены
    """
    exchange_rate = get_exchange_rate(db)
    
    # Проверяем, является ли это Fusion-цепочкой
    fusion_chain = db.query(FusionChain).filter(
        FusionChain.generation_type == generation_type,
        FusionChain.is_active == True
    ).first()
    
    if fusion_chain:
        # Для Fusion используем суммарную стоимость цепочки
        base_cost_usd = fusion_chain.total_cost_usd
        markup_percentage = fusion_chain.markup_percentage
    else:
        # Для обычной генерации находим соответствующий движок
        engine = db.query(AiEngine).filter(
            AiEngine.generation_type == generation_type,
            AiEngine.is_active == True
        ).first()
        
        if not engine:
            # Возвращаем значения по умолчанию, если движок не найден
            return {
                "base_cost_usd": 0.0,
                "exchange_rate": exchange_rate,
                "cost_rub": 0.0,
                "markup_percentage": 0.0,
                "final_price_rub": 0,
                "profit_rub": 0.0,
                "profit_percentage": 0.0
            }
        
        base_cost_usd = engine.internal_cost_usd_per_unit
        markup_percentage = engine.markup_percentage
    
    cost_rub = base_cost_usd * exchange_rate
    final_price_rub = calculate_final_price(base_cost_usd, markup_percentage, exchange_rate)
    profit_rub = final_price_rub - cost_rub
    profit_percentage = (profit_rub / final_price_rub * 100) if final_price_rub > 0 else 0.0
    
    return {
        "base_cost_usd": base_cost_usd,
        "exchange_rate": exchange_rate,
        "cost_rub": cost_rub,
        "markup_percentage": markup_percentage,
        "final_price_rub": final_price_rub,
        "profit_rub": profit_rub,
        "profit_percentage": profit_percentage
    }


def update_all_generation_prices(db: Session) -> Dict[str, int]:
    """
    Пересчитать цены для всех типов генерации.
    Используется при изменении курса USD/RUB или наценок.
    
    Returns:
        Dict[GenerationType, final_price_rub]
    """
    prices = {}
    
    for gen_type in GenerationType:
        price_info = get_generation_price(db, gen_type)
        prices[gen_type.value] = price_info["final_price_rub"]
    
    return prices


def calculate_margin_summary(db: Session) -> list:
    """
    Получить сводку по маржинальности для всех типов генерации.
    Используется в Калькуляторе Маржинальности в админке.
    """
    summary = []
    
    for gen_type in GenerationType:
        price_info = get_generation_price(db, gen_type)
        summary.append({
            "generation_type": gen_type.value,
            **price_info
        })
    
    return summary

