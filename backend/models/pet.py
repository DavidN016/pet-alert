from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from bson import ObjectId
from models.user import PyObjectId

class Pet(BaseModel):
    id: Optional[PyObjectId] = None
    name: str
    species: str  # dog, cat, bird, etc.
    breed: Optional[str] = None
    age: Optional[int] = None
    color: Optional[str] = None
    microchip_id: Optional[str] = None
    owner_id: PyObjectId
    is_missing: bool = False
    last_seen_location: Optional[str] = None
    last_seen_date: Optional[datetime] = None
    description: Optional[str] = None
    photos: List[str] = []  # URLs to pet photos
    created_at: datetime = datetime.now()
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "Buddy",
                "species": "dog",
                "breed": "Golden Retriever",
                "age": 3,
                "color": "Golden",
                "microchip_id": "123456789",
                "is_missing": False,
                "description": "Friendly golden retriever with a white patch on chest"
            }
        }

class Alert(BaseModel):
    id: Optional[PyObjectId] = None
    pet_id: PyObjectId
    alert_type: str  # missing, found, sighting
    title: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_info: str
    photos: List[str] = []
    is_active: bool = True
    created_by: PyObjectId  # User who created the alert
    created_at: datetime = datetime.now()
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "alert_type": "missing",
                "title": "Lost Golden Retriever",
                "description": "Buddy went missing from Central Park",
                "location": "Central Park, New York",
                "contact_info": "555-123-4567"
            }
        }
