'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: Array<{ src: string; alt: string }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      onNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      onPrevious();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[101] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-[101] bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Previous Button */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[101] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[101] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Image Container */}
      <div
        ref={imageContainerRef}
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-full object-contain rounded-lg select-none"
          loading="eager"
          draggable={false}
        />
      </div>

      {/* Swipe Instructions (Mobile Only) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[101] bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full md:hidden">
        <span className="text-white text-xs">Swipe to navigate</span>
      </div>
    </div>
  );
};

export default ImageLightbox;
