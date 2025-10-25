from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from models import SubscriptionTier, GenerationType, TransactionType
import re


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str
    
    @validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
            raise ValueError('Username must be 3-20 characters long and contain only letters, numbers, and underscores')
        if v.lower() in ['admin', 'root', 'system', 'api']:
            raise ValueError('This username is reserved')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserResponse(UserBase):
    id: int
    credits_balance: int
    subscription_tier: SubscriptionTier
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Subscription Schemas
class SubscriptionResponse(BaseModel):
    id: int
    tier: SubscriptionTier
    start_date: datetime
    end_date: Optional[datetime]
    is_active: bool
    auto_renew: bool
    
    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionCreate(BaseModel):
    type: TransactionType
    amount: float
    credits_change: int
    description: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    type: TransactionType
    amount: float
    credits_change: int
    description: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Generation Schemas
class GenerationRequest(BaseModel):
    type: GenerationType
    prompt: Optional[str] = None
    parameters: Optional[dict] = None


class GenerationResponse(BaseModel):
    id: int
    type: GenerationType
    cost: int
    prompt: Optional[str]
    result_url: Optional[str]
    status: str
    ai_score: Optional[int]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Top Creative Schemas
class TopCreativeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    preview_url: str
    unlock_cost: int
    views_count: int
    unlocks_count: int
    ai_score: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class TopCreativeDetailResponse(TopCreativeResponse):
    full_url: str
    prompt: str


# Pricing Schemas
class PricingConfigResponse(BaseModel):
    generation_type: str
    cost_credits: int
    requires_subscription: bool
    description: Optional[str]
    
    class Config:
        from_attributes = True


# Payment Schemas
class PaymentCreate(BaseModel):
    type: str  # "subscription" or "credits"
    package_id: Optional[int] = None
    tier: Optional[SubscriptionTier] = None


class PaymentResponse(BaseModel):
    payment_id: str
    confirmation_url: str
    amount: float


class WebhookPayload(BaseModel):
    payment_id: str
    status: str
    amount: float
    metadata: Optional[dict] = None


# Creative Bundle Schemas
class CreativeBundleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    generations_config: str
    base_price: int
    discount_percent: int
    final_price: int
    requires_subscription: bool
    is_active: bool
    
    class Config:
        from_attributes = True
    
    @property
    def final_price(self) -> int:
        return int(self.base_price * (1 - self.discount_percent / 100))


class BundlePurchaseRequest(BaseModel):
    bundle_id: int


# AI Engine Schemas (для посреднической модели)
class AiEngineBase(BaseModel):
    name: str
    description: Optional[str] = None
    role: Optional[str] = None
    api_endpoint: Optional[str] = None
    internal_cost_usd_per_unit: float
    markup_percentage: float
    is_active: bool = True
    generation_type: Optional[GenerationType] = None


class AiEngineCreate(AiEngineBase):
    api_key_encrypted: Optional[str] = None


class AiEngineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    internal_cost_usd_per_unit: Optional[float] = None
    markup_percentage: Optional[float] = None
    is_active: Optional[bool] = None


class AiEngineResponse(AiEngineBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Pricing Configuration Schemas
class PricingConfigurationResponse(BaseModel):
    id: int
    key: str
    value: float
    description: Optional[str]
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PricingConfigurationUpdate(BaseModel):
    value: float


# Fusion Chain Schemas
class FusionChainResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    generation_type: GenerationType
    chain_config: str
    total_cost_usd: float
    markup_percentage: float
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class FusionChainCreate(BaseModel):
    name: str
    description: Optional[str] = None
    generation_type: GenerationType
    chain_config: str  # JSON string
    total_cost_usd: float
    markup_percentage: float = 250.0


# Margin Calculator Response (для отображения в админке)
class MarginCalculatorResponse(BaseModel):
    generation_type: str
    base_cost_usd: float
    exchange_rate: float
    cost_rub: float  # Себестоимость в рублях
    markup_percentage: float
    final_price_rub: int  # Финальная цена для клиента
    profit_rub: float  # Ваша прибыль
    profit_percentage: float  # Процент прибыли от финальной цены

