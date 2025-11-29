-- =====================================================
-- Clovel Database Schema Setup
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =====================================================

-- Drop existing tables if they exist (CAREFUL: This deletes data!)
-- Uncomment these lines only if you want to start fresh
-- DROP TABLE IF EXISTS reading_progress CASCADE;
-- DROP TABLE IF EXISTS bookmarks CASCADE;
-- DROP TABLE IF EXISTS chapters CASCADE;
-- DROP TABLE IF EXISTS novels CASCADE;
-- DROP TABLE IF EXISTS authors CASCADE;

-- =====================================================
-- 1. AUTHORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);
CREATE INDEX IF NOT EXISTS idx_authors_created_at ON authors(created_at DESC);

-- =====================================================
-- 2. NOVELS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS novels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_url TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus', 'dropped')),
  rating DECIMAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0,
  chapter_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  genres TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_novels_slug ON novels(slug);
CREATE INDEX IF NOT EXISTS idx_novels_author_id ON novels(author_id);
CREATE INDEX IF NOT EXISTS idx_novels_status ON novels(status);
CREATE INDEX IF NOT EXISTS idx_novels_rating ON novels(rating DESC);
CREATE INDEX IF NOT EXISTS idx_novels_view_count ON novels(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_novels_updated_at ON novels(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_novels_genres ON novels USING gin(genres);

-- =====================================================
-- 3. CHAPTERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(novel_id, chapter_number),
  UNIQUE(novel_id, slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chapters_novel_id ON chapters(novel_id);
CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number ON chapters(novel_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapters_slug ON chapters(novel_id, slug);
CREATE INDEX IF NOT EXISTS idx_chapters_published_at ON chapters(published_at DESC);

-- =====================================================
-- 4. READING PROGRESS TABLE (Optional)
-- =====================================================
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  progress DECIMAL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON reading_progress(chapter_id);

-- =====================================================
-- 5. BOOKMARKS TABLE (Optional)
-- =====================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_novel_id ON bookmarks(novel_id);

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES FOR PUBLIC READ ACCESS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on authors" ON authors;
DROP POLICY IF EXISTS "Allow public read access on novels" ON novels;
DROP POLICY IF EXISTS "Allow public read access on chapters" ON chapters;

-- Authors: Allow public read
CREATE POLICY "Allow public read access on authors"
  ON authors
  FOR SELECT
  USING (true);

-- Novels: Allow public read
CREATE POLICY "Allow public read access on novels"
  ON novels
  FOR SELECT
  USING (true);

-- Chapters: Allow public read
CREATE POLICY "Allow public read access on chapters"
  ON chapters
  FOR SELECT
  USING (true);

-- Reading Progress: Users can manage their own progress
CREATE POLICY "Users can view their own reading progress"
  ON reading_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress"
  ON reading_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress"
  ON reading_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Bookmarks: Users can manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 8. CREATE TRIGGER FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_novels_updated_at ON novels;
CREATE TRIGGER update_novels_updated_at
  BEFORE UPDATE ON novels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. INSERT SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Authors
INSERT INTO authors (name, slug, bio) VALUES
  ('Sarah Chen', 'sarah-chen', 'Award-winning fantasy author known for intricate world-building and character development.'),
  ('Marcus Rivera', 'marcus-rivera', 'Bestselling romance novelist with a flair for contemporary love stories.'),
  ('Dr. Emma Watson', 'emma-watson', 'Science fiction writer specializing in hard sci-fi and space opera.')
ON CONFLICT (slug) DO NOTHING;

-- Sample Novels (Get author IDs first)
DO $$
DECLARE
  sarah_id UUID;
  marcus_id UUID;
  emma_id UUID;
BEGIN
  -- Get author IDs
  SELECT id INTO sarah_id FROM authors WHERE slug = 'sarah-chen';
  SELECT id INTO marcus_id FROM authors WHERE slug = 'marcus-rivera';
  SELECT id INTO emma_id FROM authors WHERE slug = 'emma-watson';

  -- Insert novels
  INSERT INTO novels (title, slug, description, author_id, genres, rating, rating_count, chapter_count, status, cover_url) VALUES
    (
      'Chronicles of the Eternal Realm',
      'chronicles-eternal-realm',
      'In a world where magic and technology coexist, a young mage must uncover ancient secrets to save her kingdom from destruction. An epic fantasy adventure spanning multiple realms and dimensions.',
      sarah_id,
      ARRAY['Fantasy', 'Adventure', 'Magic'],
      4.7,
      1247,
      156,
      'ongoing',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
    ),
    (
      'Love in the Digital Age',
      'love-digital-age',
      'When a tech entrepreneur meets a free-spirited artist through a dating app, they discover that finding love in the modern world is both easier and harder than they ever imagined.',
      marcus_id,
      ARRAY['Romance', 'Contemporary', 'Drama'],
      4.5,
      892,
      78,
      'completed',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'
    ),
    (
      'Starship Prometheus',
      'starship-prometheus',
      'Humanity''s first interstellar colony ship encounters an alien signal that challenges everything we know about the universe. A gripping hard sci-fi thriller.',
      emma_id,
      ARRAY['Science Fiction', 'Space Opera', 'Thriller'],
      4.8,
      2134,
      203,
      'ongoing',
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400'
    ),
    (
      'The Midnight Garden',
      'midnight-garden',
      'A mysterious garden that only appears at midnight holds the key to breaking an ancient curse. A enchanting tale of magic, mystery, and romance.',
      sarah_id,
      ARRAY['Fantasy', 'Romance', 'Mystery'],
      4.6,
      756,
      45,
      'completed',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400'
    );

  -- Insert sample chapters for first novel
  INSERT INTO chapters (novel_id, title, slug, chapter_number, content, word_count) VALUES
    (
      (SELECT id FROM novels WHERE slug = 'chronicles-eternal-realm'),
      'Chapter 1: The Awakening',
      'chapter-1',
      1,
      'The morning sun cast long shadows across the Academy grounds as Lyra stood before the ancient portal. She had trained for this moment her entire life, yet now that it had arrived, doubt crept into her mind like morning mist...',
      2847
    ),
    (
      (SELECT id FROM novels WHERE slug = 'chronicles-eternal-realm'),
      'Chapter 2: Through the Portal',
      'chapter-2',
      2,
      'The portal''s surface rippled like water, reflecting colors that had no name in any language Lyra knew. She took a deep breath and stepped forward, feeling reality bend around her...',
      3102
    ),
    (
      (SELECT id FROM novels WHERE slug = 'chronicles-eternal-realm'),
      'Chapter 3: The Other Side',
      'chapter-3',
      3,
      'Lyra emerged in a world where the sky burned with two suns and gravity felt different. This was the Eternal Realm, and nothing in her training had prepared her for its beauty and danger...',
      2956
    );

  -- Insert chapters for romance novel
  INSERT INTO chapters (novel_id, title, slug, chapter_number, content, word_count) VALUES
    (
      (SELECT id FROM novels WHERE slug = 'love-digital-age'),
      'Chapter 1: Swipe Right',
      'chapter-1',
      1,
      'Emma had given up on dating apps. Or so she told herself as she scrolled through profiles at 2 AM, a glass of wine in hand. Then she saw his profile - Alex, 32, software engineer with a smile that seemed genuine...',
      2134
    ),
    (
      (SELECT id FROM novels WHERE slug = 'love-digital-age'),
      'Chapter 2: First Message',
      'chapter-2',
      2,
      'The notification chimed just as Emma was about to delete the app. "Hi! I noticed you like vintage bookstores. There''s this amazing one downtown..." It was Alex, and suddenly, deleting the app could wait...',
      2567
    );

END $$;

-- =====================================================
-- 10. VERIFY SETUP
-- =====================================================

-- Check table counts
SELECT 
  'authors' as table_name, 
  COUNT(*) as row_count 
FROM authors
UNION ALL
SELECT 
  'novels' as table_name, 
  COUNT(*) as row_count 
FROM novels
UNION ALL
SELECT 
  'chapters' as table_name, 
  COUNT(*) as row_count 
FROM chapters;

-- =====================================================
-- Setup Complete! 🎉
-- =====================================================
-- Your database is now ready to use with the Clovel app
-- Visit http://localhost:3001/diagnostics to verify connection
-- =====================================================
