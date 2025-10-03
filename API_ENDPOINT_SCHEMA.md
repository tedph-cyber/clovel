# Complete API Endpoint Schema - Clovel Novel Platform

This document provides a comprehensive mapping of all API endpoints in the Clovel application, showing both frontend routes and their corresponding backend expectations.

## Frontend API Routes (Next.js)

### 1. Novel Endpoints

#### GET `/api/novels`
**Frontend Route**: `app/api/novels/route.ts`
**Purpose**: Get all novels with filtering
**Backend Forwards To**: `http://localhost:8000/api/novels`
**Query Parameters**: 
- `page` (number): Page number
- `limit` (number): Results per page
- `genre` (string): Filter by genre
- `status` (string): Filter by status (ongoing, completed, hiatus)
- `sort_by` (string): Sort order (newest, popular, rating)
- `min_rating` (number): Minimum rating filter

#### POST `/api/novels`
**Frontend Route**: `app/api/novels/route.ts`
**Purpose**: Create new novel
**Backend Forwards To**: `http://localhost:8000/api/novels`

#### GET `/api/novels/[id]`
**Frontend Route**: `app/api/novels/[id]/route.ts`
**Purpose**: Get specific novel by ID
**Backend Forwards To**: `http://localhost:8000/api/novels/{id}`

#### PUT `/api/novels/[id]`
**Frontend Route**: `app/api/novels/[id]/route.ts`
**Purpose**: Update novel by ID
**Backend Forwards To**: `http://localhost:8000/api/novels/{id}`

#### DELETE `/api/novels/[id]`
**Frontend Route**: `app/api/novels/[id]/route.ts`
**Purpose**: Delete novel by ID
**Backend Forwards To**: `http://localhost:8000/api/novels/{id}`

### 2. Chapter Endpoints

#### GET `/api/[slug]/[chapterId]`
**Frontend Route**: `app/api/[slug]/[chapterId]/route.ts`
**Purpose**: Get specific chapter content
**URL Pattern**: `/api/novel-title/chapter-1`
**Backend Forwards To**: `http://localhost:8000/api/{slug}/chapter-{number}`
**Example**: 
- Frontend: `/api/re-blood-and-iron/chapter-1`
- Backend: `http://localhost:8000/api/re-blood-and-iron/chapter-1`

#### GET `/api/[slug]/[chapterId]/progress`
**Frontend Route**: `app/api/[slug]/[chapterId]/progress/route.ts`
**Purpose**: Get reading progress for specific chapter
**Backend Forwards To**: `http://localhost:8000/api/{slug}/{chapterNumber}/progress`
**Example**:
- Frontend: `/api/re-blood-and-iron/chapter-1/progress`
- Backend: `http://localhost:8000/api/re-blood-and-iron/1/progress`

#### POST `/api/[slug]/[chapterId]/progress`
**Frontend Route**: `app/api/[slug]/[chapterId]/progress/route.ts`
**Purpose**: Update reading progress for specific chapter
**Backend Forwards To**: `http://localhost:8000/api/{slug}/{chapterNumber}/progress`
**Body**: `{ "progress": number }` (0-100)

#### POST `/api/[slug]/[chapterId]/view`
**Frontend Route**: `app/api/[slug]/[chapterId]/view/route.ts`
**Purpose**: Track chapter view analytics
**Backend Forwards To**: `http://localhost:8000/api/{slug}/{chapterNumber}/view`

#### GET `/api/chapters`
**Frontend Route**: `app/api/chapters/route.ts`
**Purpose**: Get all chapters with filtering
**Backend Forwards To**: `http://localhost:8000/api/chapters`

#### POST `/api/chapters`
**Frontend Route**: `app/api/chapters/route.ts`
**Purpose**: Create new chapter
**Backend Forwards To**: `http://localhost:8000/api/chapters`

### 3. Author Endpoints

#### GET `/api/authors/[slug]`
**Frontend Route**: `app/api/authors/[slug]/route.ts`
**Purpose**: Get author details by slug
**Backend Forwards To**: `http://localhost:8000/api/authors/{slug}`
**Response Handling**: Unwraps `{ success: true, data: ... }` structure

