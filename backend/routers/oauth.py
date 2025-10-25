from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, SubscriptionTier
from schemas import UserResponse, Token
from auth import create_access_token, get_password_hash
from datetime import timedelta
from config import settings
import secrets

router = APIRouter(prefix="/api/oauth", tags=["OAuth"])


@router.post("/telegram/callback", response_model=Token)
async def telegram_callback(
    telegram_id: str,
    first_name: str,
    username: str = None,
    photo_url: str = None,
    db: Session = Depends(get_db)
):
    """
    Telegram OAuth callback
    В продакшене здесь должна быть проверка подлинности данных от Telegram
    """
    
    # Ищем пользователя по telegram_id
    user = db.query(User).filter(User.username == f"tg_{telegram_id}").first()
    
    if not user:
        # Создаем нового пользователя
        user = User(
            email=f"tg_{telegram_id}@telegram.user",
            username=f"tg_{telegram_id}",
            full_name=first_name,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),  # Случайный пароль
            credits_balance=50,  # Бонус за регистрацию
            subscription_tier=SubscriptionTier.FREE,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Создаем токен
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/vk/callback", response_model=Token)
async def vk_callback(
    vk_id: str,
    first_name: str,
    last_name: str = None,
    photo_url: str = None,
    db: Session = Depends(get_db)
):
    """
    VK OAuth callback
    В продакшене здесь должна быть проверка подлинности данных от VK
    """
    
    full_name = f"{first_name} {last_name}" if last_name else first_name
    
    # Ищем пользователя по vk_id
    user = db.query(User).filter(User.username == f"vk_{vk_id}").first()
    
    if not user:
        # Создаем нового пользователя
        user = User(
            email=f"vk_{vk_id}@vk.user",
            username=f"vk_{vk_id}",
            full_name=full_name,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),
            credits_balance=50,
            subscription_tier=SubscriptionTier.FREE,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Создаем токен
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/google/callback", response_model=Token)
async def google_callback(
    google_id: str,
    email: str,
    name: str,
    picture: str = None,
    db: Session = Depends(get_db)
):
    """
    Google OAuth callback
    В продакшене здесь должна быть проверка JWT токена от Google
    """
    
    # Ищем пользователя по email или google_id
    user = db.query(User).filter(
        (User.email == email) | (User.username == f"google_{google_id}")
    ).first()
    
    if not user:
        # Создаем нового пользователя
        # Генерируем уникальный username из email
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User(
            email=email,
            username=username,
            full_name=name,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),
            credits_balance=50,
            subscription_tier=SubscriptionTier.FREE,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Создаем токен
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/yandex/callback", response_model=Token)
async def yandex_callback(
    yandex_id: str,
    email: str = None,
    display_name: str = None,
    db: Session = Depends(get_db)
):
    """
    Yandex OAuth callback
    """
    
    # Ищем пользователя по yandex_id
    user = db.query(User).filter(User.username == f"ya_{yandex_id}").first()
    
    if not user:
        email_address = email or f"ya_{yandex_id}@yandex.user"
        
        user = User(
            email=email_address,
            username=f"ya_{yandex_id}",
            full_name=display_name or "Пользователь Yandex",
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),
            credits_balance=50,
            subscription_tier=SubscriptionTier.FREE,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Создаем токен
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

