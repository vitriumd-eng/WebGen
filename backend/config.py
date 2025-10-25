from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    YUKASSA_SHOP_ID: Optional[str] = None
    YUKASSA_SECRET_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"


settings = Settings()

