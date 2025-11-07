'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryImagesGrid from '@/components/GalleryImagesGrid';
import BackToAlbumButton from '@/components/BackToAlbumButton';
import LoadMoreButton from '@/components/LoadMoreButton';
import { useAlbumImages } from '@/lib/hooks/use-album-images';

interface GalleryIndividualPageProps {
  params: {
    id: string;
  };
}

export default function GalleryIndividualPage({ params }: GalleryIndividualPageProps) {
  const { id } = params;

  // Manage album images state at page level
  const imagesState = useAlbumImages(id);

  // Convert the id to a title (e.g., "group" -> "Group")
  const albumTitle = imagesState.album?.name || id.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center min-h-screen">
      <Header />

      <main className="flex flex-col items-center w-full max-w-[1200px] mx-auto">
        {/* Album Title Section */}
        <section className="flex w-full flex-col items-center text-[rgba(78,46,140,1)] font-bold text-center pt-6 sm:pt-8 md:pt-12 lg:pt-16 px-4 sm:px-6 md:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[78px] leading-tight sm:leading-tight md:leading-tight lg:leading-[1.1] mb-0 text-balance break-words max-w-full">
            {albumTitle}
          </h1>
        </section>

        {/* Pass shared state to GalleryImagesGrid */}
        <GalleryImagesGrid albumSlug={id} externalState={imagesState} />

        {/* Load More Button - shows after 3 auto-loads */}
        <div className="pb-10 sm:pb-12 md:pb-16">
          <LoadMoreButton
            onLoadMore={imagesState.loadMore}
            loading={imagesState.loading}
            hasMore={imagesState.hasMore}
            autoLoadCount={imagesState.autoLoadCount}
            total={imagesState.total}
            currentCount={imagesState.images.length}
            buttonText="Load more images"
          />
        </div>

        <BackToAlbumButton />
      </main>

      <Footer />
    </div>
  );
}
