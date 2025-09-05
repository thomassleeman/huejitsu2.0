import { useState, useEffect, useCallback } from "react";

interface HistoryItem<T> {
  data: T;
  timestamp: number;
}

interface UseCreativeIterationOptions<T> {
  maxHistorySize?: number;
  initialData: T;
  generateFunction: () => T;
  onDataChange?: (data: T) => void;
}

interface UseCreativeIterationReturn<T> {
  currentData: T;
  history: HistoryItem<T>[];
  currentIndex: number;
  isAtLatest: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  generateNew: () => void;
  goBack: () => void;
  goForward: () => void;
  jumpToIndex: (index: number) => void;
  clearHistory: () => void;
}

export function useCreativeIteration<T>({
  maxHistorySize = 50,
  initialData,
  generateFunction,
  onDataChange,
}: UseCreativeIterationOptions<T>): UseCreativeIterationReturn<T> {
  // Initialize with starting data
  const [history, setHistory] = useState<HistoryItem<T>[]>([
    { data: initialData, timestamp: Date.now() },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentData = history[currentIndex]?.data || initialData;
  const isAtLatest = currentIndex === history.length - 1;
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  // Generate new variation and add to history
  const generateNew = useCallback(() => {
    const newData = generateFunction();
    const newItem: HistoryItem<T> = {
      data: newData,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // If we're not at the latest, cut off everything after current index
      let newHistory = prev.slice(0, currentIndex + 1);

      // Add new item
      newHistory = [...newHistory, newItem];

      // Trim to max size if needed
      if (newHistory.length > maxHistorySize) {
        newHistory = newHistory.slice(newHistory.length - maxHistorySize);
        setCurrentIndex(maxHistorySize - 1);
      } else {
        setCurrentIndex(newHistory.length - 1);
      }

      return newHistory;
    });
  }, [generateFunction, currentIndex, maxHistorySize]);

  // Navigate backward in history
  const goBack = useCallback(() => {
    if (canGoBack) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoBack]);

  // Navigate forward in history
  const goForward = useCallback(() => {
    if (canGoForward) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoForward]);

  // Jump to specific index
  const jumpToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setCurrentIndex(index);
      }
    },
    [history.length]
  );

  // Clear history and start fresh
  const clearHistory = useCallback(() => {
    const newData = generateFunction();
    setHistory([{ data: newData, timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, [generateFunction]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle space key events
      if (event.code === "Space") {
        // Prevent default scrolling behavior
        event.preventDefault();

        if (event.shiftKey) {
          // Shift + Space: go back
          goBack();
        } else {
          // Space: generate new or go forward
          if (isAtLatest) {
            generateNew();
          } else {
            goForward();
          }
        }
      }
    },
    [goBack, goForward, generateNew, isAtLatest]
  );

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Call data change callback when current data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(currentData);
    }
  }, [currentData, onDataChange]);

  return {
    currentData,
    history,
    currentIndex,
    isAtLatest,
    canGoBack,
    canGoForward,
    generateNew,
    goBack,
    goForward,
    jumpToIndex,
    clearHistory,
  };
}
