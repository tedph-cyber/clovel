"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  Home,
  List,
  Bookmark,
  Eye,
  EyeOff,
} from "lucide-react";
import { useReadingProgress } from "@/lib/hooks/use-reading-progress";
import { formatDate, formatReadingTime } from "@/lib/utils/formatters";
import { getChapterBySlug, getNextChapter, getPreviousChapter, Chapter } from "@/lib/db/chapters";
import { getNovelBySlug } from "@/lib/db/novels";

interface ChapterData {
  id: number;
  title: string;
  slug: string;
  content: string;
  chapter_number: number;
  word_count: number | null;
  created_at: string;
  novel_slug: string;
  novel: {
    id: number;
    title: string;
    slug: string;
  };
  prev_chapter?: {
    id: number;
    title: string;
    slug: string;
  };
  next_chapter?: {
    id: number;
    title: string;
    slug: string;
  };
}

interface ReadingSettings {
  fontSize: "sm" | "base" | "lg" | "xl";
  fontFamily: string;
  lineHeight: "relaxed" | "loose";
  theme: "light" | "dark" | "sepia";
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const novelSlug = params.slug as string;
  const chapterId = params.chapterId as string;

  // Extract chapter number from chapterId (e.g., 'chapter-1' -> '1')
  const chapterNumber = chapterId?.replace(/^chapter-/, "") || "";

  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: "base",
    fontFamily: "serif",
    lineHeight: "relaxed",
    theme: "light",
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const { progress, updateProgress, markAsCompleted } = useReadingProgress({
    novelId: chapter?.novel?.id.toString() || novelSlug,
    novelSlug: novelSlug,
    chapterId: chapterId,
    autoSave: true,
  });

