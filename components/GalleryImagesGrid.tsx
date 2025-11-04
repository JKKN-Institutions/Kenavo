'use client';

import React, { useState } from 'react';
import ImageLightbox from './ImageLightbox';

const GalleryImagesGrid: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/8b9a6705c766f3c7905780c536941a5537bf9cd8?placeholderIfAbsent=true",
      alt: "Gallery image 1"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7761f1e2f2ffddbc4030e5f96bb746795a9ff03b?placeholderIfAbsent=true",
      alt: "Gallery image 2"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/3068a9173209df2ea12b552caa3fa8084fbfac9d?placeholderIfAbsent=true",
      alt: "Gallery image 3"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0241344251d136e7c5debdb97fe58bb2a0ea545b?placeholderIfAbsent=true",
      alt: "Gallery image 4"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c24a9ccac27976dbd019cb8e5219cf071ac3abbb?placeholderIfAbsent=true",
      alt: "Gallery image 5"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/ecddc2bef3848466a6fcf6416b246897a1031509?placeholderIfAbsent=true",
      alt: "Gallery image 6"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/8fc6d03bfdbbdc34305e389b13919e169ab54f11?placeholderIfAbsent=true",
      alt: "Gallery image 7"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/746e49ff20a8d11ae98b884782d3ec339b35c661?placeholderIfAbsent=true",
      alt: "Gallery image 8"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/3f645a6392789c999114872f496c3298af705256?placeholderIfAbsent=true",
      alt: "Gallery image 9"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/5aaa49cec17b68db8515115c2748e9857e584cca?placeholderIfAbsent=true",
      alt: "Gallery image 10"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/4adb6cedf35ab0181f732a5d2c184dbd7e47b567?placeholderIfAbsent=true",
      alt: "Gallery image 11"
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0eb8a7f31247677c1c6e53edd435f1844f704c84?placeholderIfAbsent=true",
      alt: "Gallery image 12"
    }
  ];

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

  const renderRow = (startIndex: number, marginTop: string) => (
    <div className={`w-full max-w-[930px] ${marginTop}`}>
      <div className="gap-3 sm:gap-4 md:gap-5 flex flex-wrap justify-center md:justify-start">
        {galleryImages.slice(startIndex, startIndex + 4).map((image, index) => {
          const imageIndex = startIndex + index;
          return (
            <div
              key={imageIndex}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(25%-0.9375rem)] lg:w-[221px]"
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

  return (
    <>
      <section className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 pb-20 lg:pb-0">
        {renderRow(0, "mt-12 sm:mt-16 md:mt-20 lg:mt-24")}
        {renderRow(4, "mt-3 sm:mt-4")}
        {renderRow(8, "mt-3 sm:mt-4")}
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
