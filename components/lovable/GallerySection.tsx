'use client';

import React from 'react';
import Link from 'next/link';

const GallerySection = () => {
  return (
    <section
      id="gallery"
      className="w-full bg-neutral-100 py-12 sm:py-16 md:py-20 lg:py-24"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2
            id="gallery-heading"
            className="text-[rgba(88,43,143,1)] font-bold leading-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: '1.25' }}
          >
            Snapshots from the Hill
          </h2>
          <p
            className="text-[rgba(217,81,100,1)] font-normal mt-3 sm:mt-4 md:mt-6"
            style={{ fontSize: 'clamp(16px, 2vw, 24px)' }}
          >
            School days. Reunions. Everything in between.
          </p>
        </div>

        {/* Gallery Preview Image */}
        <div className="w-full flex justify-center mb-8 sm:mb-10 md:mb-12">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/93ac5ec72bbc1db90c9a7382fddaa6ace2c20646?placeholderIfAbsent=true"
            alt="Gallery preview showing various school and reunion photos"
            className="w-full max-w-5xl aspect-[2.4] object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* View Gallery Button */}
        <div className="flex justify-center">
          <Link href="/gallery">
            <button className="bg-[rgba(217,81,100,1)] text-neutral-100 font-black text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-[rgba(197,61,80,1)] active:scale-95 transition-all shadow-lg">
              View Gallery
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
