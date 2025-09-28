from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class PetBase(BaseModel):
    name: Optional[str] = None        # optional if finder doesn't know
    species: str                      # e.g., dog, cat
    color: Optional[str] = None       # main color(s)
    description: Optional[str] = None # short free text
    photo_url: str                    # required: uploaded picture
    last_seen_location: dict          # geo point (lat, lon)
    last_seen_date: datetime

class PetCreate(PetBase):
    pass

class PetUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[int] = None
    color: Optional[str] = None
    microchip_id: Optional[str] = None
    is_missing: Optional[bool] = None
    last_seen_location: Optional[str] = None
    last_seen_date: Optional[datetime] = None
    description: Optional[str] = None
    photos: Optional[List[str]] = None

class PetResponse(PetBase):
    id: str
    owner_id: str
    is_missing: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    pet_id: str
    alert_type: str
    title: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_info: str

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    alert_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_info: Optional[str] = None
    photos: Optional[List[str]] = None
    is_active: Optional[bool] = None

class AlertResponse(AlertBase):
    id: str
    created_by: str
    photos: List[str] = []
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
