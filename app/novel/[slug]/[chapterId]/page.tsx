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
import TetrisLoading from "@/components/ui/tetris-loader";
import {
  getChapterBySlug,
  getNextChapter,
  getPreviousChapter,
  Chapter,
} from "@/lib/db/chapters";
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
          getNovelBySlug(novelSlug),
        ]);

        if (!chapterData) {
          setError("Chapter not found");
          return;
        }

        if (!novelData) {
          setError("Novel not found");
          return;
        }

        // Fetch prev and next chapters using novel_slug
        const [prevChapter, nextChapter] = await Promise.all([
          getPreviousChapter(
            chapterData.novel_slug,
            chapterData.chapter_number
          ),
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
          prev_chapter: prevChapter
            ? {
                id: prevChapter.id,
                title: prevChapter.title,
                slug: prevChapter.slug,
              }
            : undefined,
          next_chapter: nextChapter
            ? {
                id: nextChapter.id,
                title: nextChapter.title,
                slug: nextChapter.slug,
              }
            : undefined,
        };

        setChapter(fullChapterData);

        // Note: View tracking removed as database doesn't have views table
      } catch (err) {
        console.error("Failed to fetch chapter:", err);
        setError(err instanceof Error ? err.message : "Failed to load chapter");
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
        router.push(`/novel/${novelSlug}/${chapter.prev_chapter.slug}`);
      } else if (e.key === "ArrowRight" && chapter?.next_chapter) {
        router.push(`/novel/${novelSlug}/${chapter.next_chapter.slug}`);
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
        return "bg-[#f4ecd8] text-[#5c4b37]";
      default:
        return "bg-white text-gray-900";
    }
  };

  const getFontSizeClass = () => {
    const sizeMap = {
      sm: "text-base leading-7",
      base: "text-lg leading-8",
      lg: "text-xl leading-9",
      xl: "text-2xl leading-10",
    };
    return sizeMap[settings.fontSize];
  };

  const getFontFamilyClass = () => {
    return settings.fontFamily === "serif" ? "font-serif" : "font-sans";
  };

  const getLineHeightClass = () => {
    return settings.lineHeight === "loose"
      ? "!leading-loose"
      : "!leading-relaxed";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <TetrisLoading size="md" speed="normal" loadingText="Loading chapter..." />
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
          <div className="container mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 sm:h-10 sm:w-10">
                    <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link href={`/novel/${novelSlug}`}>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 sm:h-10 sm:w-10">
                    <List className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>

              {/* Center - Chapter info */}
              <div className="flex-1 text-center px-2 sm:px-4 min-w-0">
                <h1 className="text-xs sm:text-sm md:text-base font-medium truncate">{chapter.title}</h1>
                <p className="hidden xs:block text-xs sm:text-sm opacity-75 truncate">
                  {chapter.novel.title}
                </p>
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 sm:h-10 sm:w-10"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 sm:h-10 sm:w-10"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
            <h3 className="text-sm font-semibold mb-3 sm:mb-4 opacity-75">Reading Settings</h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-75">
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
                  className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${getThemeClasses()}`}
                >
                  <option value="sm">Small</option>
                  <option value="base">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-75">
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
                  className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${getThemeClasses()}`}
                >
                  <option value="serif">Serif (Traditional)</option>
                  <option value="sans">Sans Serif (Modern)</option>
                </select>
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-75">
                  Line Spacing
                </label>
                <select
                  value={settings.lineHeight}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lineHeight: e.target.value as any,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${getThemeClasses()}`}
                >
                  <option value="relaxed">Comfortable</option>
                  <option value="loose">Spacious</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium mb-2 opacity-75">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      theme: e.target.value as any,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${getThemeClasses()}`}
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
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Header */}
          {!isFullscreen && (
            <div className="text-center mb-12 pb-8 border-b border-current border-opacity-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{chapter.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm opacity-60">
                <span>{formatReadingTime(chapter.word_count || 0)}</span>
                <span className="hidden xs:inline">•</span>
                <span className="text-xs sm:text-sm">{formatDate(chapter.created_at)}</span>
              </div>
            </div>
          )}

          {/* Chapter Content */}
          <article className="mb-12">
            <div 
              ref={contentRef}
              className={`
                ${getFontSizeClass()} 
                ${getFontFamilyClass()} 
                ${getLineHeightClass()}
                px-3 sm:px-4 md:px-8
                py-4 sm:py-6 md:py-8
              `}
            >
              {(() => {
                // Clean up the content: remove HTML tags and excessive spacing
                let cleanedContent = chapter.content
                  // Remove HTML tags but keep the content
                  .replace(/<[^>]*>/g, '')
                  // Replace HTML entities
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  // Remove watermarks (URLs and special unicode text patterns)
                  .replace(/𝕗𝗿𝕖𝐞𝐰𝗲𝕓𝐧𝕠𝕧𝗲𝐥\.𝚌𝐨𝚖/g, '')
                  .replace(/freewebnovel\.com/gi, '')
                  .replace(/f\s*r\s*e\s*e\s*w\s*e\s*b\s*n\s*o\s*v\s*e\s*l/gi, '')
                  // Remove common website watermarks
                  .replace(/\b(?:novelupdates|wuxiaworld|webnovel)\.(?:com|net|org)\b/gi, '')
                  // Normalize line breaks
                  .replace(/\r\n/g, '\n')
                  .replace(/\r/g, '\n');
                
                // Split into paragraphs (on single or multiple newlines)
                const paragraphs = cleanedContent
                  .split(/\n+/)
                  .map(p => p.trim())
                  .filter(p => p.length > 0);
                
                return paragraphs.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="mb-4 sm:mb-5 md:mb-6 first:mt-0 last:mb-0 indent-4 sm:indent-6 md:indent-8 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ));
              })()}
            </div>
          </article>

          {/* Chapter Navigation */}
          {!isFullscreen && (
            <nav className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-6 md:pt-8 border-t border-current border-opacity-10">
              <div className="flex-1 min-w-0">
                {chapter.prev_chapter ? (
                  <Link
                    href={`/novel/${novelSlug}/${chapter.prev_chapter.slug}`}
                    className="group block p-3 sm:p-4 rounded-lg border border-current border-opacity-10 hover:border-opacity-30 transition-all active:border-opacity-40"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <ChevronLeft className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-xs opacity-60 mb-0.5 sm:mb-1">Previous Chapter</div>
                        <div className="text-sm sm:text-base font-medium truncate group-hover:text-emerald-600 transition-colors">
                          {chapter.prev_chapter.title}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 rounded-lg border border-current border-opacity-5">
                    <div className="text-sm opacity-40">No previous chapter</div>
                  </div>
                )}
              </div>

              <div className="md:px-4">
                <Link href={`/novel/${novelSlug}`}>
                  <Button variant="outline" className="w-full md:w-auto text-sm">
                    <List className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Chapter </span>List
                  </Button>
                </Link>
              </div>

              <div className="flex-1 min-w-0">
                {chapter.next_chapter ? (
                  <Link
                    href={`/novel/${novelSlug}/${chapter.next_chapter.slug}`}
                    className="group block p-4 rounded-lg border border-current border-opacity-10 hover:border-opacity-30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-xs opacity-60 mb-1">Next Chapter</div>
                        <div className="font-medium truncate group-hover:text-emerald-600 transition-colors">
                          {chapter.next_chapter.title}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 rounded-lg border border-current border-opacity-5 text-right">
                    <div className="text-sm opacity-40">No next chapter</div>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </main>

      {/* Fullscreen Mode Controls */}
      {isFullscreen && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div
            className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-lg ${getThemeClasses()}`}
          >
            {chapter.prev_chapter && (
              <Link href={`/novel/${novelSlug}/${chapter.prev_chapter.slug}`}>
                <Button variant="ghost" size="sm" className="h-10 w-10 sm:h-11 sm:w-11 p-0">
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 sm:h-11 sm:w-11 p-0"
              onClick={() => setIsFullscreen(false)}
            >
              <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {chapter.next_chapter && (
              <Link href={`/novel/${novelSlug}/${chapter.next_chapter.slug}`}>
                <Button variant="ghost" size="sm" className="h-10 w-10 sm:h-11 sm:w-11 p-0">
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
