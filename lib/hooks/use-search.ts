import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './use-debounce';
import { searchNovels } from '../db/novels';

export interface SearchResult {
  novels: any[];
  authors: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

export interface SearchParams {
  q: string;
  type?: 'all' | 'novel' | 'author';
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  autoSearch?: boolean;
  initialParams?: Partial<SearchParams>;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    autoSearch = true,
    initialParams = {}
  } = options;

  const [query, setQuery] = useState(initialParams.q || '');
  const [filters, setFilters] = useState<Record<string, any>>(initialParams.filters || {});
  const [results, setResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, debounceMs);

  // Search function using Supabase
  const search = useCallback(async (searchParams?: Partial<SearchParams>) => {
    const params: SearchParams = {
      q: query,
      type: 'all',
      page: 1,
      limit: 20,
      ...initialParams,
      ...searchParams,
      filters: { ...filters, ...searchParams?.filters }
    };

    if (!params.q || params.q.length < minQueryLength) {
      setResults(null);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let novels: any[] = [];
      let authors: any[] = [];

      // Search based on type
      if (params.type === 'all' || params.type === 'novel') {
        novels = await searchNovels(params.q, params.limit);
      }

      // Note: Author search removed - authors are now just text fields in novels
      // You can search by author name within novels instead

      const searchResults: SearchResult = {
        novels,
        authors: [], // Empty array since we don't have separate authors
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: novels.length,
          hasNext: false,
        },
      };

      setResults(searchResults);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, minQueryLength, initialParams]);

  // Get search suggestions
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    try {
      // Get top 5 novel titles as suggestions
      const novels = await searchNovels(searchQuery, 5);
      setSuggestions(novels.map(n => n.title));
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      setSuggestions([]);
    }
  }, [minQueryLength]);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery) {
      search();
    }
  }, [debouncedQuery, autoSearch, search]);

  // Get suggestions when query changes
  useEffect(() => {
    if (query.length >= minQueryLength) {
      getSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query, minQueryLength, getSuggestions]);

  // Update query
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setHasSearched(false);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    if (autoSearch && query) {
      setHasSearched(false);
    }
  }, [autoSearch, query]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setResults(null);
    setSuggestions([]);
    setError(null);
    setHasSearched(false);
  }, []);

  // Load more results (pagination)
  const loadMore = useCallback(async () => {
    if (!results || !results.pagination.hasNext) return;

    try {
      setIsLoading(true);
      const nextPage = results.pagination.page + 1;
      
      const moreNovels = await searchNovels(query, 20);
      
      setResults(prev => {
        if (!prev) return {
          novels: moreNovels,
          authors: [],
          pagination: {
            page: nextPage,
            limit: 20,
            total: moreNovels.length,
            hasNext: false,
          },
        };
        
        return {
          ...prev,
          novels: [...prev.novels, ...moreNovels],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more results');
    } finally {
      setIsLoading(false);
    }
  }, [results, query, filters, initialParams]);

  return {
    query,
    filters,
    results,
    suggestions,
    isLoading,
    error,
    hasSearched,
    updateQuery,
    updateFilters,
    search,
    clearSearch,
    loadMore,
    hasMore: results?.pagination.hasNext || false
  };
}