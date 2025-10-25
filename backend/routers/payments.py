from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models import User, CreditPackage, SubscriptionTier
from schemas import PaymentCreate, PaymentResponse, WebhookPayload
from auth import get_current_active_user
from payment_mock import PaymentMock, SUBSCRIPTION_PRICES

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.post("/create", response_model=PaymentResponse)
def create_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a payment for subscription or credit purchase"""
    
    if payment_data.type == "subscription":
        if not payment_data.tier:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tier is required for subscription payment"
            )
        
        try:
            tier_enum = SubscriptionTier(payment_data.tier)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid subscription tier"
            )
        
        amount = SUBSCRIPTION_PRICES.get(tier_enum, 0)
        description = f"Subscription: {tier_enum.value}"
        metadata = {
            "user_id": current_user.id,
            "type": "subscription",
            "tier": tier_enum.value
        }
    
    elif payment_data.type == "credits":
        if not payment_data.package_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Package ID is required for credit purchase"
            )
        
        package = db.query(CreditPackage).filter(
            CreditPackage.id == payment_data.package_id,
            CreditPackage.is_active == True
        ).first()
        
        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Credit package not found"
            )
        
        amount = package.price_rub
        description = f"Credit package: {package.name}"
        metadata = {
            "user_id": current_user.id,
            "type": "credits",
            "credits_amount": package.credits_amount,
            "bonus_percent": package.bonus_percent
        }
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment type"
        )
    
    # Create mock payment
    payment_result = PaymentMock.create_payment(amount, description, metadata)
    
    return {
        "payment_id": payment_result["payment_id"],
        "confirmation_url": payment_result["confirmation_url"],
        "amount": payment_result["amount"]
    }


@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook handler for payment confirmations (mock)
    In production, this should validate ЮKassa signature
    """
    data = await request.json()
    
    payment_id = data.get("payment_id")
    status = data.get("status")
    amount = data.get("amount")
    metadata = data.get("metadata")
    
    if not all([payment_id, status, amount, metadata]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook payload"
        )
    
    success = PaymentMock.process_payment_webhook(
        db, payment_id, status, amount, metadata
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to process payment"
        )
    
    return {"status": "ok"}


@router.get("/credit-packages")
def get_credit_packages(db: Session = Depends(get_db)):
    """Get available credit packages"""
    packages = db.query(CreditPackage).filter(CreditPackage.is_active == True).all()
    return packages


@router.get("/subscription-plans")
def get_subscription_plans():
    """Get available subscription plans"""
    return [
        {
            "tier": "free",
            "name": "Бесплатный (Free)",
            "price": 0,
            "credits": 50,
            "premium_access": False,
            "features": ["50 тестовых кредитов", "Базовая генерация изображений"]
        },
        {
            "tier": "starter",
            "name": "Базовый (Starter)",
            "price": 2990,
            "credits": 1500,
            "premium_access": True,
            "features": [
                "1500 кредитов в месяц",
                "Доступ ко всем типам генерации",
                "AI-скоринг креативов",
                "Скидки на комплекты"
            ]
        },
        {
            "tier": "pro",
            "name": "Профессиональный (Pro)",
            "price": 6990,
            "credits": 4000,
            "premium_access": True,
            "features": [
                "4000 кредитов в месяц",
                "Все функции Starter",
                "API-доступ",
                "Приоритетная поддержка"
            ]
        },
        {
            "tier": "agency",
            "name": "Агентский (Agency)",
            "price": 14990,
            "credits": 10000,
            "premium_access": True,
            "features": [
                "10000 кредитов в месяц",
                "Все функции Pro",
                "Управление командой",
                "Белый лейбл (скоро)"
            ]
        }
    ]

