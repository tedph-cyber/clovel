import { apiClient, handleApiResponse } from './client';
import { API_ROUTES } from '../constants/routes';
import type { 
  Chapter, 
  ChapterSummary, 
  ChapterFilter,
  ReadingProgress,
  BookmarkInfo,
  PaginatedResponse,
  ApiResponse 
} from '../types';

export class ChapterApi {
  // Get all chapters with optional filtering
  static async getAll(filters?: ChapterFilter): Promise<PaginatedResponse<ChapterSummary>> {
    return apiClient.get<PaginatedResponse<ChapterSummary>>(API_ROUTES.CHAPTERS, filters);
  }

  // Get a specific chapter by ID
  static async getById(id: string): Promise<Chapter> {
    const response = await apiClient.get<ApiResponse<Chapter>>(
      API_ROUTES.CHAPTER_DETAIL(id)
    );
    return handleApiResponse(response) as Chapter;
  }

  // Get a chapter by novel slug and chapter slug
  static async getBySlug(novelSlug: string, chapterSlug: string): Promise<Chapter> {
    const response = await apiClient.get<ApiResponse<Chapter>>(
      `${API_ROUTES.CHAPTERS}/novel/${novelSlug}/chapter/${chapterSlug}`
    );
    return handleApiResponse(response) as Chapter;
  }

  // Get chapters for a specific novel
  static async getByNovel(novelId: string, filters?: ChapterFilter): Promise<PaginatedResponse<ChapterSummary>> {
    return apiClient.get<PaginatedResponse<ChapterSummary>>(
      `${API_ROUTES.CHAPTERS}/novel/${novelId}`,
      filters
    );
  }

  // Get next chapter
  static async getNext(currentChapterId: string): Promise<Chapter | null> {
    try {
      const response = await apiClient.get<ApiResponse<Chapter>>(
        `${API_ROUTES.CHAPTER_DETAIL(currentChapterId)}/next`
      );
      return handleApiResponse(response) as Chapter;
    } catch (error) {
      return null;
    }
  }

  // Get previous chapter
  static async getPrevious(currentChapterId: string): Promise<Chapter | null> {
    try {
      const response = await apiClient.get<ApiResponse<Chapter>>(
        `${API_ROUTES.CHAPTER_DETAIL(currentChapterId)}/previous`
      );
      return handleApiResponse(response) as Chapter;
    } catch (error) {
      return null;
    }
  }

  // Update reading progress (new structure)
  static async updateProgress(novelSlug: string, chapterId: string, progress: number): Promise<void> {
    await apiClient.post(`/api/${novelSlug}/${chapterId}/progress`, {
      progress
    });
  }

  // Get reading progress (new structure)
  static async getProgress(novelSlug: string, chapterId: string): Promise<ReadingProgress | null> {
    try {
      const response = await apiClient.get<ApiResponse<ReadingProgress>>(
        `/api/${novelSlug}/${chapterId}/progress`
      );
      return handleApiResponse(response) as ReadingProgress;
    } catch (error) {
      return null;
    }
  }

  // Add bookmark
  static async addBookmark(chapterId: string, position: number, note?: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.CHAPTER_DETAIL(chapterId)}/bookmark`, {
      position,
      note
    });
  }

  // Remove bookmark
  static async removeBookmark(chapterId: string): Promise<void> {
    await apiClient.delete(`${API_ROUTES.CHAPTER_DETAIL(chapterId)}/bookmark`);
  }

  // Get bookmarks for a chapter
  static async getBookmarks(chapterId: string): Promise<BookmarkInfo[]> {
    const response = await apiClient.get<ApiResponse<BookmarkInfo[]>>(
      `${API_ROUTES.CHAPTER_DETAIL(chapterId)}/bookmarks`
    );
    return handleApiResponse(response) as BookmarkInfo[];
  }

  // Mark chapter as read
  static async markAsRead(chapterId: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.CHAPTER_DETAIL(chapterId)}/read`);
  }

  // Mark chapter as unread
  static async markAsUnread(chapterId: string): Promise<void> {
    await apiClient.delete(`${API_ROUTES.CHAPTER_DETAIL(chapterId)}/read`);
  }

  // Increment view count
  static async incrementViews(chapterId: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.CHAPTER_DETAIL(chapterId)}/view`);
  }

  // Get recently read chapters
  static async getRecentlyRead(limit: number = 10): Promise<ChapterSummary[]> {
    const response = await apiClient.get<ApiResponse<ChapterSummary[]>>(
      `${API_ROUTES.CHAPTERS}/recent`,
      { limit }
    );
    return handleApiResponse(response) as ChapterSummary[];
  }
}

export const chapterApi = ChapterApi;