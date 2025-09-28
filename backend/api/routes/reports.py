from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from api.routes.auth import get_current_user
from schemas.pet import PetBase, PetCreate, PetResponse, AlertCreate, AlertResponse
from models.pet import Pet, Alert
from db.database import get_database

router = APIRouter(prefix="/reports", tags=["missing pet reports"])

class MissingPetReport(PetBase):
    contact_info: str


@router.post("/missing", response_model=AlertResponse)
async def report_missing_pet(
    report: MissingPetReport,
    current_user: dict = Depends(get_current_user)
):
    """Report a missing pet"""
    db = get_database()
    
    # Get current user ID from the response
    from bson import ObjectId
    user_id = ObjectId(current_user["id"])
    
    # Create pet record
    pet_doc = {
        "name": report.name,
        "species": report.species,
        "color": report.color,
        "description": report.description,
        "photo_url": report.photo_url,
        "last_seen_location": report.last_seen_location,
        "last_seen_date": report.last_seen_date,
        "owner_id": user_id,
        "is_missing": True,
        "created_at": datetime.now(),
        "updated_at": None
    }
    
    # Insert pet into database
    pet_result = await db.pets.insert_one(pet_doc)
    pet_doc["_id"] = pet_result.inserted_id
    
    # Create alert record
    pet_name = report.name or "Unknown"
    alert_doc = {
        "pet_id": pet_result.inserted_id,
        "alert_type": "missing",
        "title": f"Missing {report.species}: {pet_name}",
        "description": report.description or f"Missing {report.species} named {pet_name}",
        "location": str(report.last_seen_location),
        "contact_info": report.contact_info,
        "photos": [report.photo_url],
        "is_active": True,
        "created_by": user_id,
        "created_at": datetime.now(),
        "updated_at": None
    }
    
    # Insert alert into database
    alert_result = await db.alerts.insert_one(alert_doc)
    alert_doc["_id"] = alert_result.inserted_id
    
    return AlertResponse(
        id=str(alert_doc["_id"]),
        pet_id=str(alert_doc["pet_id"]),
        alert_type=alert_doc["alert_type"],
        title=alert_doc["title"],
        description=alert_doc["description"],
        location=alert_doc["location"],
        contact_info=alert_doc["contact_info"],
        photos=alert_doc["photos"],
        is_active=alert_doc["is_active"],
        created_by=str(alert_doc["created_by"]),
        created_at=alert_doc["created_at"],
        updated_at=alert_doc["updated_at"]
    )

@router.get("/missing", response_model=List[AlertResponse])
async def get_missing_pets(
    skip: int = 0,
    limit: int = 20,
    species: Optional[str] = None,
    location: Optional[str] = None
):
    """Get list of missing pets with optional filters"""
    db = get_database()
    
    # Build filter query
    filter_query = {"alert_type": "missing", "is_active": True}
    
    if species:
        filter_query["species"] = {"$regex": species, "$options": "i"}
    
    if location:
        filter_query["location"] = {"$regex": location, "$options": "i"}
    
    # Get alerts with pagination
    cursor = db.alerts.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
    alerts = await cursor.to_list(length=limit)
    
    return [
        AlertResponse(
            id=str(alert["_id"]),
            pet_id=str(alert["pet_id"]),
            alert_type=alert["alert_type"],
            title=alert["title"],
            description=alert["description"],
            location=alert["location"],
            contact_info=alert["contact_info"],
            photos=alert.get("photos", []),
            is_active=alert["is_active"],
            created_by=str(alert["created_by"]),
            created_at=alert["created_at"],
            updated_at=alert.get("updated_at")
        )
        for alert in alerts
    ]

@router.get("/missing/{alert_id}", response_model=AlertResponse)
async def get_missing_pet_details(alert_id: str):
    """Get details of a specific missing pet report"""
    db = get_database()
    
    from bson import ObjectId
    try:
        alert = await db.alerts.find_one({"_id": ObjectId(alert_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    return AlertResponse(
        id=str(alert["_id"]),
        pet_id=str(alert["pet_id"]),
        alert_type=alert["alert_type"],
        title=alert["title"],
        description=alert["description"],
        location=alert["location"],
        contact_info=alert["contact_info"],
        photos=alert.get("photos", []),
        is_active=alert["is_active"],
        created_by=str(alert["created_by"]),
        created_at=alert["created_at"],
        updated_at=alert.get("updated_at")
    )

@router.post("/found/{alert_id}")
async def mark_pet_found(
    alert_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark a missing pet as found"""
    db = get_database()
    
    from bson import ObjectId
    try:
        alert = await db.alerts.find_one({"_id": ObjectId(alert_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    # Update alert to inactive
    await db.alerts.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"is_active": False, "updated_at": datetime.now()}}
    )
    
    # Update pet to not missing
    await db.pets.update_one(
        {"_id": alert["pet_id"]},
        {"$set": {"is_missing": False, "updated_at": datetime.now()}}
    )
    
    return {"message": "Pet marked as found successfully"}

@router.get("/my-reports", response_model=List[AlertResponse])
async def get_my_reports(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20
):
    """Get current user's missing pet reports"""
    db = get_database()
    
    # Get current user ID
    from bson import ObjectId
    user_id = ObjectId(current_user["id"])
    
    # Get user's alerts
    cursor = db.alerts.find(
        {"created_by": user_id}
    ).skip(skip).limit(limit).sort("created_at", -1)
    
    alerts = await cursor.to_list(length=limit)
    
    return [
        AlertResponse(
            id=str(alert["_id"]),
            pet_id=str(alert["pet_id"]),
            alert_type=alert["alert_type"],
            title=alert["title"],
            description=alert["description"],
            location=alert["location"],
            contact_info=alert["contact_info"],
            photos=alert.get("photos", []),
            is_active=alert["is_active"],
            created_by=str(alert["created_by"]),
            created_at=alert["created_at"],
            updated_at=alert.get("updated_at")
        )
        for alert in alerts
    ]
