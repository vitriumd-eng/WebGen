"""
Mock implementation of ЮKassa payment system
"""
import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from models import User, Transaction, Subscription, SubscriptionTier, TransactionType


# Pricing configuration
SUBSCRIPTION_PRICES = {
    SubscriptionTier.FREE: 0,
    SubscriptionTier.STARTER: 2990,
    SubscriptionTier.PRO: 6990,
    SubscriptionTier.AGENCY: 14990,
}

SUBSCRIPTION_CREDITS = {
    SubscriptionTier.FREE: 50,
    SubscriptionTier.STARTER: 1500,
    SubscriptionTier.PRO: 4000,
    SubscriptionTier.AGENCY: 10000,
}


class PaymentMock:
    """Mock payment processor for ЮKassa"""
    
    @staticmethod
    def create_payment(amount: float, description: str, metadata: dict) -> dict:
        """
        Create a mock payment
        Returns mock payment confirmation URL
        """
        payment_id = f"mock_{uuid.uuid4().hex[:16]}"
        confirmation_url = f"https://mock-yukassa.ru/payment/{payment_id}"
        
        return {
            "payment_id": payment_id,
            "confirmation_url": confirmation_url,
            "amount": amount,
            "status": "pending",
            "metadata": metadata
        }
    
    @staticmethod
    def process_payment_webhook(
        db: Session,
        payment_id: str,
        status: str,
        amount: float,
        metadata: Optional[dict] = None
    ) -> bool:
        """
        Process webhook from payment system (mock)
        In production, this would be called by actual ЮKassa webhook
        """
        if status != "succeeded":
            return False
        
        if not metadata:
            return False
        
        user_id = metadata.get("user_id")
        payment_type = metadata.get("type")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        if payment_type == "subscription":
            tier = metadata.get("tier")
            return PaymentMock._activate_subscription(db, user, tier, payment_id, amount)
        elif payment_type == "credits":
            credits_amount = metadata.get("credits_amount")
            bonus_percent = metadata.get("bonus_percent", 0)
            return PaymentMock._add_credits(db, user, credits_amount, bonus_percent, payment_id, amount)
        
        return False
    
    @staticmethod
    def _activate_subscription(
        db: Session,
        user: User,
        tier: str,
        payment_id: str,
        amount: float
    ) -> bool:
        """Activate or update user subscription"""
        from datetime import timedelta
        
        try:
            tier_enum = SubscriptionTier(tier)
        except ValueError:
            return False
        
        # Update user subscription tier
        user.subscription_tier = tier_enum
        
        # Create or update subscription record
        subscription = db.query(Subscription).filter(Subscription.user_id == user.id).first()
        if subscription:
            subscription.tier = tier_enum
            subscription.start_date = datetime.utcnow()
            subscription.end_date = datetime.utcnow() + timedelta(days=30)
            subscription.is_active = True
        else:
            subscription = Subscription(
                user_id=user.id,
                tier=tier_enum,
                start_date=datetime.utcnow(),
                end_date=datetime.utcnow() + timedelta(days=30),
                is_active=True
            )
            db.add(subscription)
        
        # Add subscription credits
        included_credits = SUBSCRIPTION_CREDITS.get(tier_enum, 0)
        user.credits_balance += included_credits
        
        # Create transaction record
        transaction = Transaction(
            user_id=user.id,
            type=TransactionType.SUBSCRIPTION,
            amount=amount,
            credits_change=included_credits,
            description=f"Subscription: {tier_enum.value}",
            payment_id=payment_id,
            status="completed"
        )
        db.add(transaction)
        
        db.commit()
        return True
    
    @staticmethod
    def _add_credits(
        db: Session,
        user: User,
        credits_amount: int,
        bonus_percent: int,
        payment_id: str,
        amount: float
    ) -> bool:
        """Add credits to user account"""
        total_credits = credits_amount + (credits_amount * bonus_percent // 100)
        user.credits_balance += total_credits
        
        # Create transaction record
        transaction = Transaction(
            user_id=user.id,
            type=TransactionType.CREDIT_PURCHASE,
            amount=amount,
            credits_change=total_credits,
            description=f"Credit purchase: {credits_amount} + {bonus_percent}% bonus",
            payment_id=payment_id,
            status="completed"
        )
        db.add(transaction)
        
        db.commit()
        return True
    
    @staticmethod
    def deduct_credits(db: Session, user: User, amount: int, description: str) -> bool:
        """Deduct credits from user account"""
        if user.credits_balance < amount:
            return False
        
        user.credits_balance -= amount
        
        # Create transaction record
        transaction = Transaction(
            user_id=user.id,
            type=TransactionType.CREDIT_USAGE,
            amount=0,
            credits_change=-amount,
            description=description,
            status="completed"
        )
        db.add(transaction)
        
        db.commit()
        return True

