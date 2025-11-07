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
        <section className="flex w-full flex-col items-center text-[40px] sm:text-[50px] md:text-[64px] lg:text-[78px] text-[rgba(78,46,140,1)] font-bold whitespace-nowrap text-center leading-[1.1] pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8">
          <h1 className="z-10 mb-[-25px] max-md:mb-2.5">
            {albumTitle}
          </h1>
        </section>

        {/* Pass shared state to GalleryImagesGrid */}
        <GalleryImagesGrid albumSlug={id} externalState={imagesState} />

        {/* Load More Button - shows after 3 auto-loads */}
        <div className="pb-12">
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
