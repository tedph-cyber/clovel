import { supabase } from "../supabase/client";

export interface NovelWithAuthor {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  status: string;
  rating: number;
  rating_count: number;
  chapter_count: number;
  word_count: number;
  view_count: number;
  bookmark_count: number;
  genres: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
  };
}

// Helper function to normalize author data (Supabase returns it as single object sometimes)
function normalizeNovelData(data: any): NovelWithAuthor {
  return {
    ...data,
    author: Array.isArray(data.author) ? data.author[0] : data.author,
  };
}

export interface NovelWithChapters extends NovelWithAuthor {
  chapters: {
    id: string;
    title: string;
    slug: string;
    chapter_number: number;
    word_count: number;
    published_at: string;
  }[];
}

export interface NovelFilters {
  genres?: string[];
  status?: string;
  minRating?: number;
  search?: string;
  sortBy?: "rating" | "view_count" | "updated_at" | "created_at" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Fetch all novels with optional filters
 */
export async function getNovels(filters: NovelFilters = {}) {
  try {
    let query = supabase.from("novels").select(`
        id,
        title,
        slug,
        description,
        cover_url,
        status,
        rating,
        rating_count,
        chapter_count,
        word_count,
        view_count,
        bookmark_count,
        genres,
        tags,
        created_at,
        updated_at,
        author:authors (
          id,
          name,
          slug,
          avatar_url
        )
      `);

    // Apply filters
    if (filters.genres && filters.genres.length > 0) {
      query = query.contains("genres", filters.genres);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.minRating) {
      query = query.gte("rating", filters.minRating);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    const sortBy = filters.sortBy || "updated_at";
    const sortOrder = filters.sortOrder || "desc";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching novels:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    return {
      novels: (data || []).map(normalizeNovelData),
      total: count || data?.length || 0,
    };
  } catch (error: any) {
    console.error("Failed to fetch novels:", {
      message: error?.message || 'Unknown error',
      name: error?.name,
      stack: error?.stack,
    });
    throw error;
  }
}

/**
 * Fetch a single novel by slug with chapters
 */
export async function getNovelBySlug(
  slug: string
): Promise<NovelWithChapters | null> {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select(
        `
        id,
        title,
        slug,
        description,
        cover_url,
        status,
        rating,
        rating_count,
        chapter_count,
        word_count,
        view_count,
        bookmark_count,
        genres,
        tags,
        created_at,
        updated_at,
        author:authors (
          id,
          name,
          slug,
          avatar_url
        ),
        chapters (
          id,
          title,
          slug,
          chapter_number,
          word_count,
          published_at
        )
      `
      )
      .eq("slug", slug)
      .order("chapter_number", { foreignTable: "chapters", ascending: true })
      .single();

    if (error) {
      console.error("Error fetching novel:", error);
      return null;
    }

    return data as NovelWithChapters;
  } catch (error) {
    console.error("Failed to fetch novel by slug:", error);
    return null;
  }
}

/**
 * Fetch a single novel by ID
 */
export async function getNovelById(
  id: string
): Promise<NovelWithAuthor | null> {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select(
        `
        id,
        title,
        slug,
        description,
        cover_url,
        status,
        rating,
        rating_count,
        chapter_count,
        word_count,
        view_count,
        bookmark_count,
        genres,
        tags,
        created_at,
        updated_at,
        author:authors (
          id,
          name,
          slug,
          avatar_url
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching novel:", error);
      return null;
    }

    return normalizeNovelData(data);
  } catch (error) {
    console.error("Failed to fetch novel by ID:", error);
    return null;
  }
}

/**
 * Fetch novels by author slug
 */
export async function getNovelsByAuthor(authorSlug: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select(
        `
        id,
        title,
        slug,
        description,
        cover_url,
        status,
        rating,
        rating_count,
        chapter_count,
        word_count,
        view_count,
        bookmark_count,
        genres,
        tags,
        created_at,
        updated_at,
        author:authors!inner (
          id,
          name,
          slug,
          avatar_url
        )
      `
      )
      .eq("author.slug", authorSlug)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching novels by author:", error);
      throw error;
    }

    return (data || []).map(normalizeNovelData);
  } catch (error) {
    console.error("Failed to fetch novels by author:", error);
    throw error;
  }
}

/**
 * Fetch novels by genre
 */
export async function getNovelsByGenre(genre: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select(
        `
        id,
        title,
        slug,
        description,
        cover_url,
        status,
        rating,
        rating_count,
        chapter_count,
        word_count,
        view_count,
        bookmark_count,
        genres,
        tags,
        created_at,
        updated_at,
        author:authors (
          id,
          name,
          slug,
          avatar_url
        )
      `
      )
      .contains("genres", [genre])
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching novels by genre:", error);
      throw error;
    }

    return (data || []).map(normalizeNovelData);
  } catch (error) {
    console.error("Failed to fetch novels by genre:", error);
    throw error;
  }
}

/**
 * Increment novel view count
 */
export async function incrementNovelViews(novelId: string) {
  try {
    // Fetch current view count and increment
    const { data: novel } = await supabase
      .from("novels")
      .select("view_count")
      .eq("id", novelId)
      .single();

    if (novel) {
      const viewCount = (novel as any).view_count;
      if (typeof viewCount === "number") {
        await supabase
          .from("novels")
          .update({ view_count: viewCount + 1 } as any)
          .eq("id", novelId);
      }
    }
  } catch (error) {
    console.error("Failed to increment novel views:", error);
  }
}

/**
 * Search novels
 */
export async function searchNovels(searchTerm: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select(
        `
        id,
        title,
        slug,
        description,
        cover_url,
        status,
        rating,
        rating_count,
        chapter_count,
        word_count,
        view_count,
        bookmark_count,
        genres,
        tags,
        created_at,
        updated_at,
        author:authors (
          id,
          name,
          slug,
          avatar_url
        )
      `
      )
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error searching novels:", error);
      throw error;
    }

    return (data || []).map(normalizeNovelData);
  } catch (error) {
    console.error("Failed to search novels:", error);
    throw error;
  }
}
