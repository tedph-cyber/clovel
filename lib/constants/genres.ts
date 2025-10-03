export const GENRES = [
  {
    id: 'action',
    name: 'Action',
    description: 'Fast-paced stories with exciting adventures and combat',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Journey-focused stories with exploration and discovery',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    description: 'Humorous stories designed to entertain and amuse',
  },
  {
    id: 'drama',
    name: 'Drama',
    description: 'Serious stories with emotional depth and character development',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Stories set in magical worlds with supernatural elements',
  },
  {
    id: 'horror',
    name: 'Horror',
    description: 'Dark stories designed to frighten and create suspense',
  },
  {
    id: 'mystery',
    name: 'Mystery',
    description: 'Stories focused on solving puzzles and uncovering secrets',
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Stories centered around love and relationships',
  },
  {
    id: 'sci-fi',
    name: 'Science Fiction',
    description: 'Stories set in the future with advanced technology',
  },
  {
    id: 'slice-of-life',
    name: 'Slice of Life',
    description: 'Realistic stories about everyday experiences',
  },
  {
    id: 'supernatural',
    name: 'Supernatural',
    description: 'Stories involving paranormal or otherworldly elements',
  },
  {
    id: 'thriller',
    name: 'Thriller',
    description: 'Suspenseful stories with high stakes and tension',
  },
  {
    id: 'historical',
    name: 'Historical',
    description: 'Stories set in past time periods',
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts',
    description: 'Stories focused on combat skills and warrior culture',
  },
  {
    id: 'cultivation',
    name: 'Cultivation',
    description: 'Stories about characters gaining power through practice',
  },
  {
    id: 'system',
    name: 'System',
    description: 'Stories with game-like mechanics and progression systems',
  },
  {
    id: 'reincarnation',
    name: 'Reincarnation',
    description: 'Stories about characters being reborn in new worlds',
  },
  {
    id: 'transmigration',
    name: 'Transmigration',
    description: 'Stories about souls moving between different bodies/worlds',
  },
] as const;

export const POPULAR_GENRES = [
  'fantasy',
  'romance',
  'action',
  'cultivation',
  'system',
  'reincarnation',
] as const;

export const GENRE_COLORS = {
  action: 'bg-red-100 text-red-800',
  adventure: 'bg-green-100 text-green-800',
  comedy: 'bg-yellow-100 text-yellow-800',
  drama: 'bg-purple-100 text-purple-800',
  fantasy: 'bg-blue-100 text-blue-800',
  horror: 'bg-gray-100 text-gray-800',
  mystery: 'bg-indigo-100 text-indigo-800',
  romance: 'bg-pink-100 text-pink-800',
  'sci-fi': 'bg-cyan-100 text-cyan-800',
  'slice-of-life': 'bg-emerald-100 text-emerald-800',
  supernatural: 'bg-violet-100 text-violet-800',
  thriller: 'bg-orange-100 text-orange-800',
  historical: 'bg-amber-100 text-amber-800',
  'martial-arts': 'bg-stone-100 text-stone-800',
  cultivation: 'bg-lime-100 text-lime-800',
  system: 'bg-teal-100 text-teal-800',
  reincarnation: 'bg-rose-100 text-rose-800',
  transmigration: 'bg-fuchsia-100 text-fuchsia-800',
} as const;