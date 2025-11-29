import { supabase } from "../supabase/client";

// Novel interface matching your actual schema
export interface Novel {
  id: number;
  title: string;
  slug: string;
  author: string;  // Direct string field, not a relation
  description: string | null;
  cover_url: string | null;
  status: string;
  rating: number | null;
  total_chapters: number | null;
  genres: string[];
  scraped_at: string | null;
  created_at: string;
  last_updated: string | null;
}

export interface NovelFilters {
  genres?: string[];
  status?: string;
  minRating?: number;
  search?: string;
  sortBy?: "rating" | "total_chapters" | "last_updated" | "created_at" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Fetch all novels with optional filters
 */
export async function getNovels(filters: NovelFilters = {}) {
  try {
    let query = supabase.from("novels").select("*");

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
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    const sortBy = filters.sortBy || "last_updated";
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
      novels: (data || []) as Novel[],
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
 * Fetch a single novel by slug
 */
export async function getNovelBySlug(slug: string): Promise<Novel | null> {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching novel:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Novel;
  } catch (error: any) {
    console.error("Failed to fetch novel by slug:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}

/**
 * Fetch a single novel by ID
 */
export async function getNovelById(id: number): Promise<Novel | null> {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching novel:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    return data as Novel;
  } catch (error: any) {
    console.error("Failed to fetch novel by ID:", {
      message: error?.message || 'Unknown error',
    });
    return null;
  }
}

/**
 * Fetch novels by author name
 */
export async function getNovelsByAuthor(authorName: string, limit = 10) {
  try {
    const { data, error} = await supabase
      .from("novels")
      .select("*")
      .ilike("author", `%${authorName}%`)
      .order("last_updated", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching novels by author:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    return (data || []) as Novel[];
  } catch (error: any) {
    console.error("Failed to fetch novels by author:", {
      message: error?.message || 'Unknown error',
    });
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
      .select("*")
      .contains("genres", [genre])
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching novels by genre:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    return (data || []) as Novel[];
  } catch (error: any) {
    console.error("Failed to fetch novels by genre:", {
      message: error?.message || 'Unknown error',
    });
    throw error;
  }
}

/**
 * Search novels
 */
export async function searchNovels(searchTerm: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("novels")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error searching novels:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    return (data || []) as Novel[];
  } catch (error: any) {
    console.error("Failed to search novels:", {
      message: error?.message || 'Unknown error',
    });
    throw error;
  }
}
