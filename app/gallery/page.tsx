import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/GalleryGrid';
import LoadMoreButton from '@/components/LoadMoreButton';

export default function GalleryPage() {
  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-center min-h-screen">
      <Header />

      <main className="flex flex-col items-center w-full px-4 sm:px-5">
        <section className="w-full max-w-[1200px] mt-10 sm:mt-12 md:mt-16">
          <h1 className="text-[rgba(217,81,100,1)] text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px] font-bold leading-none text-center">
            Photo Gallery
          </h1>
          <p className="text-white text-[16px] sm:text-[20px] md:text-[22px] lg:text-[24px] mt-3 sm:mt-4 text-center">
            School days. Reunions. Everything in between.
          </p>
        </section>

        <GalleryGrid />
        <LoadMoreButton />
      </main>

      <Footer />
    </div>
  );
}
