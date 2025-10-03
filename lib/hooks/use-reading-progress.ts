import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';
import { chapterApi } from '../api/chapters';
import type { ReadingProgress } from '../types';

interface UseReadingProgressOptions {
  novelId: string;
  novelSlug: string;
  chapterId: string;
  autoSave?: boolean;
  saveInterval?: number; // in milliseconds
}

export function useReadingProgress({
  novelId,
  novelSlug,
  chapterId,
  autoSave = true,
  saveInterval = 5000
}: UseReadingProgressOptions) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<number>(0);
  
  // Local storage for offline progress tracking
  const [localProgress, setLocalProgress] = useLocalStorage(
    `reading-progress-${novelId}-${chapterId}`,
    0
  );

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      // Don't load if we don't have valid IDs
      if (!novelId || !chapterId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const remoteProgress = await chapterApi.getProgress(novelSlug, chapterId);
        
        if (remoteProgress) {
          setProgress(remoteProgress.progress);
          setLocalProgress(remoteProgress.progress);
        } else {
          // Use local progress if no remote progress found
          setProgress(localProgress);
        }
      } catch (err) {
        setError('Failed to load reading progress');
        setProgress(localProgress); // Fallback to local storage
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [chapterId, localProgress, setLocalProgress]);

  // Auto-save progress
  useEffect(() => {
    if (!autoSave || progress === lastSaved) return;

    const saveTimer = setTimeout(async () => {
      try {
        await chapterApi.updateProgress(novelSlug, chapterId, progress);
        setLastSaved(progress);
        setLocalProgress(progress);
      } catch (err) {
        console.error('Failed to save reading progress:', err);
        // Still save locally even if remote save fails
        setLocalProgress(progress);
      }
    }, saveInterval);

    return () => clearTimeout(saveTimer);
  }, [progress, lastSaved, chapterId, autoSave, saveInterval, setLocalProgress]);

  // Update progress
  const updateProgress = useCallback((newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, newProgress));
    setProgress(clampedProgress);
    setLocalProgress(clampedProgress);
  }, [setLocalProgress]);

  // Save progress immediately
  const saveProgress = useCallback(async () => {
    // Don't save if we don't have valid IDs
    if (!novelId || !chapterId) {
      return false;
    }

    try {
      await chapterApi.updateProgress(novelSlug, chapterId, progress);
      setLastSaved(progress);
      setLocalProgress(progress);
      return true;
    } catch (err) {
      setError('Failed to save reading progress');
      return false;
    }
  }, [novelId, novelSlug, chapterId, progress, setLocalProgress]);

  // Mark chapter as completed
  const markAsCompleted = useCallback(async () => {
    updateProgress(100);
    return saveProgress();
  }, [updateProgress, saveProgress]);

  // Reset progress
  const resetProgress = useCallback(() => {
    updateProgress(0);
  }, [updateProgress]);

  // Calculate reading time based on progress and word count
  const calculateReadingTime = useCallback((wordCount: number) => {
    const wordsPerMinute = 200;
    const totalMinutes = wordCount / wordsPerMinute;
    const readMinutes = (totalMinutes * progress) / 100;
    const remainingMinutes = totalMinutes - readMinutes;
    
    return {
      total: Math.ceil(totalMinutes),
      read: Math.ceil(readMinutes),
      remaining: Math.ceil(remainingMinutes)
    };
  }, [progress]);

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    saveProgress,
    markAsCompleted,
    resetProgress,
    calculateReadingTime,
    isUnsaved: progress !== lastSaved
  };
}