export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const READING_THEMES = {
  DEFAULT: {
    name: 'Default',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    className: 'bg-white text-gray-800',
  },
  SEPIA: {
    name: 'Sepia',
    backgroundColor: '#f7f3e3',
    textColor: '#5d4e37',
    className: 'bg-amber-50 text-amber-900',
  },
  DARK: {
    name: 'Dark',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    className: 'bg-gray-800 text-gray-100',
  },
  BLACK: {
    name: 'Black',
    backgroundColor: '#000000',
    textColor: '#e5e7eb',
    className: 'bg-black text-gray-200',
  },
} as const;

export const FONT_FAMILIES = {
  SYSTEM: {
    name: 'System',
    value: 'system-ui, -apple-system, sans-serif',
  },
  GEORGIA: {
    name: 'Georgia',
    value: 'Georgia, serif',
  },
  'TIMES_NEW_ROMAN': {
    name: 'Times New Roman',
    value: '"Times New Roman", serif',
  },
  ARIAL: {
    name: 'Arial',
    value: 'Arial, sans-serif',
  },
  HELVETICA: {
    name: 'Helvetica',
    value: 'Helvetica, sans-serif',
  },
  VERDANA: {
    name: 'Verdana',
    value: 'Verdana, sans-serif',
  },
} as const;

export const FONT_SIZES = {
  SMALL: {
    name: 'Small',
    value: '14px',
    className: 'text-sm',
  },
  MEDIUM: {
    name: 'Medium',
    value: '16px',
    className: 'text-base',
  },
  LARGE: {
    name: 'Large',
    value: '18px',
    className: 'text-lg',
  },
  EXTRA_LARGE: {
    name: 'Extra Large',
    value: '20px',
    className: 'text-xl',
  },
} as const;

export const LINE_HEIGHTS = {
  TIGHT: {
    name: 'Tight',
    value: 1.4,
    className: 'leading-tight',
  },
  NORMAL: {
    name: 'Normal',
    value: 1.6,
    className: 'leading-normal',
  },
  RELAXED: {
    name: 'Relaxed',
    value: 1.8,
    className: 'leading-relaxed',
  },
  LOOSE: {
    name: 'Loose',
    value: 2.0,
    className: 'leading-loose',
  },
} as const;

export const DEFAULT_READING_PREFERENCES = {
  theme: READING_THEMES.DEFAULT,
  fontFamily: FONT_FAMILIES.SYSTEM,
  fontSize: FONT_SIZES.MEDIUM,
  lineHeight: LINE_HEIGHTS.NORMAL,
  autoBookmark: true,
  autoScroll: false,
  scrollSpeed: 50,
} as const;