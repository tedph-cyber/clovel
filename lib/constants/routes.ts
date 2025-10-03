export const ROUTES = {
  HOME: '/',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Novel routes
  NOVELS: '/novels',
  NOVEL_DETAIL: (slug: string) => `/novel/${slug}`,
  NOVEL_CHAPTER: (novelSlug: string, chapterId: string) => `/novel/${novelSlug}/${chapterId}`,
  
  // Author routes
  AUTHORS: '/authors',
  AUTHOR_DETAIL: (slug: string) => `/author/${slug}`,
  
  // Genre routes
  GENRES: '/genres',
  GENRE_DETAIL: (slug: string) => `/genre/${slug}`,
  
  // User routes
  LIBRARY: '/library',
  READING_LIST: '/reading-list',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Utility routes
  SEARCH: '/search',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

export const API_ROUTES = {
  BASE_URL: 'http://localhost:8000',
  
  // Novel endpoints
  NOVELS: '/api/novels',
  NOVEL_DETAIL: (id: string) => `/api/novels/${id}`,
  NOVEL_CHAPTERS: (id: string) => `/api/novels/${id}/chapters`,
  
  // Chapter endpoints
  CHAPTERS: '/api/chapters',
  CHAPTER_DETAIL: (id: string) => `/api/chapters/${id}`,
  
  // Author endpoints
  AUTHORS: '/api/authors',
  AUTHOR_DETAIL: (id: string) => `/api/authors/${id}`,
  
  // Search endpoints
  SEARCH: '/api/search',
  SEARCH_NOVELS: '/api/search/novels',
  SEARCH_AUTHORS: '/api/search/authors',
  
  // Genre endpoints
  GENRES: '/api/genres',
  GENRE_DETAIL: (id: string) => `/api/genres/${id}`,
  
  // Auth endpoints
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_PROFILE: '/api/auth/profile',
  
  // User endpoints
  USER_LIBRARY: '/api/user/library',
  USER_READING_LIST: '/api/user/reading-list',
  USER_BOOKMARKS: '/api/user/bookmarks',
  USER_PROGRESS: '/api/user/progress',
} as const;