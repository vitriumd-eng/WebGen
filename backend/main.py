from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from routers import auth, payments, generation, library, admin, oauth, bundles, pricing_admin
from logging_config import logger

# Database tables are managed by Alembic migrations
# To apply migrations: alembic upgrade head
# Base.metadata.create_all(bind=engine)  # Commented out - use Alembic instead

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="AI Creative Generator API",
    description="SaaS Platform for AI-Generated Marketing Creatives",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Log application startup
logger.info("AI Creative Generator API starting...")
logger.info(f"FastAPI version: {app.version}")

# Include routers
app.include_router(auth.router)
app.include_router(oauth.router)
app.include_router(payments.router)
app.include_router(generation.router)
app.include_router(bundles.router)
app.include_router(library.router)
app.include_router(admin.router)
app.include_router(pricing_admin.router)


@app.get("/")
def root():
    return {
        "message": "AI Creative Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Enhanced health check with database connectivity test"""
    from sqlalchemy import text
    from datetime import datetime
    
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0"
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

