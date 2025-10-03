import { apiClient, handleApiResponse } from './client';
import { API_ROUTES } from '../constants/routes';
import type { 
  Novel, 
  NovelSummary, 
  NovelDetail, 
  NovelFilter,
  PaginatedResponse,
  ApiResponse 
} from '../types';

export class NovelApi {
  // Get all novels with optional filtering
  static async getAll(filters?: NovelFilter): Promise<PaginatedResponse<NovelSummary>> {
    return apiClient.get<PaginatedResponse<NovelSummary>>(API_ROUTES.NOVELS, filters);
  }

  // Get a specific novel by ID
  static async getById(id: string): Promise<NovelDetail> {
    const response = await apiClient.get<ApiResponse<NovelDetail>>(
      API_ROUTES.NOVEL_DETAIL(id)
    );
    return handleApiResponse(response) as NovelDetail;
  }

  // Get a novel by slug
  static async getBySlug(slug: string): Promise<NovelDetail> {
    const response = await apiClient.get<ApiResponse<NovelDetail>>(
      `${API_ROUTES.NOVELS}/slug/${slug}`
    );
    return handleApiResponse(response) as NovelDetail;
  }

  // Get popular novels
  static async getPopular(limit: number = 10): Promise<NovelSummary[]> {
    const response = await apiClient.get<ApiResponse<NovelSummary[]>>(
      `${API_ROUTES.NOVELS}/popular`,
      { limit }
    );
    return handleApiResponse(response) as NovelSummary[];
  }

  // Get recently updated novels
  static async getRecentlyUpdated(limit: number = 10): Promise<NovelSummary[]> {
    const response = await apiClient.get<ApiResponse<NovelSummary[]>>(
      `${API_ROUTES.NOVELS}/recent`,
      { limit }
    );
    return handleApiResponse(response) as NovelSummary[];
  }

  // Get trending novels
  static async getTrending(limit: number = 10): Promise<NovelSummary[]> {
    const response = await apiClient.get<ApiResponse<NovelSummary[]>>(
      `${API_ROUTES.NOVELS}/trending`,
      { limit }
    );
    return handleApiResponse(response) as NovelSummary[];
  }

  // Get novels by genre
  static async getByGenre(genre: string, filters?: NovelFilter): Promise<PaginatedResponse<NovelSummary>> {
    return apiClient.get<PaginatedResponse<NovelSummary>>(
      `${API_ROUTES.NOVELS}/genre/${genre}`,
      filters
    );
  }

  // Get novels by author
  static async getByAuthor(authorId: string, filters?: NovelFilter): Promise<PaginatedResponse<NovelSummary>> {
    return apiClient.get<PaginatedResponse<NovelSummary>>(
      `${API_ROUTES.NOVELS}/author/${authorId}`,
      filters
    );
  }

  // Get similar novels
  static async getSimilar(novelId: string, limit: number = 10): Promise<NovelSummary[]> {
    const response = await apiClient.get<ApiResponse<NovelSummary[]>>(
      `${API_ROUTES.NOVEL_DETAIL(novelId)}/similar`,
      { limit }
    );
    return handleApiResponse(response) as NovelSummary[];
  }

  // Get novel chapters
  static async getChapters(novelId: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<any>> {
    return apiClient.get<PaginatedResponse<any>>(
      API_ROUTES.NOVEL_CHAPTERS(novelId),
      { page, limit }
    );
  }

  // Bookmark a novel
  static async bookmark(novelId: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.NOVEL_DETAIL(novelId)}/bookmark`);
  }

  // Remove bookmark
  static async removeBookmark(novelId: string): Promise<void> {
    await apiClient.delete(`${API_ROUTES.NOVEL_DETAIL(novelId)}/bookmark`);
  }

  // Rate a novel
  static async rate(novelId: string, rating: number): Promise<void> {
    await apiClient.post(`${API_ROUTES.NOVEL_DETAIL(novelId)}/rate`, { rating });
  }

  // Add to reading list
  static async addToReadingList(novelId: string): Promise<void> {
    await apiClient.post(`${API_ROUTES.NOVEL_DETAIL(novelId)}/reading-list`);
  }

  // Remove from reading list
  static async removeFromReadingList(novelId: string): Promise<void> {
    await apiClient.delete(`${API_ROUTES.NOVEL_DETAIL(novelId)}/reading-list`);
  }
}

export const novelApi = NovelApi;