#### GET `/api/authors/[slug]/novels`
**Frontend Route**: `app/api/authors/[slug]/novels/route.ts`
**Purpose**: Get novels by author
**Backend Forwards To**: `http://localhost:8000/api/authors/{slug}` (modified in user edits)
**Note**: User commented out sort_by parameter forwarding

### 4. Search Endpoints

#### GET `/api/search`
**Frontend Route**: `app/api/search/route.ts`
**Purpose**: General search functionality
**Backend Forwards To**: `http://localhost:8000/api/search`
**Query Parameters**: All frontend query params are forwarded

#### POST `/api/search`
**Frontend Route**: `app/api/search/route.ts`
**Purpose**: Advanced search with complex filters
**Backend Forwards To**: `http://localhost:8000/api/search`

### 5. Authentication Endpoints

#### POST `/api/auth`
**Frontend Route**: `app/api/auth/route.ts`
**Purpose**: Handle authentication actions
**Body**: `{ "action": "login|register|logout|refresh", ...data }`
**Backend Routes**:
- Login: `http://localhost:8000/api/auth/login`
- Register: `http://localhost:8000/api/auth/register`
- Logout: `http://localhost:8000/api/auth/logout`
- Profile: `http://localhost:8000/api/auth/profile`

#### GET `/api/auth`
**Frontend Route**: `app/api/auth/route.ts`
**Purpose**: Get current user profile
**Backend Forwards To**: `http://localhost:8000/api/auth/profile`

## Backend Expected Endpoints

Based on the frontend forwarding patterns, your FastAPI backend should implement:

### Novel Endpoints
- `GET /api/novels` - List novels with filtering
- `POST /api/novels` - Create novel
- `GET /api/novels/{id}` - Get novel by ID
- `PUT /api/novels/{id}` - Update novel
- `DELETE /api/novels/{id}` - Delete novel

### Chapter Endpoints
- `GET /api/{novel_slug}/chapter-{number}` - Get chapter content
- `GET /api/{novel_slug}/{chapter_number}/progress` - Get reading progress
- `POST /api/{novel_slug}/{chapter_number}/progress` - Update reading progress
- `POST /api/{novel_slug}/{chapter_number}/view` - Track chapter view
- `GET /api/chapters` - List chapters with filtering
- `POST /api/chapters` - Create chapter

### Author Endpoints
- `GET /api/authors/{slug}` - Get author details
- `GET /api/authors/{slug}/novels` - Get author's novels (optional, based on user modifications)

### Search Endpoints
- `GET /api/search` - General search
- `POST /api/search` - Advanced search

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token

## Frontend Client APIs (lib/api/)

The frontend also has client-side API classes that may use different patterns:

### ChapterApi (`lib/api/chapters.ts`)
- Uses both new URL patterns (`/api/{slug}/{chapterId}/progress`) and old patterns
- Handles progress tracking with novel slug and chapter ID

### NovelApi (`lib/api/novels.ts`)
- Uses standard API_ROUTES patterns
- Includes methods for popular/recent novels

### SearchApi (`lib/api/search.ts`)
- Uses API_ROUTES.SEARCH patterns
- Includes suggestions and popular searches

### AuthApi (`lib/api/auth.ts`)
- Uses API_ROUTES.AUTH_* patterns
- Handles token management

## URL Pattern Translation

### Chapter URLs
**Frontend Page**: `/novel/{slug}/{chapterId}`
**Frontend API**: `/api/{slug}/{chapterId}`
**Backend API**: `/api/{slug}/chapter-{number}`

### Progress URLs
**Frontend API**: `/api/{slug}/chapter-{number}/progress`
**Backend API**: `/api/{slug}/{number}/progress`

### Author URLs
**Frontend Page**: `/author/{slug}`
**Frontend API**: `/api/authors/{slug}`
**Backend API**: `/api/authors/{slug}`

## Response Format Standards

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... } // for paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Direct Response (Some endpoints)
```json
{ ... } // Direct data without wrapper
```

## Authentication Flow

1. **Login/Register**: POST to `/api/auth` with action
2. **Token Storage**: Stored in HTTP-only cookies
3. **Protected Requests**: Token forwarded via Authorization header
4. **Token Refresh**: Automatic via refresh token mechanism

## File Upload Considerations

Note: No file upload endpoints are currently implemented, but may be needed for:
- Novel cover images
- Author avatars
- Chapter content with images

This schema reflects the current state of the application after all recent modifications and user edits.