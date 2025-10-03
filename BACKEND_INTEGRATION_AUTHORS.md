# Backend API Integration Guide - Author Endpoints

This document outlines the API endpoints that need to be implemented in your FastAPI backend for the author functionality.

## Author API Endpoints

### 1. Get Author by Slug
**Endpoint**: `GET /api/authors/slug/{slug}`
**Purpose**: Fetch author details by their slug

**Expected Request**:
```
GET http://localhost:8000/api/authors/slug/stephen-king
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "author-uuid",
    "name": "Stephen King",
    "slug": "stephen-king",
    "bio": "Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.",
    "avatar_url": "https://example.com/avatars/stephen-king.jpg",
    "nationality": "American",
    "website": "https://stephenking.com",
    "social_links": {
      "twitter": "https://twitter.com/stephenking",
      "facebook": "https://facebook.com/stephenking",
      "instagram": "https://instagram.com/stephenking"
    },
    "total_novels": 85,
    "total_followers": 15234,
    "total_views": 2456789,
    "joined_at": "2020-01-15T10:30:00Z",
    "is_verified": true
  }
}
```

### 2. Get Author's Novels
**Endpoint**: `GET /api/authors/slug/{slug}/novels`
**Purpose**: Fetch all novels by a specific author

**Query Parameters**:
- `sort_by`: `newest` | `popular` | `rating` (default: `newest`)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**Expected Request**:
```
GET http://localhost:8000/api/authors/slug/stephen-king/novels?sort_by=rating&page=1&limit=20
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "novel-uuid",
      "title": "The Shining",
      "slug": "the-shining",
      "description": "A masterpiece of horror and suspense...",
      "cover_url": "https://example.com/covers/the-shining.jpg",
      "genres": ["Horror", "Thriller", "Supernatural"],
      "status": "completed",
      "rating": 4.5,
      "rating_count": 12453,
      "chapter_count": 58,
      "view_count": 856432,
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## Frontend Integration Notes

The frontend expects:
1. **Author data** to be returned directly (the Next.js API route handles unwrapping the `success`/`data` structure)
2. **Error handling** with appropriate HTTP status codes:
   - 404 for author not found
   - 500 for server errors
3. **Consistent data structure** matching the TypeScript interfaces in the frontend

## API Routes Created

The following Next.js API routes have been created and will forward requests to your FastAPI backend:

1. `/api/authors/[slug]/route.ts` - Forwards to `/api/authors/slug/{slug}`
2. `/api/authors/[slug]/novels/route.ts` - Forwards to `/api/authors/slug/{slug}/novels`

## Implementation Status

✅ **Completed on Frontend**:
- Updated import statements to use `@/components`
- Fixed API calls to use new structure  
- Created Next.js API routes
- Updated TypeScript interfaces

🔲 **Needs Backend Implementation**:
- `GET /api/authors/slug/{slug}` endpoint
- `GET /api/authors/slug/{slug}/novels` endpoint
- Proper error handling and response formatting
- Database queries for author data and associated novels

## Testing

Once implemented, you can test the endpoints using:

```bash
# Test author details
curl http://localhost:8000/api/authors/slug/stephen-king

# Test author novels
curl "http://localhost:8000/api/authors/slug/stephen-king/novels?sort_by=rating&page=1"
```