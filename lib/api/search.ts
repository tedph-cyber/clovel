import { apiClient, handleApiResponse } from './client';
import { API_ROUTES } from '../constants/routes';
import type { 
  SearchParams,
  SearchResult,
  NovelSearchResult,
  AuthorSearchResult,
  ApiResponse 
} from '../types';

export class SearchApi {
  // General search
  static async search(params: SearchParams): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>(
      API_ROUTES.SEARCH,
      params
    );
    console.log('API response:', response);
    // Return response directly since search API returns raw data
    return response;
  }

  // Search novels only
  static async searchNovels(query: string, filters?: Record<string, any>): Promise<NovelSearchResult[]> {
    const response = await apiClient.get<ApiResponse<NovelSearchResult[]>>(
      API_ROUTES.SEARCH_NOVELS,
      { q: query, ...filters }
    );
    return handleApiResponse(response) as NovelSearchResult[];
  }

  // Search authors only
  static async searchAuthors(query: string, filters?: Record<string, any>): Promise<AuthorSearchResult[]> {
    const response = await apiClient.get<ApiResponse<AuthorSearchResult[]>>(
      API_ROUTES.SEARCH_AUTHORS,
      { q: query, ...filters }
    );
    return handleApiResponse(response) as AuthorSearchResult[];
  }

  // Get search suggestions
  static async getSuggestions(query: string, type?: 'novel' | 'author'): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `${API_ROUTES.SEARCH}/suggestions`,
      { q: query, type }
    );
    return handleApiResponse(response) as string[];
  }

  // Get popular search terms
  static async getPopularSearches(limit: number = 10): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `${API_ROUTES.SEARCH}/popular`,
      { limit }
    );
    return handleApiResponse(response) as string[];
  }

  // Advanced search with multiple filters
  static async advancedSearch(params: {
    query?: string;
    genres?: string[];
    authors?: string[];
    status?: string[];
    minRating?: number;
    maxRating?: number;
    minChapters?: number;
    maxChapters?: number;
    languages?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<SearchResult> {
    const response = await apiClient.get<ApiResponse<SearchResult>>(
      `${API_ROUTES.SEARCH}/advanced`,
      params
    );
    return handleApiResponse(response) as SearchResult;
  }

  // Search within a specific novel's chapters
  static async searchChapters(novelId: string, query: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `${API_ROUTES.SEARCH}/novels/${novelId}/chapters`,
      { q: query }
    );
    return handleApiResponse(response) as any[];
  }

  // Search by tags
  static async searchByTags(tags: string[]): Promise<NovelSearchResult[]> {
    const response = await apiClient.get<ApiResponse<NovelSearchResult[]>>(
      `${API_ROUTES.SEARCH}/tags`,
      { tags: tags.join(',') }
    );
    return handleApiResponse(response) as NovelSearchResult[];
  }

  // Get related searches
  static async getRelatedSearches(query: string): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `${API_ROUTES.SEARCH}/related`,
      { q: query }
    );
    return handleApiResponse(response) as string[];
  }
}

export const searchApi = SearchApi;