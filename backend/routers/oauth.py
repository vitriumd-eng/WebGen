from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from database import get_db
from models import User, SubscriptionTier
from schemas import UserResponse, Token
from auth import create_access_token, get_password_hash
from datetime import timedelta
from config import settings
from logging_config import logger
import secrets

router = APIRouter(prefix="/api/oauth", tags=["OAuth"])


@router.post("/telegram/callback", response_model=Token)
async def telegram_callback(
    telegram_id: str,
    first_name: str,
    username: str = None,
    photo_url: str = None,
    db: Session = Depends(get_db),
    response: Response = None
):
    """
    Telegram OAuth callback
    В продакшене здесь должна быть проверка подлинности данных от Telegram
    через hash проверку согласно: https://core.telegram.org/widgets/login
    """
    
    logger.info(f"Telegram login attempt: telegram_id={telegram_id}, username={username}")
    
    # Ищем пользователя по telegram_id
    user = db.query(User).filter(User.username == f"tg_{telegram_id}").first()
    
    is_new_user = False
    if not user:
        is_new_user = True
        # Создаем нового пользователя
        user = User(
            email=f"tg_{telegram_id}@telegram.user",
            username=username or f"tg_{telegram_id}",
            full_name=first_name,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),  # Случайный пароль
            credits_balance=50,  # Бонус за регистрацию
            subscription_tier=SubscriptionTier.FREE,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"New Telegram user created: {user.username}")
    else:
        logger.info(f"Existing Telegram user logged in: {user.username}")
    
    # Создаем токен
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Устанавливаем cookie с токеном
    if response:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # Для production установить True (HTTPS)
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "credits_balance": user.credits_balance,
            "subscription_tier": user.subscription_tier.value,
            "is_new_user": is_new_user
        }
    }


@router.post("/vk/callback", response_model=Token)
async def vk_callback(
    vk_id: str,
    first_name: str,
    last_name: str = None,
    photo_url: str = None,
    db: Session = Depends(get_db),
    response: Response = None
):
    """
    VK OAuth callback
    В продакшене здесь должна быть проверка подлинности данных от VK
    через OAuth 2.0 flow: https://dev.vk.com/ru/api/oauth-parameters
    """
    
    full_name = f"{first_name} {last_name}" if last_name else first_name
    
    logger.info(f"VK login attempt: vk_id={vk_id}, name={full_name}")
    
    # Ищем пользователя по vk_id
    user = db.query(User).filter(User.username == f"vk_{vk_id}").first()
    
    is_new_user = False
    if not user:
        is_new_user = True
        # Создаем нового пользователя
        user = User(
            email=f"vk_{vk_id}@vk.user",
            username=f"vk_{vk_id}",
            full_name=full_name,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),
            credits_balance=50,  # Бонус за регистрацию
            subscription_tier=SubscriptionTier.FREE,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"New VK user created: {user.username}")
    else:
        logger.info(f"Existing VK user logged in: {user.username}")
    
    # Создаем токен
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Устанавливаем cookie с токеном
    if response:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # Для production установить True (HTTPS)
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "credits_balance": user.credits_balance,
            "subscription_tier": user.subscription_tier.value,
            "is_new_user": is_new_user
        }
    }
