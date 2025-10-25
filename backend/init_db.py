"""
Initialize database with seed data
"""
from database import SessionLocal, engine, Base
from models import (
    User, PricingConfig, CreditPackage, TopCreative, SubscriptionTier, CreativeBundle,
    AiEngine, PricingConfiguration, FusionChain, GenerationType
)
from auth import get_password_hash
from ai_mock import GENERATION_COSTS, PREMIUM_FEATURES
import json


def init_db():
    """Initialize database with default data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_user = db.query(User).first()
        if existing_user:
            print("Database already initialized")
            return
        
        # Create admin user
        admin = User(
            email="admin@example.com",
            username="admin",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            credits_balance=10000,
            subscription_tier=SubscriptionTier.AGENCY,
            is_admin=True
        )
        db.add(admin)
        
        # Create test user
        test_user = User(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            hashed_password=get_password_hash("test123"),
            credits_balance=50,
            subscription_tier=SubscriptionTier.FREE
        )
        db.add(test_user)
        
        # Create pricing configurations
        for gen_type, cost in GENERATION_COSTS.items():
            pricing = PricingConfig(
                generation_type=gen_type,
                cost_credits=cost,
                requires_subscription=gen_type in PREMIUM_FEATURES,
                description=f"Pricing for {gen_type}"
            )
            db.add(pricing)
        
        # Create credit packages
        packages = [
            {
                "name": "Стартовый пакет",
                "credits_amount": 500,
                "price_rub": 500,
                "bonus_percent": 0,
                "description": "Базовый пакет для начала работы"
            },
            {
                "name": "Популярный",
                "credits_amount": 1000,
                "price_rub": 950,
                "bonus_percent": 5,
                "description": "Экономия 5% + бонусные кредиты"
            },
            {
                "name": "Профессиональный",
                "credits_amount": 3000,
                "price_rub": 2700,
                "bonus_percent": 10,
                "description": "Экономия 10% + бонусные кредиты"
            },
            {
                "name": "Максимальный",
                "credits_amount": 10000,
                "price_rub": 8500,
                "bonus_percent": 15,
                "description": "Максимальная экономия 15% + бонусные кредиты"
            }
        ]
        
        for pkg in packages:
            package = CreditPackage(**pkg)
            db.add(package)
        
        # Create sample top creatives
        sample_creatives = [
            {
                "title": "Летняя распродажа — Яркий креатив",
                "description": "Эффективный креатив для летней распродажи одежды",
                "category": "ecommerce",
                "preview_url": "https://mock-storage.example.com/previews/summer_sale.jpg",
                "full_url": "https://mock-storage.example.com/full/summer_sale.jpg",
                "prompt": "Modern summer sale banner, bright colors, fashion items, discount tags, professional photography",
                "ai_score": 92,
                "is_approved": True,
                "views_count": 150,
                "unlocks_count": 12
            },
            {
                "title": "Финансовые услуги — Доверие",
                "description": "Креатив для финансовых продуктов с акцентом на надежность",
                "category": "finance",
                "preview_url": "https://mock-storage.example.com/previews/finance_trust.jpg",
                "full_url": "https://mock-storage.example.com/full/finance_trust.jpg",
                "prompt": "Financial services ad, trust and security theme, professional look, blue tones, minimal design",
                "ai_score": 89,
                "is_approved": True,
                "views_count": 98,
                "unlocks_count": 8
            },
            {
                "title": "Стриминг — Новый сезон",
                "description": "Анонс нового сезона сериала для стриминговой платформы",
                "category": "entertainment",
                "preview_url": "https://mock-storage.example.com/previews/streaming_season.jpg",
                "full_url": "https://mock-storage.example.com/full/streaming_season.jpg",
                "prompt": "TV series announcement, dramatic lighting, cinematic style, streaming platform branding",
                "ai_score": 95,
                "is_approved": True,
                "views_count": 210,
                "unlocks_count": 25
            }
        ]
        
        for creative_data in sample_creatives:
            creative = TopCreative(**creative_data)
            db.add(creative)
        
        # Create creative bundles (комплекты со скидкой 15%)
        bundles = [
            {
                "name": "Старт Кампании",
                "description": "Идеальный набор для запуска новой рекламной кампании",
                "generations_config": json.dumps([
                    {"type": "static_image", "quantity": 3},
                    {"type": "animated_image", "quantity": 1}
                ]),
                "base_price": 550,  # 3*100 + 1*250 = 550
                "discount_percent": 15,  # Финальная цена: 467
                "requires_subscription": True,
                "is_active": True
            },
            {
                "name": "Максимум Теста",
                "description": "Комплект для масштабного A/B тестирования креативов",
                "generations_config": json.dumps([
                    {"type": "static_image", "quantity": 5},
                    {"type": "animated_image", "quantity": 2},
                    {"type": "ai_scoring", "quantity": 3}
                ]),
                "base_price": 1060,  # 5*100 + 2*250 + 3*20 = 1060
                "discount_percent": 15,  # Финальная цена: 901
                "requires_subscription": True,
                "is_active": True
            },
            {
                "name": "Премиум Пакет",
                "description": "Полный набор для профессионалов с видео-контентом",
                "generations_config": json.dumps([
                    {"type": "static_image", "quantity": 3},
                    {"type": "animated_image", "quantity": 2},
                    {"type": "video_morph", "quantity": 1},
                    {"type": "contextual_photo", "quantity": 1},
                    {"type": "ai_scoring", "quantity": 2}
                ]),
                "base_price": 1390,  # 3*100 + 2*250 + 400 + 150 + 2*20 = 1390
                "discount_percent": 15,  # Финальная цена: 1181
                "requires_subscription": True,
                "is_active": True
            }
        ]
        
        for bundle_data in bundles:
            bundle = CreativeBundle(**bundle_data)
            db.add(bundle)
        
        # ==================== ПОСРЕДНИЧЕСКАЯ МОДЕЛЬ: Курс USD/RUB ====================
        usd_to_rub = PricingConfiguration(
            key="usd_to_rub_exchange_rate",
            value=100.0,  # По умолчанию: 100 рублей за доллар
            description="Курс обмена USD/RUB для расчета себестоимости API"
        )
        db.add(usd_to_rub)
        
        # ==================== ПОСРЕДНИЧЕСКАЯ МОДЕЛЬ: AI-Движки ====================
        ai_engines = [
            {
                "name": "Recraft.ai",
                "description": "Премиум AI для векторной графики и масштабируемых логотипов",
                "role": "Векторная графика, логотипы, иконки (SVG)",
                "api_endpoint": "https://api.recraft.ai/v1/generate",
                "api_key_encrypted": "mock_recraft_key_123",
                "internal_cost_usd_per_unit": 0.30,  # $0.30 за векторную генерацию
                "markup_percentage": 300.0,  # 300% наценка -> 120₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.VECTOR_CREATIVE
            },
            {
                "name": "DALL-E 3",
                "description": "OpenAI DALL-E 3 для статичных изображений высокого качества",
                "role": "Генерация фотореалистичных изображений",
                "api_endpoint": "https://api.openai.com/v1/images/generations",
                "api_key_encrypted": "mock_openai_key_456",
                "internal_cost_usd_per_unit": 0.20,  # $0.20 за изображение
                "markup_percentage": 400.0,  # 400% наценка -> 100₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.STATIC_IMAGE
            },
            {
                "name": "Stable Diffusion XL",
                "description": "Open-source модель для генерации изображений",
                "role": "Генерация изображений (альтернатива DALL-E)",
                "api_endpoint": "https://api.stability.ai/v1/generation",
                "api_key_encrypted": "mock_stability_key_789",
                "internal_cost_usd_per_unit": 0.05,  # $0.05 за изображение
                "markup_percentage": 1900.0,  # 1900% наценка -> 100₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.STATIC_IMAGE
            },
            {
                "name": "RunwayML Gen-2",
                "description": "AI для создания анимированных изображений и GIF",
                "role": "Анимация изображений, GIF, короткие видео",
                "api_endpoint": "https://api.runwayml.com/v1/generate",
                "api_key_encrypted": "mock_runway_key_abc",
                "internal_cost_usd_per_unit": 0.50,  # $0.50 за анимацию
                "markup_percentage": 400.0,  # 400% наценка -> 250₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.ANIMATED_IMAGE
            },
            {
                "name": "Pika Labs",
                "description": "AI для видео-морфинга между двумя изображениями",
                "role": "Видео-морфинг, трансформация изображений",
                "api_endpoint": "https://api.pika.art/v1/morph",
                "api_key_encrypted": "mock_pika_key_def",
                "internal_cost_usd_per_unit": 0.80,  # $0.80 за видео
                "markup_percentage": 400.0,  # 400% наценка -> 400₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.VIDEO_MORPH
            },
            {
                "name": "GPT-4 Vision",
                "description": "OpenAI GPT-4 Vision для анализа контекста и генерации промптов",
                "role": "Анализ URL, извлечение контекста, генерация промптов",
                "api_endpoint": "https://api.openai.com/v1/chat/completions",
                "api_key_encrypted": "mock_gpt4v_key_ghi",
                "internal_cost_usd_per_unit": 0.30,  # $0.30 за анализ + генерация
                "markup_percentage": 400.0,  # 400% наценка -> 150₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.CONTEXTUAL_PHOTO
            },
            {
                "name": "GPT-4 Creative Scoring",
                "description": "AI-скоринг креативов на основе конверсионного анализа",
                "role": "Анализ креативов, оценка конверсии, рекомендации",
                "api_endpoint": "https://api.openai.com/v1/chat/completions",
                "api_key_encrypted": "mock_gpt4_scoring_jkl",
                "internal_cost_usd_per_unit": 0.04,  # $0.04 за скоринг
                "markup_percentage": 400.0,  # 400% наценка -> 20₽ финальная цена
                "is_active": True,
                "generation_type": GenerationType.AI_SCORING
            }
        ]
        
        for engine_data in ai_engines:
            engine = AiEngine(**engine_data)
            db.add(engine)
        
        # ==================== ПОСРЕДНИЧЕСКАЯ МОДЕЛЬ: Fusion-Цепочки ====================
        fusion_chains = [
            {
                "name": "Брендовый Сет",
                "description": "Fusion-цепочка: Recraft.ai + Постобработка Brand Colors. Генерация 3-х креативов в едином брендовом стиле.",
                "generation_type": GenerationType.BRANDED_SET,
                "chain_config": json.dumps([
                    {"engine_name": "Recraft.ai", "order": 1, "role": "Генерация векторной основы"},
                    {"engine_name": "Brand Color Processor", "order": 2, "role": "Применение цветов бренда"},
                    {"engine_name": "Style Consistency Check", "order": 3, "role": "Проверка консистентности"}
                ]),
                "total_cost_usd": 0.40,  # $0.30 (Recraft) + $0.10 (постобработка)
                "markup_percentage": 400.0,  # 400% наценка -> 200₽ финальная цена
                "is_active": True
            }
        ]
        
        for chain_data in fusion_chains:
            chain = FusionChain(**chain_data)
            db.add(chain)
        
        # ==================== Обновление PricingConfig для новых типов ====================
        new_pricing = [
            {
                "generation_type": "vector_creative",
                "cost_credits": 120,
                "requires_subscription": False,
                "description": "Векторный креатив (Recraft.ai) - масштабируемая графика"
            },
            {
                "generation_type": "branded_set",
                "cost_credits": 200,
                "requires_subscription": True,
                "description": "Брендовый Сет (Fusion) - 3 креатива в едином стиле"
            }
        ]
        
        for pricing_data in new_pricing:
            pricing = PricingConfig(**pricing_data)
            db.add(pricing)
        
        db.commit()
        print("Database initialized successfully!")
        print("\n=== Test credentials ===")
        print("Admin: username=admin, password=admin123")
        print("User: username=testuser, password=test123")
        print("\n=== Created bundles ===")
        for b in bundles:
            final_price = int(b['base_price'] * (1 - b['discount_percent'] / 100))
            saving = b['base_price'] - final_price
            print(f"- {b['name']}: {final_price}₽ (экономия {saving}₽)")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