  // Load reading settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("reading-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("reading-settings", JSON.stringify(settings));
  }, [settings]);

  // Fetch chapter data from Supabase
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch chapter and novel data from Supabase
        const [chapterData, novelData] = await Promise.all([
          getChapterBySlug(novelSlug, chapterId),
          getNovelBySlug(novelSlug)
        ]);
        
        if (!chapterData) {
          setError('Chapter not found');
          return;
        }

        if (!novelData) {
          setError('Novel not found');
          return;
        }

        // Fetch prev and next chapters using novel_slug
        const [prevChapter, nextChapter] = await Promise.all([
          getPreviousChapter(chapterData.novel_slug, chapterData.chapter_number),
          getNextChapter(chapterData.novel_slug, chapterData.chapter_number),
        ]);

        // Combine data
        const fullChapterData: ChapterData = {
          ...chapterData,
          novel: {
            id: novelData.id,
            title: novelData.title,
            slug: novelData.slug,
          },
          prev_chapter: prevChapter ? {
            id: prevChapter.id,
            title: prevChapter.title,
            slug: prevChapter.slug,
          } : undefined,
          next_chapter: nextChapter ? {
            id: nextChapter.id,
            title: nextChapter.title,
            slug: nextChapter.slug,
          } : undefined,
        };

        setChapter(fullChapterData);

        // Note: View tracking removed as database doesn't have views table
      } catch (err) {
        console.error('Failed to fetch chapter:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };

    if (novelSlug && chapterId) {
      fetchChapter();
    }
  }, [novelSlug, chapterId]);

  // Handle scroll for reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const contentTop = contentRef.current.offsetTop;
      const contentHeight = contentRef.current.offsetHeight;

      if (scrollTop >= contentTop) {
        const readHeight = Math.min(
          scrollTop + clientHeight - contentTop,
          contentHeight
        );
        const progressPercent = Math.round((readHeight / contentHeight) * 100);
        updateProgress(progressPercent);

        // Mark as completed if reached the end
        if (progressPercent >= 95) {
          markAsCompleted();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateProgress, markAsCompleted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && chapter?.prev_chapter) {
        router.push(
          `/novel/${novelSlug}/${chapter.prev_chapter.slug}`
        );
      } else if (e.key === "ArrowRight" && chapter?.next_chapter) {
        router.push(
          `/novel/${novelSlug}/${chapter.next_chapter.slug}`
        );
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [chapter, novelSlug, router, isFullscreen]);

  const getThemeClasses = () => {
    switch (settings.theme) {
      case "dark":
        return "bg-gray-900 text-gray-100";
      case "sepia":
        return "bg-amber-50 text-amber-900";
      default:
        return "bg-white text-gray-900";
    }
  };

  const getFontSizeClass = () => {
    const sizeMap = {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    };
    return sizeMap[settings.fontSize];
  };

  const getFontFamilyClass = () => {
    return settings.fontFamily === "serif" ? "font-serif" : "font-sans";
  };

  const getLineHeightClass = () => {
    return settings.lineHeight === "loose"
      ? "leading-loose"
      : "leading-relaxed";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Chapter Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The chapter you're looking for doesn't exist."}
          </p>
          <Button asChild variant="outline">
            <Link href={`/novel/${novelSlug}`}>Back to Novel</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-200 ${getThemeClasses()}`}
    >
      {/* Fixed Header */}
      {!isFullscreen && (
        <header
          className={`sticky top-0 z-10 border-b transition-all duration-200 ${getThemeClasses()}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/novel/${novelSlug}`}>
                    <List className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Center - Chapter info */}
              <div className="flex-1 text-center px-4">
                <h1 className="font-medium truncate">
                 {chapter.title}
                </h1>
                <p className="text-sm opacity-75 truncate">
                  {chapter.novel.title}
                </p>
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-orange-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>
      )}

      {/* Reading Settings Panel */}
      {showSettings && !isFullscreen && (
        <div
          className={`border-b transition-all duration-200 ${getThemeClasses()}`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      fontSize: e.target.value as any,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md ${getThemeClasses()}`}
                >
                  <option value="sm">Small</option>
                  <option value="base">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      fontFamily: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md ${getThemeClasses()}`}
                >
                  <option value="serif">Serif</option>
                  <option value="sans">Sans Serif</option>
                </select>
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Line Height
                </label>
                <select
                  value={settings.lineHeight}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lineHeight: e.target.value as any,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md ${getThemeClasses()}`}
                >
                  <option value="relaxed">Relaxed</option>
                  <option value="loose">Loose</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      theme: e.target.value as any,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md ${getThemeClasses()}`}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="sepia">Sepia</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Header */}
          {!isFullscreen && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
               {chapter.title}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm opacity-75">
                <span>{formatReadingTime(chapter.word_count || 0)}</span>
                <span>•</span>
                <span>{formatDate(chapter.created_at)}</span>
              </div>
            </div>
          )}

          {/* Chapter Content */}
          <Card className={`${getThemeClasses()} border-0 shadow-none`}>
            <CardContent
              ref={contentRef}
              className={`prose prose-lg max-w-none ${getFontSizeClass()} ${getFontFamilyClass()} ${getLineHeightClass()}`}
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </Card>

          {/* Chapter Navigation */}
          {!isFullscreen && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t">
              <div className="flex-1">
                {chapter.prev_chapter ? (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/novel/${novelSlug}/${chapter.prev_chapter.slug}`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="text-xs opacity-75">
                          Previous Chapter
                        </div>
                        <div className="truncate max-w-48">
                          {chapter.prev_chapter.title}
                        </div>
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
              </div>

              <div className="px-4">
                <Button variant="outline" asChild>
                  <Link href={`/novel/${novelSlug}`}>
                    <List className="h-4 w-4 mr-2" />
                    Chapter List
                  </Link>
                </Button>
              </div>

              <div className="flex-1 flex justify-end">
                {chapter.next_chapter ? (
                  <Button asChild>
                    <Link
                      href={`/novel/${novelSlug}/${chapter.next_chapter.slug}`}
                    >
                      <div className="text-right">
                        <div className="text-xs opacity-75">Next Chapter</div>
                        <div className="truncate max-w-48">
                          {chapter.next_chapter.title}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fullscreen Mode Controls */}
      {isFullscreen && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg ${getThemeClasses()}`}
          >
            {chapter.prev_chapter && (
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/novel/${novelSlug}/${chapter.prev_chapter.slug}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>

            {chapter.next_chapter && (
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/novel/${novelSlug}/${chapter.next_chapter.slug}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
