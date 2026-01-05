# Checkout "dev" Branch
# CuePoint – Full Stack Booking & Profile Platform

CuePoint is a full-stack web application designed for creative professionals (e.g. musicians, artists, venues) to manage public profiles, publish content, showcase featured media, and handle booking requests through a structured calendar-based workflow.

The system is built with a modern React + TypeScript frontend and a FastAPI + PostgreSQL backend, using cookie-based authentication and role-aware data access.

---

## Tech Stack

### Frontend

* React 18 + TypeScript
* Vite
* Tailwind CSS
* React Router
* TanStack React Query
* Axios (cookie-based auth)
* react-big-calendar + date-fns

### Backend

* FastAPI
* SQLAlchemy ORM
* PostgreSQL
* Alembic (migrations)
* JWT (stored in HTTP-only cookies)
* Passlib (password hashing)
* FastAPI-Mail (email verification) (Not tested)
* Cloudflare R2 (S3-compatible object storage)

---

## System Architecture Overview

```
[ React Frontend ]
        |
        |  (HTTPS, cookies)
        v
[ FastAPI Backend ]
        |
        |  (SQLAlchemy)
        v
[ PostgreSQL Database ]
        |
        |  (boto3)
        v
[ Cloudflare R2 – Image Storage ]
```

---

## Core Features

### Authentication & Users

* User registration 
* Secure login using HTTP-only cookies
* Session persistence (`/me` endpoint)
* Profile update (display name, bio, email)
* Password change
* Account deletion
* Profile image upload (Cloudflare R2)

### Public Profiles

* Public profile pages (`/profiles/:id`)
* Search by display name and bio
* Verified-only search endpoint
* Public post feed per user

### Posts

* Create, edit, delete posts
* Optional image upload per post
* Automatic cleanup of replaced/deleted images
* Owner-only editing enforced server-side

### Featured Tracks

* User-curated featured media
* Supports SoundCloud, YouTube, Bandcamp embeds
* Provider detection handled client-side
* Owner-only CRUD

### Events

* Simple event sidebar for profiles
* Date, location, and optional external URL
* Public read access
* Owner-only creation and deletion

### Booking System

* Request-based booking workflow
* Dual roles: requester and recipient
* Calendar view for recipients
* Status lifecycle:

  * requested → accepted / rejected / cancelled
* Strict permission checks enforced server-side

---

## Booking Flow (High-Level)

1. Authenticated user submits a booking request
2. Booking is stored with `requested` status
3. Recipient can accept or reject
4. Requester may cancel while pending
5. Both parties see the booking in their calendar

---

## Backend API Overview

### Auth

* `POST /register`
* `POST /login`
* `POST /logout`
* `GET /verify`
* `GET /me`

### Users

* `PUT /me`
* `PUT /me/password`
* `DELETE /me`
* `PUT /me/profile-image`

### Public Profiles

* `GET /profiles?q=`
* `GET /profiles/{id}`
* `GET /profiles/search?q=`

### Posts

* `POST /me/posts`
* `GET /me/posts`
* `PUT /me/posts/{id}`
* `DELETE /me/posts/{id}`
* `GET /users/{id}/posts`

### Featured Tracks

* `POST /featured-tracks`
* `GET /featured-tracks?user_id=`
* `DELETE /featured-tracks/{id}`

### Events

* `GET /events?user_id=`
* `POST /events`
* `DELETE /events/{id}`

### Bookings

* `POST /bookings`
* `GET /bookings`
* `GET /bookings/calendar/{user_id}`
* `PATCH /bookings/{id}/status`

---

## Database Models

* User
* Post
* FeaturedTrack
* Event
* Booking

All relations are defined via SQLAlchemy ORM with foreign keys and backrefs.

---

## Environment Variables

### Backend (`.env`)

```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/dbname
SECRET_KEY=your_secret_key
```

Cloudflare R2 credentials are currently configured in `r2bucket.py` (development setup).

---

## Local Development Setup

### Backend

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:8000`

---

## Security Considerations

* Passwords hashed with `scrypt`
* JWT stored in HTTP-only cookies
* CORS restricted to frontend origin
* Role-based authorization enforced server-side
* Image uploads validated by MIME type

---
 ## BØF CITY MILAS OG WALID 
