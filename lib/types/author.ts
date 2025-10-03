import { NovelSummary } from './novel';

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  nationality?: string;
  website?: string;
  socialLinks: SocialLink[];
  totalNovels: number;
  totalFollowers: number;
  joinedAt: string;
  isVerified: boolean;
}

export interface AuthorSummary {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  totalNovels: number;
  isVerified: boolean;
}

export interface AuthorDetail extends Author {
  novels: NovelSummary[];
  recentActivity: AuthorActivity[];
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

export interface AuthorActivity {
  id: string;
  type: 'novel_published' | 'chapter_published' | 'novel_updated';
  title: string;
  description: string;
  relatedNovelId?: string;
  relatedChapterId?: string;
  timestamp: string;
}