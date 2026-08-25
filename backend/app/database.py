from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

def get_database():
    if db_instance.db is None:
        # Fallback initialization in case lifespans are bypassed in tests
        connect_db()
    return db_instance.db

def connect_db():
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_instance.db = db_instance.client[settings.DATABASE_NAME]
    print(f"Connected to MongoDB: {settings.MONGODB_URL}/{settings.DATABASE_NAME}")

def disconnect_db():
    if db_instance.client:
        db_instance.client.close()
        print("Disconnected from MongoDB.")
