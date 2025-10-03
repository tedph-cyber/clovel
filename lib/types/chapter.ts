export interface Chapter {
  id: string;
  title: string;
  slug: string;
  novelId: string;
  novelTitle: string;
  chapterNumber: number;
  content: string;
  wordCount: number;
  publishedAt: string;
  updatedAt: string;
  previousChapter?: ChapterSummary;
  nextChapter?: ChapterSummary;
  isLocked: boolean;
  views: number;
}

export interface ChapterSummary {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  wordCount: number;
  publishedAt: string;
  isLocked: boolean;
  isRead?: boolean;
}

export interface ChapterFilter {
  novelId: string;
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
}

export interface ReadingProgress {
  userId: string;
  novelId: string;
  chapterId: string;
  chapterNumber: number;
  progress: number; // percentage (0-100)
  lastReadAt: string;
  totalTimeSpent: number; // in minutes
}

export interface BookmarkInfo {
  userId: string;
  novelId: string;
  chapterId: string;
  position: number; // character position in chapter
  note?: string;
  createdAt: string;
}