"""
Logging configuration for the application
"""
import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime


def setup_logging():
    """Setup application logging with file rotation"""
    
    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            # File handler with rotation
            RotatingFileHandler(
                'logs/app.log',
                maxBytes=10485760,  # 10MB
                backupCount=5,
                encoding='utf-8'
            ),
            # Console handler
            logging.StreamHandler()
        ]
    )
    
    # Set level for specific loggers
    logging.getLogger('uvicorn').setLevel(logging.WARNING)
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
    
    # Create application logger
    logger = logging.getLogger('ai_creative_gen')
    logger.info('Logging system initialized')
    
    return logger


# Initialize logger
logger = setup_logging()

