from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from db.database import get_database
from schemas.pet import AlertResponse

router = APIRouter(prefix="/alerts", tags=["alerts"]) 

@router.get("/near", response_model=List[AlertResponse])
async def get_alerts_near(
    lon: float = Query(..., description="Longitude"),
    lat: float = Query(..., description="Latitude"),
    radius_m: int = Query(5000, description="Search radius in meters"),
    skip: int = 0,
    limit: int = 50,
):
    """Return active missing pet alerts near the given point within the given radius (meters)."""
    db = get_database()

    query = {
        "is_active": True,
        "alert_type": "missing",
        "location": {
            "$near": {
                "$geometry": {"type": "Point", "coordinates": [lon, lat]},
                "$maxDistance": radius_m,
            }
        },
    }

    cursor = db.alerts.find(query).skip(skip).limit(limit)
    try:
        alerts = await cursor.to_list(length=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Geospatial query failed: {e}")

    results: List[AlertResponse] = []
    for alert in alerts:
        results.append(
            AlertResponse(
                id=str(alert["_id"]),
                pet_id=str(alert["pet_id"]),
                alert_type=alert["alert_type"],
                title=alert["title"],
                description=alert["description"],
                location=alert.get("location"),
                contact_info=alert["contact_info"],
                photos=alert.get("photos", []),
                is_active=alert.get("is_active", True),
                created_by=str(alert["created_by"]),
                created_at=alert["created_at"],
                updated_at=alert.get("updated_at"),
            )
        )

    return results
