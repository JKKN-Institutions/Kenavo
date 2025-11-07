import { useEffect, useRef, useCallback } from 'react';
import { GALLERY_CONFIG } from '@/lib/config/gallery-config';

interface UseInfiniteScrollOptions {
  /**
   * Callback function to execute when sentinel element becomes visible
   */
  onLoadMore: () => void;

  /**
   * Whether infinite scroll is enabled
   * Set to false to disable auto-loading
   */
  enabled: boolean;

  /**
   * Whether data is currently being loaded
   * Prevents multiple simultaneous requests
   */
  loading: boolean;

  /**
   * Whether there are more items to load
   * Stops triggering when no more data available
   */
  hasMore: boolean;

  /**
   * Current number of auto-loads that have occurred
   * Used to limit automatic loading
   */
  autoLoadCount?: number;

  /**
   * Maximum number of auto-loads before disabling
   * Defaults to GALLERY_CONFIG.MAX_AUTO_LOADS
   */
  maxAutoLoads?: number;

  /**
   * Root margin for intersection observer
   * Defaults to GALLERY_CONFIG.ROOT_MARGIN
   */
  rootMargin?: string;

  /**
   * Intersection threshold (0.0 to 1.0)
   * Defaults to GALLERY_CONFIG.INTERSECTION_THRESHOLD
   */
  threshold?: number;
}

/**
 * Custom hook for implementing infinite scroll functionality
 * Uses Intersection Observer API to detect when user scrolls near bottom
 *
 * @example
 * ```tsx
 * const sentinelRef = useInfiniteScroll({
 *   onLoadMore: loadNextPage,
 *   enabled: autoLoadCount < 3,
 *   loading: isLoading,
 *   hasMore: hasMoreItems,
 *   autoLoadCount: autoLoadCount
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef} /> // Invisible sentinel element
 *   </div>
 * );
 * ```
 *
 * @param options - Configuration options for infinite scroll
 * @returns React ref to attach to sentinel element
 */
export function useInfiniteScroll({
  onLoadMore,
  enabled,
  loading,
  hasMore,
  autoLoadCount = 0,
  maxAutoLoads = GALLERY_CONFIG.MAX_AUTO_LOADS,
  rootMargin = GALLERY_CONFIG.ROOT_MARGIN,
  threshold = GALLERY_CONFIG.INTERSECTION_THRESHOLD,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoized callback to handle intersection
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // Check if sentinel is visible and all conditions are met
      if (
        entry.isIntersecting &&
        enabled &&
        !loading &&
        hasMore &&
        autoLoadCount < maxAutoLoads
      ) {
        onLoadMore();
      }
    },
    [enabled, loading, hasMore, autoLoadCount, maxAutoLoads, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;

    // Don't create observer if conditions aren't met
    if (!sentinel || !enabled || !hasMore || autoLoadCount >= maxAutoLoads) {
      // Clean up existing observer if conditions changed
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Create new Intersection Observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null, // viewport
      rootMargin,
      threshold,
    });

    // Start observing the sentinel element
    observerRef.current.observe(sentinel);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enabled, hasMore, autoLoadCount, maxAutoLoads, handleIntersection, rootMargin, threshold]);

  return sentinelRef;
}
