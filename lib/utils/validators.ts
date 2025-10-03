export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUsername(username: string): boolean {
  // Username should be 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, contain at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidSlug(slug: string): boolean {
  // Slug should be lowercase, contain only letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0;
}

export function validateNovelData(novel: any): string[] {
  const errors: string[] = [];
  
  if (!novel.title || typeof novel.title !== 'string' || novel.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!novel.description || typeof novel.description !== 'string' || novel.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!novel.author || typeof novel.author !== 'string' || novel.author.trim().length === 0) {
    errors.push('Author is required');
  }
  
  if (!novel.slug || !isValidSlug(novel.slug)) {
    errors.push('Valid slug is required');
  }
  
  if (novel.rating !== undefined && (typeof novel.rating !== 'number' || novel.rating < 0 || novel.rating > 5)) {
    errors.push('Rating must be a number between 0 and 5');
  }
  
  return errors;
}

export function validateChapterData(chapter: any): string[] {
  const errors: string[] = [];
  
  if (!chapter.title || typeof chapter.title !== 'string' || chapter.title.trim().length === 0) {
    errors.push('Chapter title is required');
  }
  
  if (!chapter.content || typeof chapter.content !== 'string' || chapter.content.trim().length === 0) {
    errors.push('Chapter content is required');
  }
  
  if (!chapter.slug || !isValidSlug(chapter.slug)) {
    errors.push('Valid chapter slug is required');
  }
  
  if (chapter.chapterNumber !== undefined && (typeof chapter.chapterNumber !== 'number' || chapter.chapterNumber < 1)) {
    errors.push('Chapter number must be a positive number');
  }
  
  return errors;
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}