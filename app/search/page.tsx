'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { Pagination } from '@/components/ui/pagination';
import { useSearch } from '@/lib/hooks/use-search';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { GENRES } from '@/lib/constants/genres';
import { formatNumber, formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [searchType, setSearchType] = useState<'all' | 'novel' | 'author'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedQuery = useDebounce(query, 300);

  const {
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearSearch
  } = useSearch({
    initialParams: { q: initialQuery, type: searchType },
    autoSearch: false
  });

  // Perform search when parameters change
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      search({
        q: debouncedQuery,
        type: searchType,
        page: currentPage,
        filters: {
          genres: selectedGenres,
          status: selectedStatus,
          minRating: minRating || undefined,
          sortBy
        }
      });
    }
  }, [debouncedQuery, searchType, currentPage, selectedGenres, selectedStatus, minRating, sortBy, search]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedStatus([]);
    setMinRating(0);
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedStatus.length > 0 || minRating > 0 || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Novels</h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for novels, authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg"
            />
          </div>

          {/* Search Type Tabs */}
          <div className="flex items-center gap-2 mt-4">
            {(['all', 'novel', 'author'] as const).map((type) => (
              <Button
                key={type}
                variant={searchType === type ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSearchType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === 'all' && results && (
                  <span className="ml-1">({results.total})</span>
                )}
                {type === 'novel' && results && (
                  <span className="ml-1">({results.totalNovels})</span>
                )}
                {type === 'author' && results && (
                  <span className="ml-1">({results.totalAuthors})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Sort By */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="updatedAt">Recently Updated</option>
                    <option value="publishedAt">Newest</option>
                    <option value="title">Title</option>
                    <option value="views">Most Popular</option>
                  </select>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Genres</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {GENRES.map((genre) => (
                      <label key={genre.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre.id)}
                          onChange={() => handleGenreToggle(genre.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{genre.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                  <div className="space-y-2">
                    {['ongoing', 'completed', 'hiatus'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes(status)}
                          onChange={() => handleStatusToggle(status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="minRating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 flex items-center">
                          {rating === 0 ? (
                            <span className="text-sm text-gray-700">Any Rating</span>
                          ) : (
                            <Rating rating={rating} size="sm" readonly />
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => search()} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!isLoading && !error && hasSearched && results && (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {console.log('Search results:', results)}
                    {results.total === 0 ? 'No results found' : `${formatNumber(results.total)} results found`}
                    {query && ` for "${query}"`}
                  </h2>
                </div>

                {/* Novels Results */}
                {(searchType === 'all' || searchType === 'novel') && results.novels.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Novels ({results.totalNovels})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.novels.map((novel) => (
                        <Card key={novel.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="flex-shrink-0">
                                <Image
                                  src={novel.coverImage || '/placeholder-book.jpg'}
                                  alt={novel.title}
                                  width={60}
                                  height={80}
                                  className="rounded object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link 
                                  href={`/novel/${novel.slug}`}
                                  className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                                >
                                  {novel.title}
                                </Link>
                                <Link
                                  href={`/author/${novel.authorSlug}`}
                                  className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                  by {novel.author}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                  <Rating rating={novel.rating} size="sm" readonly />
                                  <span className="text-sm text-gray-500">
                                    {novel.totalChapters} chapters
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {novel.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {novel.genres.slice(0, 2).map((genre) => (
                                    <Badge key={genre} variant="secondary" size="sm">
                                      {genre}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  Updated {formatDate(novel.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors Results */}
                {(searchType === 'all' || searchType === 'author') && results.authors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Authors ({results.totalAuthors})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.authors.map((author) => (
                        <Card key={author.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {author.avatar ? (
                                  <Image
                                    src={author.avatar}
                                    alt={author.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-medium text-gray-600">
                                      {author.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <Link
                                  href={`/author/${author.slug}`}
                                  className="text-lg font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {author.name}
                                  {author.isVerified && (
                                    <span className="ml-1 text-blue-500">✓</span>
                                  )}
                                </Link>
                                <p className="text-sm text-gray-600">
                                  {author.totalNovels} novels
                                </p>
                                {author.bio && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {author.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {results.pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={results.pagination.page}
                      totalPages={results.pagination.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}

            {!isLoading && !error && !hasSearched && query.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">Start Your Search</h2>
                <p className="text-gray-600">Enter a novel title, author name, or keyword to begin</p>
              </div>
            )}

            {!isLoading && !error && hasSearched && results && results.total === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h2>
                <p className="text-gray-600 mb-4">
                  We couldn't find any novels or authors matching your search.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Try:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Checking your spelling</li>
                    <li>Using different keywords</li>
                    <li>Removing some filters</li>
                    <li>Searching for broader terms</li>
                  </ul>
                </div>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline" className="mt-4">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}