"""
Mock AI services for content generation
"""
import random
import time
import uuid
from typing import Optional, Dict, List


class AIMock:
    """Mock AI service for content generation"""
    
    @staticmethod
    def generate_static_image(prompt: str, parameters: Optional[Dict] = None) -> Dict:
        """Mock static image generation"""
        time.sleep(0.5)  # Simulate processing
        image_id = uuid.uuid4().hex[:12]
        return {
            "url": f"https://mock-storage.example.com/images/{image_id}.jpg",
            "status": "completed",
            "metadata": {
                "resolution": "1024x1024",
                "format": "jpg",
                "prompt": prompt
            }
        }
    
    @staticmethod
    def generate_animated_image(prompt: str, parameters: Optional[Dict] = None) -> Dict:
        """Mock animated image generation (GIF/MP4)"""
        time.sleep(1.0)  # Simulate longer processing
        animation_id = uuid.uuid4().hex[:12]
        format_type = parameters.get("format", "gif") if parameters else "gif"
        return {
            "url": f"https://mock-storage.example.com/animations/{animation_id}.{format_type}",
            "status": "completed",
            "metadata": {
                "duration": "3s",
                "resolution": "512x512",
                "format": format_type,
                "prompt": prompt
            }
        }
    
    @staticmethod
    def generate_video_morph(start_image: str, end_image: str, parameters: Optional[Dict] = None) -> Dict:
        """Mock video morphing between two images"""
        time.sleep(2.0)  # Simulate complex processing
        video_id = uuid.uuid4().hex[:12]
        return {
            "url": f"https://mock-storage.example.com/videos/{video_id}.mp4",
            "status": "completed",
            "metadata": {
                "duration": "5s",
                "resolution": "1920x1080",
                "format": "mp4",
                "start_image": start_image,
                "end_image": end_image
            }
        }
    
    @staticmethod
    def generate_contextual_photo(url: str, prompt: str, parameters: Optional[Dict] = None) -> Dict:
        """Mock contextual photo creative based on URL analysis"""
        time.sleep(1.5)  # Simulate URL analysis and generation
        photo_id = uuid.uuid4().hex[:12]
        return {
            "url": f"https://mock-storage.example.com/contextual/{photo_id}.jpg",
            "status": "completed",
            "metadata": {
                "resolution": "1200x628",
                "format": "jpg",
                "analyzed_url": url,
                "prompt": prompt,
                "context": "Mock analysis: ecommerce product page"
            }
        }
    
    @staticmethod
    def analyze_conversion_score(image_url: str, parameters: Optional[Dict] = None) -> Dict:
        """Mock AI scoring for conversion analysis"""
        time.sleep(0.3)  # Quick analysis
        
        # Generate random score between 70-95
        score = random.randint(70, 95)
        
        # Generate mock recommendations
        recommendations = [
            "Рекомендация: Увеличьте контрастность основного элемента для привлечения внимания",
            "Рекомендация: Добавьте более яркий CTA-элемент в правый нижний угол",
            "Рекомендация: Упростите композицию — слишком много отвлекающих деталей"
        ]
        
        selected_recommendations = random.sample(recommendations, k=random.randint(2, 3))
        
        return {
            "score": score,
            "recommendations": selected_recommendations,
            "analysis": {
                "attention_zones": ["center", "top-right"],
                "color_harmony": random.randint(75, 95),
                "cta_visibility": random.randint(60, 90),
                "text_readability": random.randint(70, 95)
            },
            "status": "completed"
        }


# Generation costs mapping
GENERATION_COSTS = {
    "static_image": 100,
    "animated_image": 250,
    "video_morph": 400,
    "contextual_photo": 150,
    "ai_scoring": 20,
}


# Premium features that require subscription
PREMIUM_FEATURES = {
    "video_morph",
    "contextual_photo",
    "ai_scoring"
}


def get_generation_cost(generation_type: str) -> int:
    """Get cost in credits for generation type"""
    return GENERATION_COSTS.get(generation_type, 0)


def is_premium_feature(generation_type: str) -> bool:
    """Check if feature requires subscription"""
    return generation_type in PREMIUM_FEATURES

