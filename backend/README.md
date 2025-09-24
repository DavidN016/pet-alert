# Pet Alert Backend API

A FastAPI-based backend for a pet alert system with MongoDB integration.

## Project Structure

```
backend/
├── api/
│   ├── routes/
│   │   └── auth.py          # Authentication routes
│   └── __init__.py          # API router
├── models/
│   ├── user.py              # User MongoDB model
│   ├── pet.py               # Pet and Alert MongoDB models
│   └── __init__.py
├── schemas/
│   ├── auth.py              # Authentication Pydantic schemas
│   ├── pet.py               # Pet and Alert Pydantic schemas
│   └── __init__.py
├── core/
│   ├── security.py          # Password hashing and JWT
│   ├── config.py            # Application settings
│   └── __init__.py
├── db/
│   ├── database.py          # MongoDB connection
│   └── __init__.py
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Features

- **Authentication**: User registration and login with JWT tokens
- **User Management**: User profiles and authentication
- **Pet Management**: Pet registration and tracking
- **Alert System**: Missing pet alerts and notifications
- **MongoDB Integration**: Async MongoDB operations
- **Security**: Password hashing with bcrypt and JWT tokens

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up environment variables:

```bash
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=pet_alert_db

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. Start MongoDB (if running locally)

4. Run the application:

```bash
uvicorn main:app --reload
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user info

### Health Check

- `GET /` - API information
- `GET /health` - Health check

## Models

### User

- Email, password, full name
- Account status and timestamps

### Pet

- Name, species, breed, age, color
- Microchip ID, owner reference
- Missing status and location tracking

### Alert

- Pet reference, alert type
- Location with coordinates
- Contact information and photos
- Active status and timestamps
