import { supabase } from '../supabase/client';

export interface Chapter {
  id: string;
  novel_id: string;
  title: string;
  slug: string;
  chapter_number: number;
  content: string;
  word_count: number;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChapterWithNovel extends Chapter {
  novel: {
    id: string;
    title: string;
    slug: string;
    author: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

/**
 * Fetch all chapters for a novel
 */
export async function getChaptersByNovelId(novelId: string) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('novel_id', novelId)
      .order('chapter_number', { ascending: true });

    if (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }

    return data as Chapter[];
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    throw error;
  }
}

/**
 * Fetch a single chapter by ID with novel info
 */
export async function getChapterById(chapterId: string): Promise<ChapterWithNovel | null> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        novel:novels (
          id,
          title,
          slug,
          author:authors (
            id,
            name,
            slug
          )
        )
      `)
      .eq('id', chapterId)
      .single();

    if (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }

    return data as ChapterWithNovel;
  } catch (error) {
    console.error('Failed to fetch chapter by ID:', error);
    return null;
  }
}

/**
 * Fetch a chapter by novel slug and chapter slug
 */
export async function getChapterBySlug(
  novelSlug: string,
  chapterSlug: string
): Promise<ChapterWithNovel | null> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        novel:novels!inner (
          id,
          title,
          slug,
          author:authors (
            id,
            name,
            slug
          )
        )
      `)
      .eq('novel.slug', novelSlug)
      .eq('slug', chapterSlug)
      .single();

    if (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }

    return data as ChapterWithNovel;
  } catch (error) {
    console.error('Failed to fetch chapter by slug:', error);
    return null;
  }
}

/**
 * Get next chapter
 */
export async function getNextChapter(
  novelId: string,
  currentChapterNumber: number
): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('novel_id', novelId)
      .gt('chapter_number', currentChapterNumber)
      .order('chapter_number', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching next chapter:', error);
      return null;
    }

    return data as Chapter;
  } catch (error) {
    console.error('Failed to fetch next chapter:', error);
    return null;
  }
}

/**
 * Get previous chapter
 */
export async function getPreviousChapter(
  novelId: string,
  currentChapterNumber: number
): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('novel_id', novelId)
      .lt('chapter_number', currentChapterNumber)
      .order('chapter_number', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching previous chapter:', error);
      return null;
    }

    return data as Chapter;
  } catch (error) {
    console.error('Failed to fetch previous chapter:', error);
    return null;
  }
}

/**
 * Increment chapter view count
 */
export async function incrementChapterViews(chapterId: string) {
  try {
    // Fetch current view count and increment
    const { data: chapter } = await supabase
      .from('chapters')
      .select('view_count')
      .eq('id', chapterId)
      .single();

    if (chapter) {
      const viewCount = (chapter as any).view_count;
      if (typeof viewCount === 'number') {
        await supabase
          .from('chapters')
          .update({ view_count: viewCount + 1 } as any)
          .eq('id', chapterId);
      }
    }
  } catch (error) {
    console.error('Failed to increment chapter views:', error);
  }
}

/**
 * Update reading progress
 */
export async function updateReadingProgress(
  userId: string,
  novelId: string,
  chapterId: string,
  progress: number
) {
  try {
    const { error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: userId,
        novel_id: novelId,
        chapter_id: chapterId,
        progress,
        last_read_at: new Date().toISOString(),
      } as any);

    if (error) {
      console.error('Error updating reading progress:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update reading progress:', error);
    throw error;
  }
}

/**
 * Get reading progress for a user
 */
export async function getReadingProgress(userId: string, novelId: string) {
  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('novel_id', novelId)
      .order('last_read_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching reading progress:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch reading progress:', error);
    return null;
  }
}
