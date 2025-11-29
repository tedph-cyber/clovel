export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      novels: {
        Row: {
          id: number;
          title: string;
          slug: string;
          author: string;
          description: string | null;
          cover_url: string | null;
          status: string;
          rating: number | null;
          total_chapters: number | null;
          genres: string[];
          scraped_at: string | null;
          created_at: string;
          last_updated: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          author: string;
          description?: string | null;
          cover_url?: string | null;
          status?: string;
          rating?: number | null;
          total_chapters?: number | null;
          genres?: string[];
          scraped_at?: string | null;
          created_at?: string;
          last_updated?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          slug?: string;
          author?: string;
          description?: string | null;
          cover_url?: string | null;
          status?: string;
          rating?: number | null;
          total_chapters?: number | null;
          genres?: string[];
          scraped_at?: string | null;
          created_at?: string;
          last_updated?: string | null;
        };
      };
      chapters: {
        Row: {
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
        };
        Insert: {
          id?: number;
          novel_slug: string;
          chapter_number: number;
          slug: string;
          title: string;
          content: string;
          word_count?: number | null;
          url?: string | null;
          scraped_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          novel_slug?: string;
          chapter_number?: number;
          slug?: string;
          title?: string;
          content?: string;
          word_count?: number | null;
          url?: string | null;
          scraped_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
