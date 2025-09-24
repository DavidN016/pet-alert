from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os
from core.config import settings

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

db = Database()

def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db.db

async def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db.db = db.client[settings.DATABASE_NAME]
        
        # Test the connection
        await db.client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Create indexes for better performance
        await create_indexes()
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("⚠️  Application will start but database operations will fail")
        # Don't raise the exception, let the app start without DB

def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

async def create_indexes():
    """Create database indexes"""
    if db.db is not None:
        try:
            # User collection indexes
            await db.db.users.create_index("email", unique=True)
            await db.db.users.create_index("created_at")
            
            # Pet collection indexes
            await db.db.pets.create_index("owner_id")
            await db.db.pets.create_index("is_missing")
            await db.db.pets.create_index("species")
            await db.db.pets.create_index("created_at")
            
            # Alert collection indexes
            await db.db.alerts.create_index("pet_id")
            await db.db.alerts.create_index("alert_type")
            await db.db.alerts.create_index("is_active")
            await db.db.alerts.create_index("created_at")
            await db.db.alerts.create_index([("latitude", 1), ("longitude", 1)])  # Geospatial index
        except Exception as e:
            print(f"Warning: Could not create indexes: {e}")
            # Continue without indexes for now
