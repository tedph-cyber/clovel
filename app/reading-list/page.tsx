'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { 
  BookOpen, 
  Plus,
  Trash2,
  Grid,
  List as ListIcon,
  Search,
  Filter,
  SortAsc,
  Clock,
  Star
} from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils/formatters';
import TetrisLoading from '@/components/ui/tetris-loader';

interface ReadingListNovel {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url?: string;
  author: {
    name: string;
    slug: string;
  };
  genres: string[];
  status: string;
  rating: number;
  rating_count: number;
  chapter_count: number;
  view_count: number;
  updated_at: string;
  added_to_list_at: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export default function ReadingListPage() {
  const [novels, setNovels] = useState<ReadingListNovel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<ReadingListNovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and view options
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('added_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Add novel modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNovelQuery, setAddNovelQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/user/reading-list');
        if (!response.ok) {
          throw new Error('Failed to fetch reading list');
        }

        const data = await response.json();
        if (data.success) {
          setNovels(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch reading list:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reading list');
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, []);

  // Filter and sort novels
  useEffect(() => {
    let filtered = [...novels];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(novel =>
        novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        novel.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(novel => novel.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(novel => novel.priority === priorityFilter);
    }

    // Genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter(novel => novel.genres.includes(genreFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.name.localeCompare(b.author.name);
        case 'rating':
          return b.rating - a.rating;
        case 'updated_at':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default: // added_at
          return new Date(b.added_to_list_at).getTime() - new Date(a.added_to_list_at).getTime();
      }
    });

    setFilteredNovels(filtered);
  }, [novels, searchQuery, statusFilter, priorityFilter, genreFilter, sortBy]);

