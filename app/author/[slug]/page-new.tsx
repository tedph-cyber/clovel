"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import {
  User,
  BookOpen,
  ChevronRight,
  Home,
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils/formatters";
import { searchNovels, Novel } from "@/lib/db/novels";

export default function AuthorPage() {
  const params = useParams();
  const slug = params.slug as string;
  // Convert slug to author name (replace hyphens with spaces, capitalize)
  const authorName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorNovels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Search for novels by this author name
        const novelsData = await searchNovels(authorName, 100);
        
        // Filter to only novels by this exact author
        const filteredNovels = novelsData.filter(
          novel => novel.author.toLowerCase() === authorName.toLowerCase()
        );
        
        if (filteredNovels.length === 0) {
          setError('No novels found for this author');
          setNovels([]);
          return;
        }

        setNovels(filteredNovels);
      } catch (err) {
        console.error('Failed to fetch author novels:', err);
        setError(err instanceof Error ? err.message : 'Failed to load author novels');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAuthorNovels();
    }
  }, [slug, authorName]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading author...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || novels.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No Novels Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || `No novels found by ${authorName}`}
          </p>
          <Button asChild variant="outline">
            <Link href="/search">Browse All Novels</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-emerald-600">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/search" className="hover:text-emerald-600">
          Authors
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{authorName}</span>
      </nav>

      {/* Author Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {authorName}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {formatNumber(novels.length)} {novels.length === 1 ? 'Novel' : 'Novels'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Novels Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Novels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {novels.map((novel) => (
            <Link key={novel.id} href={`/novel/${novel.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[2/3] bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                  {novel.cover_url ? (
                    <Image
                      src={novel.cover_url}
                      alt={novel.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-gray-900">
                      {novel.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {novel.title}
                  </h3>
                  
                  {novel.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <Rating rating={novel.rating} size="sm" readonly />
                      <span className="text-sm text-gray-600">
                        {novel.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{novel.total_chapters || 0} chapters</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {novel.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
