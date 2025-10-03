# Frontend vs Backend Responsibilities - Clovel Platform

## Frontend Responsibilities (Next.js App)

### 1. **User Interface & Experience**
- **Page Rendering**: All pages in `app/` directory
  - Novel listing and detail pages
  - Chapter reading interface with customizable settings
  - Author profiles and portfolios
  - Search and filtering interfaces
  - Authentication forms
  - User library and reading lists

- **Client-Side State Management**
  - Reading progress tracking (with local storage fallback)
  - User interface settings (themes, font sizes, reading preferences)
  - Authentication state
  - Search query and filter states

- **Real-time Features**
  - Reading progress updates during scrolling
  - Local storage for offline reading progress
  - Debounced search functionality
  - Client-side pagination and filtering

### 2. **API Gateway Layer**
- **Request Forwarding**: All routes in `app/api/` act as proxies
  - Format transformation between frontend and backend
  - Error handling and user-friendly error messages
  - Authentication token management
  - Request parameter validation

- **Response Processing**
  - Unwrapping backend response structures
  - Data transformation for frontend consumption
  - Consistent error response formatting

### 3. **Client-Side API Libraries**
- **Type-Safe API Clients** (`lib/api/`)
  - `ChapterApi`: Chapter content and progress management
  - `NovelApi`: Novel data and metadata
  - `SearchApi`: Search functionality and suggestions
  - `AuthApi`: Authentication and user management

### 4. **Utility Libraries**
- **Formatters** (`lib/utils/formatters.ts`): Date, number, reading time formatting
- **Validators** (`lib/utils/validators.ts`): Form validation
- **Hooks** (`lib/hooks/`): Reusable React hooks for common functionality

### 5. **UI Components**
- **Reusable Components** (`components/`): Buttons, cards, navigation, etc.
- **Layout Components**: Navigation, footers, breadcrumbs
- **Specialized Components**: Rating systems, pagination, search interfaces

---

## Backend Responsibilities (FastAPI - To Be Implemented)

### 1. **Data Management**
- **Database Operations**
  - Novel CRUD operations
  - Chapter content storage and retrieval
  - Author profile management
  - User account and authentication data
  - Reading progress persistence
  - View analytics and tracking

- **Data Relationships**
  - Novel ↔ Author relationships
  - Novel ↔ Chapter relationships
  - User ↔ Reading Progress relationships
  - Genre and tag associations

### 2. **Business Logic**
- **Content Management**
  - Chapter ordering and navigation
  - Novel status management (ongoing, completed, hiatus)
  - Publication and update timestamps
  - Content validation and sanitization

- **User Management**
  - User registration and profile creation
  - Authentication and authorization
  - Reading history tracking
  - Bookmark and library management

- **Analytics**
  - View counting and tracking
  - Reading progress analytics
  - Popular content algorithms
  - User engagement metrics

### 3. **API Endpoints Implementation**

#### **Novel Management**
```python
# Required FastAPI endpoints:
GET /api/novels                    # List novels with filtering
POST /api/novels                   # Create new novel
GET /api/novels/{id}              # Get novel details
PUT /api/novels/{id}              # Update novel
DELETE /api/novels/{id}           # Delete novel
```

#### **Chapter Management**
```python
# Required FastAPI endpoints:
GET /api/{novel_slug}/chapter-{number}     # Get chapter content
GET /api/{novel_slug}/{number}/progress    # Get reading progress
POST /api/{novel_slug}/{number}/progress   # Update reading progress
POST /api/{novel_slug}/{number}/view       # Track chapter view
GET /api/chapters                          # List chapters
POST /api/chapters                         # Create chapter
```

#### **Author Management**
```python
# Required FastAPI endpoints:
GET /api/authors/{slug}            # Get author details
GET /api/authors/{slug}/novels     # Get author's novels (optional)
```

#### **Search & Discovery**
```python
# Required FastAPI endpoints:
GET /api/search                    # General search
POST /api/search                   # Advanced search with filters
```

#### **Authentication**
```python
# Required FastAPI endpoints:
POST /api/auth/login              # User login
POST /api/auth/register           # User registration
POST /api/auth/logout             # User logout
GET /api/auth/profile             # Get user profile
POST /api/auth/refresh            # Refresh authentication token
```

### 4. **Data Processing**
- **Content Processing**
  - Text formatting and sanitization
  - Reading time calculation
  - Word count statistics
  - Content indexing for search

- **Search Implementation**
  - Full-text search capabilities
  - Filtering by multiple criteria
  - Search suggestions and auto-complete
  - Popular search tracking

### 5. **Security & Performance**
- **Authentication & Authorization**
  - JWT token generation and validation
  - Password hashing and security
  - User permission management
  - Rate limiting and abuse prevention

- **Performance Optimization**
  - Database query optimization
  - Caching strategies
  - Pagination implementation
  - Response compression

### 6. **Data Models**

#### **Expected Data Structures**
```python
# Novel Model
class Novel:
    id: str
    title: str
    slug: str
    description: str
    author_id: str
    cover_url: Optional[str]
    status: str  # 'ongoing', 'completed', 'hiatus'
    genres: List[str]
    rating: float
    rating_count: int
    chapter_count: int
    view_count: int
    created_at: datetime
    updated_at: datetime

# Chapter Model
class Chapter:
    id: str
    title: str
    slug: str
    content: str
    chapter_number: int
    novel_id: str
    word_count: int
    published_at: datetime
    
# Author Model
class Author:
    id: str
    name: str
    slug: str
    bio: Optional[str]
    avatar_url: Optional[str]
    social_links: dict
    total_novels: int
    total_views: int
    joined_at: datetime

# Reading Progress Model
class ReadingProgress:
    user_id: str
    novel_slug: str
    chapter_number: int
    progress: int  # 0-100
    last_read_at: datetime
```

---

## Communication Contract

### **Frontend → Backend**
1. **Authentication**: JWT tokens in Authorization headers
2. **Data Format**: JSON requests/responses
3. **Error Handling**: HTTP status codes + error messages
4. **Pagination**: Standard limit/offset or cursor-based
5. **Filtering**: Query parameters for search and filtering

### **Backend → Frontend**
1. **Response Format**: Consistent JSON structure
2. **Error Responses**: Standardized error format
3. **Data Consistency**: Reliable data relationships
4. **Performance**: Optimized response times
5. **Security**: Proper authentication validation

### **Shared Responsibilities**
1. **Data Validation**: Both frontend (UX) and backend (security)
2. **Error Handling**: Frontend user experience + backend data integrity
3. **Performance**: Frontend caching + backend optimization
4. **Security**: Frontend token management + backend authentication

This separation ensures clear boundaries and responsibilities while maintaining efficient communication between the frontend and backend systems.