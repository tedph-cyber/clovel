"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import {
  User,
  BookOpen,
  Calendar,
  MapPin,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Users,
  Eye,
  Heart,
  ChevronRight,
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils/formatters";

interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
  nationality?: string;
  website?: string;
  social_links: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  total_novels: number;
  total_followers: number;
  total_views: number;
  joined_at: string;
  is_verified: boolean;
}

interface Novel {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url?: string;
  genres: string[];
  status: string;
  rating: number;
  rating_count: number;
  chapter_count: number;
  view_count: number;
  updated_at: string;
}

interface AuthorResponse {
  author: Author;
  novels: Novel[];
}

export default function AuthorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [author, setAuthor] = useState<AuthorResponse | null>(null);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "rating">(
    "newest"
  );

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch author details
        const authorResponse = await fetch(`/api/authors/${slug}`);
        if (!authorResponse.ok) {
          throw new Error(
            authorResponse.status === 404
              ? "Author not found"
              : "Failed to fetch author"
          );
        }

        const authorData = await authorResponse.json();
        setAuthor(authorData);

        // Fetch author's novels
        const novelsResponse = await fetch(
          `/api/authors/${slug}/novels?sort_by=${sortBy}`
        );
        if (novelsResponse.ok) {
          const novelsData = await novelsResponse.json();
          setNovels(novelsData || []);
        }
      } catch (err) {
        console.error("Failed to fetch author:", err);
        setError(err instanceof Error ? err.message : "Failed to load author");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAuthorData();
    }
  }, [slug, sortBy]);
  {console.log(author)}

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-emerald-100 text-emerald-800";
      case "hiatus":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFollow = async () => {
    // Implement follow functionality
    setIsFollowing(!isFollowing);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return Twitter;
      case "facebook":
        return Facebook;
      case "instagram":
        return Instagram;
      default:
        return Globe;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-full">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading author...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Author Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The author you're looking for doesn't exist."}
          </p>
          <Button asChild variant="outline">
            <Link href="/search">Browse Authors</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/authors" className="hover:text-blue-600">
          Authors
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{author.author.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Author Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-2">
                  {/* Avatar */}
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-16 w-16 text-blue-400" />
                      </div>
                    {author.author.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {author.author.name}
                    {author.author.is_verified && (
                      <span className="ml-2 text-blue-500">✓</span>
                    )}
                  </h1>

                  {author.author.nationality && (
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{author.author.nationality}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleFollow}
                    className="w-full mb-4"
                    variant={isFollowing ? "outline" : "primary"}
                  >
                    {isFollowing ? "Following" : "Follow Author"}
                  </Button>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatNumber(author.novels.length)}
                      </div>
                      <div className="text-sm text-gray-600">Novels</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">
                        {formatNumber(author.author.total_followers)}
                      </div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">
                        {formatNumber(author.author.total_views)}
                      </div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            {author.author.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {author.author.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Social Links & Info */}
            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(author.author.joined_at)}</span>
                </div>

                {author.author.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <a
                      href={author.author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Social Links */}
                {Object.entries(author.author.social_links || {}).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Social Media
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(author.author.social_links).map(
                        ([platform, url]) => {
                          const Icon = getSocialIcon(platform);
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Icon className="h-4 w-4" />
                              <span className="capitalize">{platform}</span>
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Novels List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Novels ({author.novels.length})
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {novels.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Novels Yet
                </h3>
                <p className="text-gray-600">
                  This author hasn't published any novels yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {author.novels.map((novel) => (
                <Card
                  key={novel.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Cover */}
                      <div className="flex-shrink-0 py-4">
                        <div className="w-20 h-28 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                          {novel.cover_url ? (
                            <Image
                              src={novel.cover_url}
                              alt={novel.title}
                              width={96}
                              height={120}
                              className="object-cover aspect-auto"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-blue-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Novel Info */}
                      <div className="flex-1 min-w-0 py-4">
                        <Link
                          href={`/novel/${novel.slug}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {novel.title}
                        </Link>

                        <p className="text-gray-600 mt-2 line-clamp-3">
                          {novel.description || "No description available."}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge className={getStatusColor(novel.status)}>
                            {novel.status}
                          </Badge>
                          {novel.genres.slice(0, 3).map((genre) => (
                            <Badge
                              key={genre}
                              variant="outline"
                              className="text-xs"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Rating rating={novel.rating} size="sm" readonly />
                            <span>({formatNumber(novel.rating_count)})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {formatNumber(novel.chapter_count)} chapters
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{formatNumber(novel.view_count)} views</span>
                          </div>
                          <span className="w-full sm:w-auto">Updated {formatDate(novel.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
