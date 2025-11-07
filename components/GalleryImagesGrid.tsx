'use client';

import React, { useState } from 'react';
import ImageLightbox from './ImageLightbox';
import { useAlbumImages } from '@/lib/hooks/use-album-images';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';
import { GALLERY_CONFIG } from '@/lib/config/gallery-config';

interface GalleryImagesGridProps {
  albumSlug: string;
  /**
   * Expose hook return values for parent component integration
   * Optional - if not provided, component manages its own state
   */
  externalState?: ReturnType<typeof useAlbumImages>;
}

const GalleryImagesGrid: React.FC<GalleryImagesGridProps> = ({
  albumSlug,
  externalState,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use external state if provided, otherwise use internal hook
  const internalState = useAlbumImages(albumSlug);
  const {
    images,
    loading,
    error,
    hasMore,
    total,
    autoLoadCount,
    loadMore,
    retry,
  } = externalState || internalState;

  // Setup infinite scroll sentinel
  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    enabled: autoLoadCount < GALLERY_CONFIG.MAX_AUTO_LOADS,
    loading,
    hasMore,
    autoLoadCount,
  });

  // Transform images for lightbox
  const galleryImages = images.map(img => ({
    src: img.image_url,
    alt: img.caption || `Gallery image ${img.id}`,
  }));

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, galleryImages.length - 1));
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    setLightboxOpen(false);
  };

  // Initial loading state (no images loaded yet)
  if (loading && galleryImages.length === 0) {
    return (
      <section className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 pb-12 lg:pb-8">
        <div className="flex justify-center items-center py-20 mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </section>
    );
  }

  // Error state (no images loaded)
  if (error && galleryImages.length === 0) {
    return (
      <section className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 pb-12 lg:pb-8">
        <div className="text-center py-20 mt-12">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={retry}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (!loading && galleryImages.length === 0) {
    return (
      <section className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 pb-12 lg:pb-8">
        <div className="text-center py-20 mt-12">
          <p className="text-gray-600 text-lg">No images in this album yet.</p>
        </div>
      </section>
    );
  }

  const renderRow = (startIndex: number, marginTop: string) => {
    const rowImages = galleryImages.slice(startIndex, startIndex + 4);
    if (rowImages.length === 0) return null;

    return (
      <div className={`w-full ${marginTop}`}>
        <div className="gap-3 sm:gap-4 md:gap-5 flex flex-wrap justify-center">
          {rowImages.map((image, index) => {
            const imageIndex = startIndex + index;
            return (
              <div
                key={imageIndex}
                className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(25%-0.9375rem)] lg:w-[calc(25%-1.25rem)]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  onClick={() => handleImageClick(imageIndex)}
                  className="aspect-square object-cover w-full rounded-lg hover:opacity-80 hover:scale-105 transition-all cursor-pointer shadow-md"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Calculate number of rows needed (4 images per row)
  const numRows = Math.ceil(galleryImages.length / 4);
  const rows = Array.from({ length: numRows }, (_, i) => i * 4);

  return (
    <>
      <section className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 pb-12 lg:pb-8">
        {rows.map((startIndex, rowIndex) =>
          renderRow(startIndex, rowIndex === 0 ? "mt-12 sm:mt-16 md:mt-20 lg:mt-24" : "mt-3 sm:mt-4")
        )}

        {/* Infinite scroll sentinel - invisible trigger for auto-loading */}
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />

        {/* Loading indicator during auto-scroll */}
        {loading && galleryImages.length > 0 && autoLoadCount < GALLERY_CONFIG.MAX_AUTO_LOADS && (
          <div className="flex flex-col items-center gap-3 mt-12 mb-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 text-sm">Loading more images...</p>
          </div>
        )}

        {/* End of results message */}
        {!loading && !hasMore && galleryImages.length > 0 && (
          <div className="text-center mt-12 mb-8">
            <p className="text-gray-500 text-sm">
              You've reached the end - All {total} images shown
            </p>
          </div>
        )}

        {/* Error message during loading more */}
        {error && galleryImages.length > 0 && (
          <div className="text-center mt-12 mb-8">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={retry}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </section>

      <ImageLightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  );
};

export default GalleryImagesGrid;
