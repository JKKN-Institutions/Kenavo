'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/GalleryGrid';
import LoadMoreButton from '@/components/LoadMoreButton';
import { useGalleryAlbums } from '@/lib/hooks/use-gallery-albums';

export default function GalleryPage() {
  // Manage gallery state at page level
  const galleryState = useGalleryAlbums();

  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-center min-h-screen">
      <Header />

      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
        <section className="w-full max-w-[1000px] mt-8 sm:mt-10 md:mt-12">
          <h1 className="text-[rgba(217,81,100,1)] text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px] font-bold leading-[1.15] text-center">
            Photo Gallery
          </h1>
          <p className="text-white text-[14px] sm:text-[15px] md:text-[17px] lg:text-[18px] mt-3 sm:mt-4 md:mt-5 text-center leading-[1.5]">
            School days. Reunions. Everything in between.
          </p>
        </section>

        {/* Pass shared state to GalleryGrid */}
        <GalleryGrid externalState={galleryState} />

        {/* Load More Button - shows after initial load when more albums available */}
        <div className="w-full flex justify-center mb-10 sm:mb-12 md:mb-14">
          <LoadMoreButton
            onLoadMore={galleryState.loadMore}
            loading={galleryState.loading}
            hasMore={galleryState.hasMore}
            autoLoadCount={galleryState.autoLoadCount}
            total={galleryState.total}
            currentCount={galleryState.albums.length}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
