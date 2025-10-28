import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/GalleryGrid';
import LoadMoreButton from '@/components/LoadMoreButton';

export default function GalleryPage() {
  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-center min-h-screen">
      <Header />

      <main className="flex flex-col items-center w-full px-5">
        <section className="w-full max-w-[1200px] mt-16">
          <h1 className="text-[rgba(217,81,100,1)] text-[54px] font-bold leading-none max-md:text-[40px] text-center">
            Photo Gallery
          </h1>
          <p className="text-white text-[24px] mt-4 text-center">
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
