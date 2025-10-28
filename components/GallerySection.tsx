'use client';

import React from 'react';

const GallerySection = () => {
  const handleGalleryClick = () => {
    // Navigate to gallery page
    console.log('Navigate to gallery');
  };

  return (
    <section className="bg-neutral-100 flex w-full flex-col px-20 py-[70px] max-md:max-w-full max-md:px-5" aria-labelledby="gallery-heading">
      <h2 
        id="gallery-heading"
        className="text-[rgba(88,43,143,1)] text-[54px] font-bold leading-none max-md:max-w-full max-md:text-[40px]"
      >
        Snapshots from the Hill
      </h2>
      <p className="text-[rgba(217,81,100,1)] text-2xl font-normal leading-none max-md:max-w-full">
        School days. Reunions. Everything in between.
      </p>
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/93ac5ec72bbc1db90c9a7382fddaa6ace2c20646?placeholderIfAbsent=true"
        alt="Gallery preview showing various school and reunion photos"
        className="aspect-[2.7] object-contain w-full max-w-[1165px] mt-[55px] max-md:max-w-full max-md:mt-10"
      />
      <button 
        onClick={handleGalleryClick}
        className="bg-[rgba(217,81,100,1)] self-center flex w-[170px] max-w-full flex-col items-stretch text-lg text-neutral-100 font-black leading-none justify-center mt-[51px] px-8 py-3 rounded-[50px] max-md:mt-10 max-md:px-5 hover:bg-[rgba(197,61,80,1)] transition-colors"
        aria-label="View complete photo gallery"
      >
        View Gallery
      </button>
    </section>
  );
};

export default GallerySection;
