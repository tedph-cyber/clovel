"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Rating } from "../../../components/ui/rating";
import {
  CircleUserRound,
  BookOpen,
  Clock,
  Eye,
  Heart,
  Share2,
  User,
  Calendar,
  ChevronRight,
  Plus,
  Check,
  Book,
} from "lucide-react";
import {
  formatNumber,
  formatDate,
  formatReadingTime,
} from "@/lib/utils/formatters";
import TetrisLoading from "@/components/ui/tetris-loader";
import { getNovelBySlug, Novel } from "@/lib/db/novels";
import { getChaptersByNovelSlug, Chapter } from "@/lib/db/chapters";

export default function NovelDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);

  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch novel details and chapters separately from Supabase
        const [novelData, chaptersData] = await Promise.all([
          getNovelBySlug(slug),
          getChaptersByNovelSlug(slug)
        ]);
        
        if (!novelData) {
          setError('Novel not found');
          return;
        }

        console.log('Novel data:', novelData); // Debug log
        console.log('Chapters data:', chaptersData); // Debug log
        setNovel(novelData);
        setChapters(chaptersData || []);
      } catch (err) {
        console.error('Failed to fetch novel:', err);
        setError(err instanceof Error ? err.message : 'Failed to load novel');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNovelData();
    }
  }, [slug]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "hiatus":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBookmark = async () => {
    // Implement bookmark functionality
    setIsBookmarked(!isBookmarked);
  };

  const handleAddToReadingList = async () => {
    // Implement reading list functionality
    setIsInReadingList(!isInReadingList);
  };

  if (!novel) {
    return null;
  }

  const displayedChapters = showAllChapters ? chapters : chapters.slice(0, 10);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center md:min-h-[400px] min-h-full">
          <TetrisLoading size="md" speed="normal" loadingText="Loading novel..." />
        </div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Novel Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The novel you're looking for doesn't exist."}
          </p>
          <Link href="/search">
            <Button variant="outline">Browse Novels</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-emerald-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/search" className="hover:text-emerald-600">
          Novels
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{novel.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Novel Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden shadow-lg">
                {novel.cover_url ? (
                  <Image
                    src={novel.cover_url}
                    alt={novel.title}
                    width={192}
                    height={288}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-blue-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Novel Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {novel.title}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <CircleUserRound className="h-5 w-5" />
                  <span className="font-medium">{novel.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Rating
                    rating={novel.rating || 0}
                    size="md"
                    readonly
                    showValue
                  />
                  <span className="text-sm text-gray-500">
                    ({formatNumber(0)} reviews)
                  </span>
                </div>
                <Badge className={getStatusColor(novel.status)}>
                  {novel.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(novel.total_chapters || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Chapters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(0)}
                  </div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(0)}
                  </div>
                  <div className="text-sm text-gray-600">Bookmarks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatReadingTime(0)}
                  </div>
                  <div className="text-sm text-gray-600">Read Time</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  onClick={handleAddToReadingList}
                  className="flex items-center gap-2"
                >
                  {isInReadingList ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isInReadingList ? "In Reading List" : "Add to Reading List"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBookmark}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isBookmarked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Synopsis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {novel.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Chapters List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chapters ({novel.total_chapters || 0})</CardTitle>
                {chapters.length > 0 && (
                  <Link href={`/novel/${novel.slug}/${chapters[0].slug}`}>
                    <Button>Start Reading</Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No chapters available yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedChapters.map((chapter: Chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/novel/${novel.slug}/${chapter.slug}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {chapter.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatReadingTime(chapter.word_count || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(chapter.created_at)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                  ))}

                  {chapters.length > 10 && !showAllChapters && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAllChapters(true)}
                      className="w-full mt-4"
                    >
                      Show All {chapters.length} Chapters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Novel Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <Badge className={getStatusColor(novel.status)}>
                    {novel.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-1">
                    {novel.genres.map((genre: string) => (
                      <Link key={genre} href={`/genre/${genre.toLowerCase()}`}>
                        <Badge
                          variant="outline"
                          className="hover:bg-blue-50 cursor-pointer"
                        >
                          {genre}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Published</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(novel.created_at)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Last Updated
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(novel.last_updated || novel.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <CircleUserRound className="h-5 w-5" />
                  <div>
                    <Link href={`/author/${novel.author.toLowerCase()}`}>
                      <h3 className="font-medium text-gray-900">
                        {novel.author}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600">Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
