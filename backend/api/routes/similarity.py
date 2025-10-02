from fastapi import APIRouter, Depends, HTTPException, Query
import httpx
from typing import List, Tuple, Optional
import numpy as np

from api.routes.auth import get_current_user
from schemas.pet import AlertResponse
from db.database import get_database
from core.embeddings import image_bytes_to_embedding, text_to_embedding

router = APIRouter(prefix="/similarity", tags=["similarity search"])

async def _get_query_embeddings(photo_url: str, text_description: str) -> Tuple[Optional[List[float]], Optional[List[float]]]:
    """Generate query embeddings for image and text"""
    query_image_embedding = None
    query_text_embedding = None
    
    if photo_url:
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.get(photo_url)
                response.raise_for_status()
                image_bytes = response.content
            query_image_embedding = image_bytes_to_embedding(image_bytes)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process image: {e}")
    
    if text_description:
        try:
            query_text_embedding = text_to_embedding(text_description)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process text: {e}")
    
    if not query_image_embedding and not query_text_embedding:
        raise HTTPException(status_code=400, detail="Either photo_url or text_description must be provided")
    
    return query_image_embedding, query_text_embedding

def _calculate_combined_similarity(alert: dict, query_image_embedding: Optional[List[float]], 
                                 query_text_embedding: Optional[List[float]], 
                                 image_weight: float, text_weight: float) -> Tuple[bool, float]:
    """Calculate combined similarity score for an alert"""
    combined_similarity = 0.0
    has_similarity = False
    
    if query_image_embedding and alert.get("image_embedding"):
        stored_image_embedding = np.array(alert["image_embedding"])
        query_image_array = np.array(query_image_embedding)
        
        image_similarity = np.dot(query_image_array, stored_image_embedding) / (
            np.linalg.norm(query_image_array) * np.linalg.norm(stored_image_embedding)
        )
        combined_similarity += image_weight * image_similarity
        has_similarity = True
    
    if query_text_embedding and alert.get("text_embedding"):
        stored_text_embedding = np.array(alert["text_embedding"])
        query_text_array = np.array(query_text_embedding)
        
        text_similarity = np.dot(query_text_array, stored_text_embedding) / (
            np.linalg.norm(query_text_array) * np.linalg.norm(stored_text_embedding)
        )
        combined_similarity += text_weight * text_similarity
        has_similarity = True
    
    return has_similarity, combined_similarity

@router.get("/find", response_model=List[AlertResponse])
async def find_similar_pets(
    photo_url: str = Query(..., description="URL of the image to find similar pets for"),
    text_description: str = Query("", description="Text description to match against (optional)"),
    image_weight: float = Query(0.7, description="Weight for image similarity (0.0 to 1.0)", ge=0.0, le=1.0),
    text_weight: float = Query(0.3, description="Weight for text similarity (0.0 to 1.0)", ge=0.0, le=1.0),
    similarity_threshold: float = Query(0.7, description="Combined similarity threshold (0.0 to 1.0)", ge=0.0, le=1.0),
    limit: int = Query(10, description="Maximum number of similar pets to return", ge=1, le=50),
    current_user: dict = Depends(get_current_user)
):
    """Find pets similar to the provided image and/or text using combined embeddings"""
    db = get_database()
    
    # Normalize weights
    total_weight = image_weight + text_weight
    if total_weight > 0:
        image_weight = image_weight / total_weight
        text_weight = text_weight / total_weight
    else:
        image_weight = 0.7
        text_weight = 0.3
    
    # Generate query embeddings
    query_image_embedding, query_text_embedding = await _get_query_embeddings(photo_url, text_description)
    
    # Get all active missing pet alerts with embeddings
    cursor = db.alerts.find({
        "is_active": True,
        "alert_type": "missing",
        "$or": [
            {"image_embedding": {"$exists": True, "$ne": None}},
            {"text_embedding": {"$exists": True, "$ne": None}}
        ]
    })
    
    alerts_with_embeddings = await cursor.to_list(length=None)
    
    # Calculate combined similarity scores
    similar_alerts = []
    for alert in alerts_with_embeddings:
        has_similarity, combined_similarity = _calculate_combined_similarity(
            alert, query_image_embedding, query_text_embedding, image_weight, text_weight
        )
        
        if has_similarity and combined_similarity >= similarity_threshold:
            similar_alerts.append((alert, combined_similarity))
    
    # Sort by combined similarity score (highest first) and limit results
    similar_alerts.sort(key=lambda x: x[1], reverse=True)
    similar_alerts = similar_alerts[:limit]
    
    # Convert to AlertResponse format
    results = []
    for alert, _ in similar_alerts:
        results.append(AlertResponse(
            id=str(alert["_id"]),
            pet_id=str(alert["pet_id"]),
            alert_type=alert["alert_type"],
            title=alert["title"],
            description=alert["description"],
            location=str(alert["location"]),
            contact_info=alert["contact_info"],
            photos=alert.get("photos", []),
            is_active=alert["is_active"],
            created_by=str(alert["created_by"]),
            created_at=alert["created_at"],
            updated_at=alert.get("updated_at")
        ))
    
    return results
