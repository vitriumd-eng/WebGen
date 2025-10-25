from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
from database import get_db
from models import User, Generation, GenerationType
from schemas import GenerationRequest, GenerationResponse
from auth import get_current_active_user, has_premium_access
from ai_mock import AIMock, get_generation_cost, is_premium_feature
from payment_mock import PaymentMock
from datetime import datetime

router = APIRouter(prefix="/api/generation", tags=["Generation"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/create", response_model=GenerationResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("60/hour")
def create_generation(
    request: Request,
    gen_request: GenerationRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new content generation request"""
    
    # Check if feature requires premium subscription
    if is_premium_feature(gen_request.type.value) and not has_premium_access(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires an active subscription"
        )
    
    # Get generation cost
    cost = get_generation_cost(gen_request.type.value)
    
    # Check if user has enough credits
    if current_user.credits_balance < cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. Required: {cost}, Available: {current_user.credits_balance}"
        )
    
    # Create generation record
    generation = Generation(
        user_id=current_user.id,
        type=gen_request.type,
        cost=cost,
        prompt=gen_request.prompt,
        parameters=str(gen_request.parameters) if gen_request.parameters else None,
        status="processing"
    )
    
    db.add(generation)
    db.commit()
    db.refresh(generation)
    
    # Process generation based on type
    try:
        if gen_request.type == GenerationType.STATIC_IMAGE:
            result = AIMock.generate_static_image(gen_request.prompt or "", gen_request.parameters)
        
        elif gen_request.type == GenerationType.ANIMATED_IMAGE:
            result = AIMock.generate_animated_image(gen_request.prompt or "", gen_request.parameters)
        
        elif gen_request.type == GenerationType.VIDEO_MORPH:
            params = gen_request.parameters or {}
            result = AIMock.generate_video_morph(
                params.get("start_image", ""),
                params.get("end_image", ""),
                params
            )
        
        elif gen_request.type == GenerationType.CONTEXTUAL_PHOTO:
            params = gen_request.parameters or {}
            result = AIMock.generate_contextual_photo(
                params.get("url", ""),
                gen_request.prompt or "",
                params
            )
        
        elif gen_request.type == GenerationType.AI_SCORING:
            params = gen_request.parameters or {}
            result = AIMock.analyze_conversion_score(
                params.get("image_url", ""),
                params
            )
            generation.ai_score = result.get("score")
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid generation type"
            )
        
        # Update generation record with result
        generation.result_url = result.get("url", "")
        generation.status = "completed"
        generation.completed_at = datetime.utcnow()
        
        # Deduct credits only after successful generation
        PaymentMock.deduct_credits(
            db,
            current_user,
            cost,
            f"{gen_request.type.value} generation"
        )
        
        db.commit()
        db.refresh(generation)
        
    except Exception as e:
        generation.status = "failed"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generation failed: {str(e)}"
        )
    
    return generation


@router.get("/my-generations", response_model=List[GenerationResponse])
def get_my_generations(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's generation history"""
    generations = db.query(Generation).filter(
        Generation.user_id == current_user.id
    ).order_by(Generation.created_at.desc()).offset(skip).limit(limit).all()
    
    return generations


@router.get("/{generation_id}", response_model=GenerationResponse)
def get_generation(
    generation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific generation by ID"""
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == current_user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    return generation


@router.get("/pricing/list")
def get_pricing():
    """Get pricing for all generation types"""
    from ai_mock import GENERATION_COSTS, PREMIUM_FEATURES
    
    pricing = []
    for gen_type, cost in GENERATION_COSTS.items():
        pricing.append({
            "type": gen_type,
            "cost_credits": cost,
            "requires_subscription": gen_type in PREMIUM_FEATURES,
            "description": get_generation_description(gen_type)
        })
    
    return pricing


def get_generation_description(gen_type: str) -> str:
    """Get human-readable description for generation type"""
    descriptions = {
        "static_image": "Статичное изображение высокого качества",
        "animated_image": "Анимированное изображение (GIF/MP4)",
        "video_morph": "Видео-морфинг между двумя изображениями",
        "contextual_photo": "Контекстный фото-креатив на основе URL",
        "ai_scoring": "AI-анализ конверсии креатива"
    }
    return descriptions.get(gen_type, "")

