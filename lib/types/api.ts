export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  message?: string;
  error?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface SearchParams {
  q?: string;
  type?: 'novel' | 'author' | 'all';
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  novels: NovelSearchResult[];
  authors: AuthorSearchResult[];
  total: number;
  totalNovels: number;
  totalAuthors: number;
  pagination: PaginationInfo;
}

export interface NovelSearchResult {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorSlug: string;
  coverImage: string;
  description: string;
  rating: number;
  totalChapters: number;
  status: string;
  genres: string[];
  updatedAt: string;
}

export interface AuthorSearchResult {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  totalNovels: number;
  isVerified: boolean;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  novelCount: number;
  isPopular: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  readingList: string[];
  bookmarks: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  fontFamily: string;
  lineHeight: number;
  autoBookmark: boolean;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  newChapters: boolean;
  novelUpdates: boolean;
  authorNews: boolean;
  systemUpdates: boolean;
}