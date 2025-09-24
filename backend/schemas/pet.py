from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    color: Optional[str] = None
    microchip_id: Optional[str] = None
    description: Optional[str] = None

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
    last_seen_location: Optional[str] = None
    last_seen_date: Optional[datetime] = None
    photos: List[str] = []
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
