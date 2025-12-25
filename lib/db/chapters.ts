import { supabase } from "../supabase/client";

// Chapter interface matching your actual schema
export interface Chapter {
  id: number;
  novel_slug: string;
  chapter_number: number;
  slug: string;
  title: string;
  content: string;
  word_count: number | null;
  url: string | null;
  scraped_at: string | null;
  created_at: string;
}

// Lightweight chapter metadata interface (without content)
export interface ChapterMetadata {
  id: number;
  novel_slug: string;
  chapter_number: number;
  slug: string;
  title: string;
  word_count: number | null;
  created_at: string;
}

/**
 * Fetch chapter metadata (without content) for a novel - optimized for lists
 * This excludes the heavy 'content' field to improve performance
 * Handles pagination to fetch all chapters beyond Supabase's 1000-row limit
 */
export async function getChaptersMetadataByNovelSlug(novelSlug: string) {
  try {
    const allChapters: ChapterMetadata[] = [];
    const batchSize = 1000;
    let offset = 0;
    let hasMore = true;

    // Fetch chapters in batches of 1000 until we get all of them
    while (hasMore) {
      const { data, error, count } = await supabase
        .from("chapters")
        .select("id, novel_slug, chapter_number, slug, title, word_count, created_at", { count: 'exact' })
        .eq("novel_slug", novelSlug)
        .order("chapter_number", { ascending: true })
        .range(offset, offset + batchSize - 1);

      if (error) {
        console.error("Error fetching chapter metadata:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Database error: ${error.message || 'Unknown error'}`);
      }

      if (data && data.length > 0) {
        allChapters.push(...(data as ChapterMetadata[]));
        offset += batchSize;
        
        // Check if we've fetched all chapters
        if (count !== null && allChapters.length >= count) {
          hasMore = false;
        } else if (data.length < batchSize) {
          // If we got less than a full batch, we're done
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Loaded ${allChapters.length} chapters for ${novelSlug}`);
    return allChapters;
  } catch (error: any) {
    console.error("Failed to fetch chapter metadata:", {
      message: error?.message || 'Unknown error',
    });
    throw error;
  }
}

/**
 * Fetch all chapters for a novel (including content) - use sparingly
 * @deprecated Use getChaptersMetadataByNovelSlug for lists instead
 */
export async function getChaptersByNovelSlug(novelSlug: string) {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("novel_slug", novelSlug)
      .order("chapter_number", { ascending: true });

    if (error) {
      console.error("Error fetching chapters:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    return (data || []) as Chapter[];
  } catch (error: any) {
    console.error("Failed to fetch chapters:", {
      message: error?.message || 'Unknown error',
    });
    throw error;
  }
}

/**
 * Fetch a single chapter by ID
 */
export async function getChapterById(id: number): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching chapter:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Chapter;
  } catch (error: any) {
    console.error("Failed to fetch chapter by ID:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}

/**
 * Fetch a chapter by novel slug and chapter slug
 */
export async function getChapterBySlug(
  novelSlug: string,
  chapterSlug: string
): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("novel_slug", novelSlug)
      .eq("slug", chapterSlug)
      .single();

    if (error) {
      console.error("Error fetching chapter:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Chapter;
  } catch (error: any) {
    console.error("Failed to fetch chapter by slug:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}

/**
 * Fetch a chapter by novel slug and chapter number
 */
export async function getChapterByNumber(
  novelSlug: string,
  chapterNumber: number
): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("novel_slug", novelSlug)
      .eq("chapter_number", chapterNumber)
      .single();

    if (error) {
      console.error("Error fetching chapter:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Chapter;
  } catch (error: any) {
    console.error("Failed to fetch chapter by number:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}

/**
 * Get the next chapter
 */
export async function getNextChapter(
  novelSlug: string,
  currentChapterNumber: number
): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("novel_slug", novelSlug)
      .gt("chapter_number", currentChapterNumber)
      .order("chapter_number", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      // No next chapter is not an error
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error("Error fetching next chapter:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Chapter;
  } catch (error: any) {
    console.error("Failed to fetch next chapter:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}

/**
 * Get the previous chapter
 */
export async function getPreviousChapter(
  novelSlug: string,
  currentChapterNumber: number
): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("novel_slug", novelSlug)
      .lt("chapter_number", currentChapterNumber)
      .order("chapter_number", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // No previous chapter is not an error
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error("Error fetching previous chapter:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Chapter;
  } catch (error: any) {
    console.error("Failed to fetch previous chapter:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}
