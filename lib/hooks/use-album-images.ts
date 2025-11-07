import { useState, useCallback, useEffect, useRef } from 'react';
import { GALLERY_CONFIG } from '@/lib/config/gallery-config';

export interface AlbumImage {
  id: number;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface AlbumInfo {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface AlbumImagesResponse {
  album: AlbumInfo;
  images: AlbumImage[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  limit: number;
}

interface UseAlbumImagesReturn {
  album: AlbumInfo | null;
  images: AlbumImage[];
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
 * Custom hook for fetching and managing album images with pagination
 *
 * Features:
 * - Automatic pagination state management
 * - Load more functionality with append logic
 * - Auto-load counter for infinite scroll
 * - Album info caching
 * - Error handling and retry capability
 * - Prevents duplicate requests
 * - Cleanup on unmount
 *
 * @example
 * ```tsx
 * function AlbumPage({ albumSlug }: { albumSlug: string }) {
 *   const {
 *     album,
 *     images,
 *     loading,
 *     error,
 *     hasMore,
 *     autoLoadCount,
 *     loadMore,
 *     retry
 *   } = useAlbumImages(albumSlug);
 *
 *   return (
 *     <div>
 *       <h1>{album?.name}</h1>
 *       {images.map(image => <ImageCard key={image.id} {...image} />)}
 *       {hasMore && <button onClick={loadMore}>Load More</button>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param albumSlug - URL slug of the album to fetch images for
 * @param initialLimit - Number of images to fetch per page (defaults to GALLERY_CONFIG.ITEMS_PER_PAGE)
 * @returns Object containing album info, images data, and control functions
 */
export function useAlbumImages(
  albumSlug: string,
  initialLimit: number = GALLERY_CONFIG.ITEMS_PER_PAGE
): UseAlbumImagesReturn {
  const [album, setAlbum] = useState<AlbumInfo | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
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
   * Fetch images from API with pagination
   */
  const fetchImages = useCallback(
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
          `/api/gallery/albums/${albumSlug}/images?page=${pageNum}&limit=${initialLimit}`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Album not found');
          }
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }

        const data: AlbumImagesResponse = await response.json();

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          // Always set album info (it doesn't change)
          if (!album) {
            setAlbum(data.album);
          }

          if (isLoadMore) {
            // Append new images to existing list
            setImages((prev) => [...prev, ...data.images]);
            setAutoLoadCount((prev) => prev + 1);
          } else {
            // Replace images (initial load or reset)
            setImages(data.images);
            setAutoLoadCount(0);
          }

          setHasMore(data.hasMore);
          setTotal(data.total);
          setPage(data.currentPage);
        }
      } catch (err) {
        console.error(`Error fetching images for album "${albumSlug}":`, err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load images');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        loadingRef.current = false;
      }
    },
    [albumSlug, initialLimit, album]
  );

  /**
   * Load next page of images
   * Appends new images to existing list
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }

    await fetchImages(page + 1, true);
  }, [page, hasMore, loading, fetchImages]);

  /**
   * Reset to first page
   * Clears existing images and fetches from beginning
   */
  const reset = useCallback(async () => {
    setImages([]);
    setPage(1);
    setAutoLoadCount(0);
    await fetchImages(1, false);
  }, [fetchImages]);

  /**
   * Retry last failed request
   * Useful for error recovery
   */
  const retry = useCallback(async () => {
    if (images.length === 0) {
      // If no images loaded, retry from page 1
      await fetchImages(1, false);
    } else {
      // If some images loaded, retry loading more
      await loadMore();
    }
  }, [images.length, fetchImages, loadMore]);

  // Initial fetch on mount or when albumSlug changes
  useEffect(() => {
    // Reset state when album slug changes
    setImages([]);
    setPage(1);
    setAutoLoadCount(0);
    setAlbum(null);

    fetchImages(1, false);

    // Cleanup: set mounted flag to false
    return () => {
      isMountedRef.current = false;
    };
  }, [albumSlug]); // Only re-run when albumSlug changes

  return {
    album,
    images,
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
