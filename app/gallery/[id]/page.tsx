import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryImagesGrid from '@/components/GalleryImagesGrid';
import BackToAlbumButton from '@/components/BackToAlbumButton';

// Generate static paths for all gallery albums
export function generateStaticParams() {
  return [
    { id: 'group' },
    { id: 'sports' },
    { id: 'hostel' },
    { id: 'tours' },
    { id: 'events' },
    { id: 'annual-day' }
  ];
}

// Allow dynamic routes for any other profile IDs at runtime
export const dynamicParams = true;

export default async function GalleryIndividualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Convert the id to a title (e.g., "group" -> "Group")
  const albumTitle = id.split('-').map(word =>
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

        <GalleryImagesGrid albumSlug={id} />

        <BackToAlbumButton />
      </main>

      <Footer />
    </div>
  );
}
