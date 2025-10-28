'use client';

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryImagesGrid from '@/components/GalleryImagesGrid';
import { useRouter } from 'next/navigation';

export default function GalleryIndividualPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const handleBackToAlbum = () => {
    router.push('/gallery');
  };

  // Convert the id to a title (e.g., "group" -> "Group")
  const albumTitle = id.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center min-h-screen">
      <Header />

      <main className="flex flex-col items-center w-full">
        <section className="self-stretch flex w-full flex-col items-center text-[78px] text-[rgba(78,46,140,1)] font-bold whitespace-nowrap text-center leading-[1.1] pt-[86px] px-[70px] max-md:max-w-full max-md:text-[40px] max-md:px-5">
          <h1 className="z-10 mb-[-25px] max-md:text-[40px] max-md:mb-2.5">
            {albumTitle}
          </h1>
        </section>

        <GalleryImagesGrid />

        <button
          onClick={handleBackToAlbum}
          className="bg-[rgba(217,81,100,1)] flex w-[170px] max-w-full flex-col items-stretch text-lg text-white font-black text-center leading-none justify-center mt-[54px] px-[25px] py-3 rounded-[50px] max-md:mt-10 max-md:px-5 hover:bg-[rgba(197,61,80,1)] transition-colors cursor-pointer"
          aria-label="Navigate back to album view"
        >
          <span>Back to Album</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
