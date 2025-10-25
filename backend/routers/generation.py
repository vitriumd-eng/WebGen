from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
from database import get_db
from models import User, Generation, GenerationType, PricingConfig
from schemas import GenerationRequest, GenerationResponse
from auth import get_current_active_user, has_premium_access
from ai_mock import AIMock, get_generation_cost, is_premium_feature
from payment_mock import PaymentMock
from pricing_utils import get_generation_price
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
    pricing_config = db.query(PricingConfig).filter(
        PricingConfig.generation_type == gen_request.type.value
    ).first()
    
    if pricing_config and pricing_config.requires_subscription and not has_premium_access(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires an active subscription"
        )
    
    # Get generation cost using dynamic pricing
    price_info = get_generation_price(db, gen_request.type)
    cost = price_info["final_price_rub"]
    
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
        
        elif gen_request.type == GenerationType.VECTOR_CREATIVE:
            # Новый тип: Векторный креатив (Recraft.ai)
            result = {
                "url": f"https://mock-storage.example.com/vector/{generation.id}.svg",
                "format": "SVG",
                "scalable": True,
                "message": "Векторный креатив сгенерирован через Recraft.ai"
            }
        
        elif gen_request.type == GenerationType.BRANDED_SET:
            # Новый тип: Брендовый Сет (Fusion)
            result = {
                "url": f"https://mock-storage.example.com/branded-set/{generation.id}/",
                "creatives": [
                    f"https://mock-storage.example.com/branded-set/{generation.id}/creative_1.svg",
                    f"https://mock-storage.example.com/branded-set/{generation.id}/creative_2.svg",
                    f"https://mock-storage.example.com/branded-set/{generation.id}/creative_3.svg"
                ],
                "message": "Брендовый Сет из 3 креативов в едином стиле (Recraft.ai + Brand Colors)"
            }
        
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
def get_pricing(db: Session = Depends(get_db)):
    """Get dynamic pricing for all generation types"""
    pricing = []
    
    for gen_type in GenerationType:
        price_info = get_generation_price(db, gen_type)
        
        # Получаем дополнительную информацию из PricingConfig
        config = db.query(PricingConfig).filter(
            PricingConfig.generation_type == gen_type.value
        ).first()
        
        pricing.append({
            "type": gen_type.value,
            "cost_credits": price_info["final_price_rub"],
            "requires_subscription": config.requires_subscription if config else False,
            "description": get_generation_description(gen_type.value),
            "base_cost_usd": price_info["base_cost_usd"],
            "markup_percentage": price_info["markup_percentage"]
        })
    
    return pricing


def get_generation_description(gen_type: str) -> str:
    """Get human-readable description for generation type"""
    descriptions = {
        "static_image": "Статичное изображение высокого качества",
        "animated_image": "Анимированное изображение (GIF/MP4)",
        "video_morph": "Видео-морфинг между двумя изображениями",
        "contextual_photo": "Контекстный фото-креатив на основе URL",
        "ai_scoring": "AI-анализ конверсии креатива",
        "vector_creative": "Векторный креатив (Recraft.ai) - масштабируемая графика (SVG)",
        "branded_set": "Брендовый Сет (Fusion) - 3 креатива в едином брендовом стиле"
    }
    return descriptions.get(gen_type, "")

