import { Author } from './author';
import { Genre } from './api';
import { ChapterSummary } from './chapter';

export interface Novel {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: Author;
  coverImage: string;
  status: NovelStatus;
  genres: Genre[];
  tags: string[];
  rating: number;
  ratingsCount: number;
  totalChapters: number;
  publishedChapters: number;
  wordCount: number;
  language: string;
  publishedAt: string;
  updatedAt: string;
  isCompleted: boolean;
  views: number;
  bookmarks: number;
  lastChapterTitle?: string;
  lastChapterSlug?: string;
  lastUpdated?: string;
}

export interface NovelSummary {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  rating: number;
  totalChapters: number;
  status: NovelStatus;
  genres: string[];
  updatedAt: string;
}

export interface NovelDetail extends Novel {
  chapters: ChapterSummary[];
  similarNovels: NovelSummary[];
  reviews: Review[];
}

export interface NovelFilter {
  genres?: string[];
  status?: NovelStatus;
  language?: string;
  minRating?: number;
  sortBy?: NovelSortOption;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

export type NovelStatus = 'ongoing' | 'completed' | 'hiatus' | 'dropped';

export type NovelSortOption = 
  | 'title'
  | 'rating'
  | 'publishedAt'
  | 'updatedAt'
  | 'totalChapters'
  | 'views'
  | 'bookmarks';

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  helpful: number;
  spoiler: boolean;
}