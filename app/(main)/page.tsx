'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { BookOpen, TrendingUp, Clock, Star } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils/formatters';
import { getNovels, Novel } from '@/lib/db/novels';

export default function HomePage() {
  const [featuredNovels, setFeaturedNovels] = useState<Novel[]>([]);
  const [popularNovels, setPopularNovels] = useState<Novel[]>([]);
  const [recentNovels, setRecentNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalNovels: 0,
    totalReaders: 50000,
    totalAuthors: 1000
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured novels (high rated)
        const featuredData = await getNovels({
          sortBy: 'rating',
          sortOrder: 'desc',
          minRating: 4.0,
          limit: 6,
        });
        
        if (featuredData.novels) {
          setFeaturedNovels(featuredData.novels);
          setStats(prev => ({ ...prev, totalNovels: featuredData.total }));
        }

        // Fetch popular novels (by rating)
        const popularData = await getNovels({
          sortBy: 'rating',
          sortOrder: 'desc',
          limit: 4,
        });
        
        if (popularData.novels) {
          setPopularNovels(popularData.novels);
        }

        // Fetch recently updated novels
        const recentData = await getNovels({
          sortBy: 'last_updated',
          sortOrder: 'desc',
          limit: 4,
        });
        
        if (recentData.novels) {
          setRecentNovels(recentData.novels);
        }

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load novels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'hiatus': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const NovelCard = ({ novel, showStats = false }: { novel: Novel; showStats?: boolean }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
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
        <CardTitle className="line-clamp-2 text-lg">
          <Link 
            href={`/novel/${novel.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {novel.title}
          </Link>
        </CardTitle>
        <div className="text-sm text-gray-600">
          by {novel.author}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {novel.description || 'No description available.'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="secondary" className={getStatusColor(novel.status)}>
            {novel.status}
          </Badge>
          {novel.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          {novel.rating && (
            <div className="flex items-center gap-2">
              <Rating rating={novel.rating} size="sm" readonly showValue />
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {formatNumber(novel.total_chapters || 0)} chapters
            </span>
          </div>
          
          {novel.last_updated && (
            <p className="text-xs text-gray-500">
              Updated {formatDate(novel.last_updated)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading novels...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-emerald-600"> Favorite Novel</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Dive into captivating stories from talented authors around the world. 
            Join our community of passionate readers and discover your next obsession.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-orange-400 hover:from-emerald-600 hover:to-orange-500 text-white" asChild>
              <Link href="/search">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Novels
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/search?sort_by=rating">
                <Star className="mr-2 h-5 w-5" />
                Top Rated
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-orange-50 rounded-xl p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {formatNumber(stats.totalNovels)}+
            </div>
            <div className="text-gray-700 font-medium">Novels Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {formatNumber(stats.totalReaders)}+
            </div>
            <div className="text-gray-700 font-medium">Active Readers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {formatNumber(stats.totalAuthors)}+
            </div>
            <div className="text-gray-700 font-medium">Authors</div>
          </div>
        </div>
      </section>

      {/* Featured Novels */}
      {featuredNovels.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Novels</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search?sort_by=rating&min_rating=4.0">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Novels */}
      {popularNovels.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search?sort_by=view_count">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} showStats />
            ))}
          </div>
        </section>
      )}

      {/* Recently Updated */}
      {recentNovels.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-green-500" />
              <h2 className="text-3xl font-bold text-gray-900">Recently Updated</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search?sort_by=updated_at">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-gray-900 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Reading?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Join thousands of readers who have already discovered their next favorite story. 
          Start your reading journey today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Create Account
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/search" className="border-white text-white hover:bg-white hover:text-gray-900">
              Browse Without Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
