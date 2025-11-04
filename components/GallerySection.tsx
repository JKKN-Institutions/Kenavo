'use client';

import React from 'react';
import Link from 'next/link';

const GallerySection = () => {
  return (
    <section
      className="bg-neutral-100 flex w-full flex-col px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="text-center md:text-left">
          <h2
            id="gallery-heading"
            className="text-[rgba(88,43,143,1)] text-[28px] sm:text-[36px] md:text-[48px] lg:text-[58px] xl:text-[64px] font-bold leading-tight"
          >
            Snapshots from the Hill
          </h2>
          <p className="text-[rgba(217,81,100,1)] text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[30px] font-normal leading-tight mt-3">
            School days. Reunions. Everything in between.
          </p>
        </div>
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/93ac5ec72bbc1db90c9a7382fddaa6ace2c20646?placeholderIfAbsent=true"
          alt="Gallery preview showing various school and reunion photos"
          className="aspect-[2.7] object-cover w-full mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 rounded-lg shadow-lg"
        />
        <Link href="/gallery">
          <button
            className="bg-[rgba(217,81,100,1)] self-center flex items-center justify-center w-[140px] sm:w-[160px] md:w-[170px] max-w-full text-sm sm:text-base text-neutral-100 font-black px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-[50px] mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-[51px] hover:bg-[rgba(197,61,80,1)] active:scale-95 transition-all"
            aria-label="View complete photo gallery"
          >
            View Gallery
          </button>
        </Link>
      </div>
    </section>
  );
};

export default GallerySection;
