'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { Pagination } from '@/components/ui/pagination';
import { 
  BookOpen, 
  ChevronRight, 
  Filter,
  SortAsc,
  Grid,
  List as ListIcon
} from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils/formatters';
import { GENRES } from '@/lib/constants/genres';

interface Novel {
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
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function GenrePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const genreSlug = params.slug as string;
  
  const [novels, setNovels] = useState<Novel[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'updated_at');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [minRating, setMinRating] = useState(Number(searchParams.get('min_rating')) || 0);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get genre info
  const genreInfo = GENRES.find(g => g.id === genreSlug);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          genre: genreSlug,
          page: currentPage.toString(),
          limit: '20',
          sort_by: sortBy,
          ...(status && { status }),
          ...(minRating > 0 && { min_rating: minRating.toString() })
        });

        const response = await fetch(`/api/novels?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch novels');
        }

        const data = await response.json();
        if (data.success) {
          setNovels(data.data || []);
          setPagination(data.pagination || pagination);
        }
      } catch (err) {
        console.error('Failed to fetch novels:', err);
        setError(err instanceof Error ? err.message : 'Failed to load novels');
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, [genreSlug, currentPage, sortBy, status, minRating]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-emerald-100 text-emerald-800';
      case 'hiatus': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const NovelGridCard = ({ novel }: { novel: Novel }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="aspect-[2/3] bg-gradient-to-br from-emerald-50 to-orange-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
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
              <BookOpen className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
              <span className="text-xs text-gray-500 font-medium line-clamp-2">{novel.title}</span>
            </div>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-lg">
          <Link 
            href={`/novel/${novel.slug}`}
            className="hover:text-emerald-600 transition-colors"
          >
            {novel.title}
          </Link>
        </CardTitle>
        <Link 
          href={`/author/${novel.author.slug}`}
          className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          by {novel.author.name}
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {novel.description || 'No description available.'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className={getStatusColor(novel.status)}>
            {novel.status}
          </Badge>
          {novel.genres.filter(g => g !== genreSlug).slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
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
          
          <p className="text-xs text-gray-500">
            Updated {formatDate(novel.updated_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const NovelListCard = ({ novel }: { novel: Novel }) => (
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

            <p className="text-gray-600 mt-2 line-clamp-2">
              {novel.description || 'No description available.'}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={getStatusColor(novel.status)}>
                {novel.status}
              </Badge>
              {novel.genres.filter(g => g !== genreSlug).slice(0, 3).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Rating rating={novel.rating} size="sm" readonly />
                <span>({formatNumber(novel.rating_count)})</span>
              </div>
              <span>{formatNumber(novel.chapter_count)} chapters</span>
              <span>{formatNumber(novel.view_count)} views</span>
              <span>Updated {formatDate(novel.updated_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!genreInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Genre Not Found</h2>
          <p className="text-gray-600 mb-4">The genre you're looking for doesn't exist.</p>
          <Button asChild variant="outline">
            <Link href="/search">Browse Novels</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/genres" className="hover:text-blue-600">Genres</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{genreInfo.name}</span>
      </nav>

      {/* Genre Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{genreInfo.name} Novels</h1>
        {genreInfo.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {genreInfo.description}
          </p>
        )}
        <div className="mt-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {formatNumber(pagination.total)} novels available
          </Badge>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
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
              <option value="updated_at">Recently Updated</option>
              <option value="rating">Highest Rated</option>
              <option value="view_count">Most Popular</option>
              <option value="created_at">Newest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="hiatus">Hiatus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus('');
                    setMinRating(0);
                    setSortBy('updated_at');
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading novels...</p>
          </div>
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

      {/* Novels Grid/List */}
      {!loading && !error && (
        <>
          {novels.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Novels Found</h3>
              <p className="text-gray-600 mb-4">No novels match your current filters.</p>
              <Button 
                onClick={() => {
                  setStatus('');
                  setMinRating(0);
                  setSortBy('updated_at');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {novels.map((novel) => 
                  viewMode === 'grid' 
                    ? <NovelGridCard key={novel.id} novel={novel} />
                    : <NovelListCard key={novel.id} novel={novel} />
                )}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex justify-center mt-12">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
