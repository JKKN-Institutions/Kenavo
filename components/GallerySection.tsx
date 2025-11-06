'use client';

import React from 'react';
import Link from 'next/link';

const GallerySection = () => {
  return (
    <section
      className="bg-neutral-100 flex w-full flex-col py-2 sm:py-4 md:py-5 lg:py-6 xl:py-7"
      aria-labelledby="gallery-heading"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center">
          <h2
            id="gallery-heading"
            className="text-[rgba(88,43,143,1)] text-[28px] sm:text-[36px] md:text-[48px] lg:text-[58px] xl:text-[64px] font-bold leading-tight"
          >
            Snapshots from the Hill
          </h2>
          <p className="text-[rgba(217,81,100,1)] text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[30px] font-normal leading-snug mt-2">
            School days. Reunions.
            <br />
            Everything in between.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg w-full flex items-center justify-center mx-auto mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/93ac5ec72bbc1db90c9a7382fddaa6ace2c20646?placeholderIfAbsent=true"
            alt="Gallery preview showing various school and reunion photos"
            className="aspect-[2.7] object-contain w-full block border-0 shadow-lg mx-auto"
          />
        </div>
        <div className="flex justify-center w-full">
          <Link href="/gallery">
            <button
              className="bg-[rgba(217,81,100,1)] flex items-center justify-center w-[140px] sm:w-[160px] md:w-[170px] max-w-full text-sm sm:text-base text-neutral-100 font-black px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-[50px] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 hover:bg-[rgba(197,61,80,1)] active:scale-95 transition-all"
              aria-label="View complete photo gallery"
            >
              View Gallery
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
