import { useState, useCallback, useEffect, useRef } from 'react';
import { GALLERY_CONFIG } from '@/lib/config/gallery-config';

export interface GalleryAlbum {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  display_order: number;
  image_count: number;
}

interface GalleryAlbumsResponse {
  albums: GalleryAlbum[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  limit: number;
}

interface UseGalleryAlbumsReturn {
  albums: GalleryAlbum[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  total: number;
  autoLoadCount: number;
  loadMore: () => Promise<void>;
  reset: () => Promise<void>;
  retry: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing gallery albums with pagination
 *
 * Features:
 * - Automatic pagination state management
 * - Load more functionality with append logic
 * - Auto-load counter for infinite scroll
 * - Error handling and retry capability
 * - Prevents duplicate requests
 * - Cleanup on unmount
 *
 * @example
 * ```tsx
 * function GalleryPage() {
 *   const {
 *     albums,
 *     loading,
 *     error,
 *     hasMore,
 *     autoLoadCount,
 *     loadMore,
 *     retry
 *   } = useGalleryAlbums();
 *
 *   return (
 *     <div>
 *       {albums.map(album => <AlbumCard key={album.id} {...album} />)}
 *       {hasMore && <button onClick={loadMore}>Load More</button>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param initialLimit - Number of albums to fetch per page (defaults to GALLERY_CONFIG.ITEMS_PER_PAGE)
 * @returns Object containing albums data and control functions
 */
export function useGalleryAlbums(
  initialLimit: number = GALLERY_CONFIG.ITEMS_PER_PAGE
): UseGalleryAlbumsReturn {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [autoLoadCount, setAutoLoadCount] = useState(0);

  // Ref to track if a request is in progress (prevents race conditions)
  const loadingRef = useRef(false);
  // Ref to track if component is mounted (prevents state updates after unmount)
  const isMountedRef = useRef(true);

  /**
   * Fetch albums from API with pagination
   */
  const fetchAlbums = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      // Prevent duplicate requests
      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/gallery/albums?page=${pageNum}&limit=${initialLimit}`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch albums: ${response.statusText}`);
        }

        const data: GalleryAlbumsResponse = await response.json();

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          if (isLoadMore) {
            // Append new albums to existing list
            setAlbums((prev) => [...prev, ...data.albums]);
            setAutoLoadCount((prev) => prev + 1);
          } else {
            // Replace albums (initial load or reset)
            setAlbums(data.albums);
            setAutoLoadCount(0);
          }

          setHasMore(data.hasMore);
          setTotal(data.total);
          setPage(data.currentPage);
        }
      } catch (err) {
        console.error('Error fetching gallery albums:', err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load albums');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        loadingRef.current = false;
      }
    },
    [initialLimit]
  );

  /**
   * Load next page of albums
   * Appends new albums to existing list
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }

    await fetchAlbums(page + 1, true);
  }, [page, hasMore, loading, fetchAlbums]);

  /**
   * Reset to first page
   * Clears existing albums and fetches from beginning
   */
  const reset = useCallback(async () => {
    setAlbums([]);
    setPage(1);
    setAutoLoadCount(0);
    await fetchAlbums(1, false);
  }, [fetchAlbums]);

  /**
   * Retry last failed request
   * Useful for error recovery
   */
  const retry = useCallback(async () => {
    if (albums.length === 0) {
      // If no albums loaded, retry from page 1
      await fetchAlbums(1, false);
    } else {
      // If some albums loaded, retry loading more
      await loadMore();
    }
  }, [albums.length, fetchAlbums, loadMore]);

  // Initial fetch on mount
  useEffect(() => {
    fetchAlbums(1, false);

    // Cleanup: set mounted flag to false
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchAlbums]);

  return {
    albums,
    loading,
    error,
    hasMore,
    page,
    total,
    autoLoadCount,
    loadMore,
    reset,
    retry,
  };
}
