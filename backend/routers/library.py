from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, TopCreative, Transaction, TransactionType
from schemas import TopCreativeResponse, TopCreativeDetailResponse
from auth import get_current_active_user
from payment_mock import PaymentMock

router = APIRouter(prefix="/api/library", tags=["Library"])


@router.get("/top-creatives", response_model=List[TopCreativeResponse])
def get_top_creatives(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get top 50 creatives (free access to preview)"""
    query = db.query(TopCreative).filter(TopCreative.is_approved == True)
    
    if category:
        query = query.filter(TopCreative.category == category)
    
    creatives = query.order_by(TopCreative.ai_score.desc()).offset(skip).limit(limit).all()
    
    # Increment views count
    for creative in creatives:
        creative.views_count += 1
    db.commit()
    
    return creatives


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Get available creative categories"""
    categories = db.query(TopCreative.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]


@router.post("/{creative_id}/unlock", response_model=TopCreativeDetailResponse)
def unlock_creative_details(
    creative_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Unlock creative details (prompt and full content) for 5 credits
    """
    creative = db.query(TopCreative).filter(
        TopCreative.id == creative_id,
        TopCreative.is_approved == True
    ).first()
    
    if not creative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creative not found"
        )
    
    # Check if user already unlocked this creative
    existing_unlock = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == TransactionType.LIBRARY_UNLOCK,
        Transaction.description.like(f"%creative_id:{creative_id}%")
    ).first()
    
    if existing_unlock:
        # Already unlocked, return details
        return creative
    
    # Check if user has enough credits
    unlock_cost = creative.unlock_cost
    if current_user.credits_balance < unlock_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. Required: {unlock_cost}, Available: {current_user.credits_balance}"
        )
    
    # Deduct credits
    success = PaymentMock.deduct_credits(
        db,
        current_user,
        unlock_cost,
        f"Library unlock: creative_id:{creative_id}"
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deduct credits"
        )
    
    # Increment unlock count
    creative.unlocks_count += 1
    db.commit()
    db.refresh(creative)
    
    return creative


@router.get("/{creative_id}", response_model=TopCreativeResponse)
def get_creative_preview(
    creative_id: int,
    db: Session = Depends(get_db)
):
    """Get creative preview (without prompt details)"""
    creative = db.query(TopCreative).filter(
        TopCreative.id == creative_id,
        TopCreative.is_approved == True
    ).first()
    
    if not creative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creative not found"
        )
    
    return creative

