from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    AGENCY = "agency"


class GenerationType(str, enum.Enum):
    STATIC_IMAGE = "static_image"
    ANIMATED_IMAGE = "animated_image"
    VIDEO_MORPH = "video_morph"
    CONTEXTUAL_PHOTO = "contextual_photo"
    AI_SCORING = "ai_scoring"
    VECTOR_CREATIVE = "vector_creative"  # Recraft.ai
    BRANDED_SET = "branded_set"  # Fusion: Recraft + Brand Colors


class TransactionType(str, enum.Enum):
    SUBSCRIPTION = "subscription"
    CREDIT_PURCHASE = "credit_purchase"
    CREDIT_USAGE = "credit_usage"
    BONUS = "bonus"
    LIBRARY_UNLOCK = "library_unlock"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    credits_balance = Column(Integer, default=0)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    transactions = relationship("Transaction", back_populates="user")
    generations = relationship("Generation", back_populates="user")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    tier = Column(Enum(SubscriptionTier), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    auto_renew = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="subscription")


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    credits_change = Column(Integer, default=0)
    description = Column(String)
    payment_id = Column(String, unique=True, nullable=True)  # ЮKassa payment ID
    status = Column(String, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="transactions")


class Generation(Base):
    __tablename__ = "generations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum(GenerationType), nullable=False)
    cost = Column(Integer, nullable=False)
    prompt = Column(Text)
    parameters = Column(Text)  # JSON string
    result_url = Column(String, nullable=True)
    status = Column(String, default="processing")  # processing, completed, failed
    ai_score = Column(Integer, nullable=True)  # For AI scoring
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="generations")


class TopCreative(Base):
    __tablename__ = "top_creatives"
    
    id = Column(Integer, primary_key=True, index=True)
    generation_id = Column(Integer, ForeignKey("generations.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)  # e.g., "ecommerce", "finance", "entertainment"
    preview_url = Column(String, nullable=False)
    full_url = Column(String, nullable=False)
    prompt = Column(Text, nullable=False)
    unlock_cost = Column(Integer, default=5)  # Cost to view prompt details
    views_count = Column(Integer, default=0)
    unlocks_count = Column(Integer, default=0)
    ai_score = Column(Integer, default=85)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    generation = relationship("Generation")


class PricingConfig(Base):
    __tablename__ = "pricing_config"
    
    id = Column(Integer, primary_key=True, index=True)
    generation_type = Column(String, unique=True, nullable=False)
    cost_credits = Column(Integer, nullable=False)
    requires_subscription = Column(Boolean, default=False)
    description = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CreditPackage(Base):
    __tablename__ = "credit_packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    credits_amount = Column(Integer, nullable=False)
    price_rub = Column(Float, nullable=False)
    bonus_percent = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    description = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CreativeBundle(Base):
    __tablename__ = "creative_bundles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    generations_config = Column(Text, nullable=False)  # JSON string with generation types and quantities
    base_price = Column(Integer, nullable=False)  # Price without discount
    discount_percent = Column(Integer, default=15)
    requires_subscription = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AiEngine(Base):
    """
    Модель для управления AI-агентами (посредническая модель).
    Хранит себестоимость API и наценку для каждого движка.
    """
    __tablename__ = "ai_engines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)  # e.g., "Recraft.ai", "DALL-E 3", "Stable Diffusion"
    description = Column(Text)
    role = Column(String)  # e.g., "Векторная графика", "Генерация изображений"
    api_endpoint = Column(String)  # Endpoint URL (заглушка)
    api_key_encrypted = Column(String)  # В продакшене зашифровать
    internal_cost_usd_per_unit = Column(Float, nullable=False, default=0.0)  # Себестоимость в USD
    markup_percentage = Column(Float, nullable=False, default=300.0)  # Наценка в процентах (300% = x4)
    is_active = Column(Boolean, default=True)
    generation_type = Column(Enum(GenerationType), nullable=True)  # Связь с типом генерации
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PricingConfiguration(Base):
    """
    Глобальные настройки ценообразования (посредническая модель).
    """
    __tablename__ = "pricing_configuration"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)  # e.g., "usd_to_rub_exchange_rate"
    value = Column(Float, nullable=False)
    description = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FusionChain(Base):
    """
    Модель для хранения конфигураций Fusion-цепочек.
    Пример: Брендовый Сет = Recraft.ai + Постобработка Brand Colors
    """
    __tablename__ = "fusion_chains"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)  # e.g., "Брендовый Сет"
    description = Column(Text)
    generation_type = Column(Enum(GenerationType), nullable=False)  # BRANDED_SET
    chain_config = Column(Text, nullable=False)  # JSON: [{"engine_id": 1, "order": 1}, {"engine_id": 2, "order": 2}]
    total_cost_usd = Column(Float, nullable=False)  # Суммарная себестоимость всех агентов в цепочке
    markup_percentage = Column(Float, nullable=False, default=250.0)  # Наценка для всей цепочки
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