  // Search for novels to add
  useEffect(() => {
    const searchNovels = async () => {
      if (!addNovelQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(addNovelQuery)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Filter out novels already in reading list
            const novelIds = new Set(novels.map(n => n.id));
            setSearchResults((data.data || []).filter((novel: any) => !novelIds.has(novel.id)));
          }
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(searchNovels, 300);
    return () => clearTimeout(timeoutId);
  }, [addNovelQuery, novels]);

  const handleRemoveFromList = async (novelId: string) => {
    try {
      const response = await fetch(`/api/user/reading-list/${novelId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNovels(prev => prev.filter(novel => novel.id !== novelId));
      }
    } catch (err) {
      console.error('Failed to remove from reading list:', err);
    }
  };

  const handleAddToList = async (novelId: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      const response = await fetch('/api/user/reading-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novel_id: novelId, priority })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNovels(prev => [data.data, ...prev]);
          setShowAddModal(false);
          setAddNovelQuery('');
        }
      }
    } catch (err) {
      console.error('Failed to add to reading list:', err);
    }
  };

  const handleUpdatePriority = async (novelId: string, priority: 'low' | 'medium' | 'high') => {
    try {
      const response = await fetch(`/api/user/reading-list/${novelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });

      if (response.ok) {
        setNovels(prev => prev.map(novel => 
          novel.id === novelId ? { ...novel, priority } : novel
        ));
      }
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'hiatus': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAllGenres = () => {
    const genres = new Set<string>();
    novels.forEach(novel => novel.genres.forEach(genre => genres.add(genre)));
    return Array.from(genres).sort();
  };

  const NovelGridCard = ({ novel }: { novel: ReadingListNovel }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative">
      <CardHeader className="pb-3">
        <div className="aspect-[2/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {novel.cover_url ? (
            <Image
              src={novel.cover_url}
              alt={novel.title}
              width={120}
              height={180}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-center p-4">
              <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-2" />
              <span className="text-xs text-gray-500 font-medium line-clamp-2">{novel.title}</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 text-lg">
              <Link 
                href={`/novel/${novel.slug}`}
                className="hover:text-blue-600 transition-colors"
              >
                {novel.title}
              </Link>
            </CardTitle>
            <Link 
              href={`/author/${novel.author.slug}`}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              by {novel.author.name}
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveFromList(novel.id)}
            className="text-red-600 hover:text-red-700 p-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className={getPriorityColor(novel.priority)}>
            {novel.priority} priority
          </Badge>
          <Badge className={getStatusColor(novel.status)}>
            {novel.status}
          </Badge>
        </div>

        {novel.genres.slice(0, 2).map((genre) => (
          <Badge key={genre} variant="outline" className="text-xs mr-1 mb-1">
            {genre}
          </Badge>
        ))}

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2">
            <Rating rating={novel.rating} size="sm" readonly showValue />
            <span className="text-xs text-gray-500">({formatNumber(novel.rating_count)})</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {formatNumber(novel.chapter_count)} chapters
            </span>
            <span>{formatNumber(novel.view_count)} views</span>
          </div>

          {novel.notes && (
            <p className="text-xs text-gray-600 line-clamp-2 italic">
              "{novel.notes}"
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500">
              Added {formatDate(novel.added_to_list_at)}
            </p>
            
            <select
              value={novel.priority}
              onChange={(e) => handleUpdatePriority(novel.id, e.target.value as any)}
              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const NovelListCard = ({ novel }: { novel: ReadingListNovel }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
              {novel.cover_url ? (
                <Image
                  src={novel.cover_url}
                  alt={novel.title}
                  width={64}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link 
                  href={`/novel/${novel.slug}`}
                  className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                >
                  {novel.title}
                </Link>
                
                <Link 
                  href={`/author/${novel.author.slug}`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  by {novel.author.name}
                </Link>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFromList(novel.id)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getPriorityColor(novel.priority)}>
                {novel.priority} priority
              </Badge>
              <Badge className={getStatusColor(novel.status)}>
                {novel.status}
              </Badge>
              {novel.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-6 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Rating rating={novel.rating} size="sm" readonly />
                <span>({formatNumber(novel.rating_count)})</span>
              </div>
              <span>{formatNumber(novel.chapter_count)} chapters</span>
              <span>{formatNumber(novel.view_count)} views</span>
              <span>Added {formatDate(novel.added_to_list_at)}</span>
            </div>

            {novel.notes && (
              <p className="text-sm text-gray-600 mb-3 italic line-clamp-2">
                "{novel.notes}"
              </p>
            )}

            <div className="flex items-center justify-between">
              <Button asChild variant="outline" size="sm">
                <Link href={`/novel/${novel.slug}`}>
                  View Details
                </Link>
              </Button>

              <select
                value={novel.priority}
                onChange={(e) => handleUpdatePriority(novel.id, e.target.value as any)}
                className="text-sm px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Reading List</h1>
        <p className="text-xl text-gray-600">
          Keep track of novels you want to read
        </p>
        {novels.length > 0 && (
          <div className="mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {novels.length} novel{novels.length !== 1 ? 's' : ''} to read
            </Badge>
          </div>
        )}
      </div>

      {/* Add Novel Button */}
      <div className="flex justify-center mb-6">
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Novel to List
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <TetrisLoading size="md" speed="normal" loadingText="Loading your reading list..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && novels.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Reading List is Empty</h3>
          <p className="text-gray-600 mb-6">
            Add novels you want to read later to keep track of them
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            Add Your First Novel
          </Button>
        </div>
      )}

      {/* Reading List Content */}
      {!loading && !error && novels.length > 0 && (
        <>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search your reading list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>

                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="added_at">Recently Added</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title A-Z</option>
                    <option value="author">Author A-Z</option>
                    <option value="rating">Highest Rated</option>
                    <option value="updated_at">Recently Updated</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="hiatus">Hiatus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                      <select
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Genres</option>
                        {getAllGenres().map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPriorityFilter('all');
                          setStatusFilter('all');
                          setGenreFilter('all');
                          setSearchQuery('');
                        }}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          {filteredNovels.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">No novels match your current filters.</p>
              <Button 
                onClick={() => {
                  setPriorityFilter('all');
                  setStatusFilter('all');
                  setGenreFilter('all');
                  setSearchQuery('');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredNovels.map((novel) => 
                viewMode === 'grid' 
                  ? <NovelGridCard key={novel.id} novel={novel} />
                  : <NovelListCard key={novel.id} novel={novel} />
              )}
            </div>
          )}
        </>
      )}

      {/* Add Novel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Add Novel to Reading List
                <Button
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="p-1"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search for novels to add..."
                    value={addNovelQuery}
                    onChange={(e) => setAddNovelQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {searchLoading && (
                  <div className="text-center py-4">
                    <TetrisLoading size="sm" speed="fast" showLoadingText={false} />
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((novel) => (
                      <div key={novel.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-12 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded overflow-hidden flex-shrink-0">
                          {novel.cover_url ? (
                            <Image
                              src={novel.cover_url}
                              alt={novel.title}
                              width={48}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-1">{novel.title}</h4>
                          <p className="text-sm text-gray-600">by {novel.author.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Rating rating={novel.rating} size="sm" readonly />
                            <span className="text-xs text-gray-500">({formatNumber(novel.rating_count)})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => handleAddToList(novel.id, e.target.value as any)}
                            defaultValue=""
                          >
                            <option value="" disabled>Add Priority</option>
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {addNovelQuery && !searchLoading && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No novels found matching "{addNovelQuery}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
