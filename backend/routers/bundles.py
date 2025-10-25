from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
import json
from database import get_db
from models import User, CreativeBundle, Generation, GenerationType
from schemas import CreativeBundleResponse, BundlePurchaseRequest
from auth import get_current_active_user, has_premium_access
from ai_mock import AIMock, get_generation_cost
from payment_mock import PaymentMock
from datetime import datetime
from logging_config import logger

router = APIRouter(prefix="/api/bundles", tags=["Creative Bundles"])


@router.get("/available", response_model=List[CreativeBundleResponse])
def get_available_bundles(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all available creative bundles"""
    bundles = db.query(CreativeBundle).filter(CreativeBundle.is_active == True).all()
    
    # Add computed final_price
    result = []
    for bundle in bundles:
        bundle_dict = {
            "id": bundle.id,
            "name": bundle.name,
            "description": bundle.description,
            "generations_config": bundle.generations_config,
            "base_price": bundle.base_price,
            "discount_percent": bundle.discount_percent,
            "final_price": int(bundle.base_price * (1 - bundle.discount_percent / 100)),
            "requires_subscription": bundle.requires_subscription,
            "is_active": bundle.is_active
        }
        result.append(bundle_dict)
    
    return result


@router.post("/purchase/{bundle_id}")
def purchase_bundle(
    bundle_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Purchase a creative bundle and automatically create generations"""
    
    # Get bundle
    bundle = db.query(CreativeBundle).filter(
        CreativeBundle.id == bundle_id,
        CreativeBundle.is_active == True
    ).first()
    
    if not bundle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bundle not found"
        )
    
    # Check subscription requirement
    if bundle.requires_subscription and not has_premium_access(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This bundle requires an active subscription"
        )
    
    # Calculate final price
    final_price = int(bundle.base_price * (1 - bundle.discount_percent / 100))
    
    # Check credits
    if current_user.credits_balance < final_price:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. Required: {final_price}, Available: {current_user.credits_balance}"
        )
    
    try:
        # Parse generations config
        generations_config = json.loads(bundle.generations_config)
        
        # Create placeholder generations
        created_generations = []
        for gen_config in generations_config:
            gen_type = GenerationType(gen_config['type'])
            quantity = gen_config.get('quantity', 1)
            
            for _ in range(quantity):
                generation = Generation(
                    user_id=current_user.id,
                    type=gen_type,
                    cost=0,  # Already paid via bundle
                    prompt=f"Bundle: {bundle.name}",
                    status="pending",  # User will fill details later
                )
                db.add(generation)
                created_generations.append(generation)
        
        # Deduct credits
        success = PaymentMock.deduct_credits(
            db,
            current_user,
            final_price,
            f"Bundle purchase: {bundle.name}"
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to deduct credits"
            )
        
        db.commit()
        
        logger.info(f"User {current_user.id} purchased bundle {bundle.id} for {final_price} credits")
        
        return {
            "message": "Bundle purchased successfully",
            "bundle_name": bundle.name,
            "credits_spent": final_price,
            "generations_created": len(created_generations),
            "remaining_credits": current_user.credits_balance
        }
        
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid bundle configuration"
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error purchasing bundle: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to purchase bundle: {str(e)}"
        )

