from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
from database import get_db
from models import (
    User, Subscription, Transaction, Generation, TopCreative,
    PricingConfig, CreditPackage, SubscriptionTier
)
from auth import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/dashboard")
def get_dashboard_stats(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard KPIs"""
    
    # Total users
    total_users = db.query(func.count(User.id)).scalar()
    
    # Active subscriptions
    active_subscriptions = db.query(func.count(Subscription.id)).filter(
        Subscription.is_active == True,
        Subscription.tier != SubscriptionTier.FREE
    ).scalar()
    
    # MRR (Monthly Recurring Revenue)
    from payment_mock import SUBSCRIPTION_PRICES
    subscription_counts = db.query(
        Subscription.tier,
        func.count(Subscription.id)
    ).filter(
        Subscription.is_active == True
    ).group_by(Subscription.tier).all()
    
    mrr = sum(
        SUBSCRIPTION_PRICES.get(tier, 0) * count
        for tier, count in subscription_counts
    )
    
    # Total transactions this month
    first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_transactions = db.query(func.sum(Transaction.amount)).filter(
        Transaction.created_at >= first_day_of_month,
        Transaction.status == "completed"
    ).scalar() or 0
    
    # Total generations this month
    monthly_generations = db.query(func.count(Generation.id)).filter(
        Generation.created_at >= first_day_of_month
    ).scalar()
    
    # Churn rate (subscriptions ending soon)
    next_week = datetime.utcnow() + timedelta(days=7)
    expiring_soon = db.query(func.count(Subscription.id)).filter(
        Subscription.is_active == True,
        Subscription.end_date <= next_week,
        Subscription.auto_renew == False
    ).scalar()
    
    return {
        "total_users": total_users,
        "active_subscriptions": active_subscriptions,
        "mrr": mrr,
        "monthly_revenue": monthly_transactions,
        "monthly_generations": monthly_generations,
        "expiring_subscriptions": expiring_soon
    }


@router.get("/users")
def get_all_users(
    skip: int = 0,
    limit: int = 50,
    tier: Optional[str] = None,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users with filters"""
    query = db.query(User)
    
    if tier:
        try:
            tier_enum = SubscriptionTier(tier)
            query = query.filter(User.subscription_tier == tier_enum)
        except ValueError:
            pass
    
    users = query.offset(skip).limit(limit).all()
    return users


@router.patch("/users/{user_id}/credits")
def update_user_credits(
    user_id: int,
    credits: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Manually adjust user credits"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    old_balance = user.credits_balance
    user.credits_balance = credits
    
    # Create transaction record
    transaction = Transaction(
        user_id=user.id,
        type="bonus",
        amount=0,
        credits_change=credits - old_balance,
        description=f"Manual adjustment by admin (ID: {admin_user.id})",
        status="completed"
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(user)
    
    return {"user_id": user.id, "new_balance": user.credits_balance}


@router.get("/pricing-config")
def get_pricing_config(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all pricing configurations"""
    configs = db.query(PricingConfig).all()
    return configs


@router.patch("/pricing-config/{config_id}")
def update_pricing_config(
    config_id: int,
    cost_credits: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update pricing for a generation type"""
    config = db.query(PricingConfig).filter(PricingConfig.id == config_id).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pricing config not found"
        )
    
    config.cost_credits = cost_credits
    config.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(config)
    
    return config


@router.get("/credit-packages")
def get_credit_packages_admin(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all credit packages (including inactive)"""
    packages = db.query(CreditPackage).all()
    return packages


@router.post("/credit-packages")
def create_credit_package(
    name: str,
    credits_amount: int,
    price_rub: float,
    bonus_percent: int = 0,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new credit package"""
    package = CreditPackage(
        name=name,
        credits_amount=credits_amount,
        price_rub=price_rub,
        bonus_percent=bonus_percent,
        is_active=True
    )
    
    db.add(package)
    db.commit()
    db.refresh(package)
    
    return package


@router.get("/top-creatives/pending")
def get_pending_creatives(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get creatives pending moderation"""
    pending = db.query(TopCreative).filter(
        TopCreative.is_approved == False
    ).order_by(TopCreative.created_at.desc()).all()
    
    return pending


@router.patch("/top-creatives/{creative_id}/approve")
def approve_creative(
    creative_id: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Approve a creative for Top-50 library"""
    creative = db.query(TopCreative).filter(TopCreative.id == creative_id).first()
    
    if not creative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creative not found"
        )
    
    creative.is_approved = True
    db.commit()
    db.refresh(creative)
    
    return creative


@router.get("/alerts")
def get_alerts(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin alerts (expired subscriptions, support requests, etc.)"""
    
    # Expired subscriptions
    expired_subs = db.query(Subscription).filter(
        Subscription.end_date < datetime.utcnow(),
        Subscription.is_active == True
    ).all()
    
    # Low credit users (premium users with <100 credits)
    low_credit_users = db.query(User).filter(
        User.credits_balance < 100,
        User.subscription_tier != SubscriptionTier.FREE
    ).all()
    
    return {
        "expired_subscriptions": len(expired_subs),
        "low_credit_premium_users": len(low_credit_users),
        "pending_moderations": db.query(func.count(TopCreative.id)).filter(
            TopCreative.is_approved == False
        ).scalar()
    }

