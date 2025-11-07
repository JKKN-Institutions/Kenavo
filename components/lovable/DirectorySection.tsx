'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section
      id="directory"
      className="w-full overflow-hidden bg-[rgba(78,46,140,1)]"
      aria-labelledby="directory-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-full">
        {/* LEFT SIDE - Text Content (50% width on desktop) */}
        <div className="flex flex-col justify-center bg-[rgba(78,46,140,1)] px-6 sm:px-8 md:px-12 lg:px-14 xl:px-20 py-12 sm:py-14 lg:py-16 order-1">
          <div className="max-w-xl mx-auto lg:mx-0 space-y-6 sm:space-y-8">
            {/* Heading */}
            <h2
              id="directory-heading"
              className="text-[rgba(217,81,100,1)] font-bold leading-tight text-center lg:text-left"
              style={{ fontSize: 'clamp(26px, 4vw, 52px)', lineHeight: '1.1' }}
            >
              From Yercaud to New York, here's what we're all up to now.
            </h2>

            {/* Description */}
            <p
              className="text-[rgba(254,249,232,1)] font-normal leading-relaxed text-center lg:text-left"
              style={{ fontSize: 'clamp(15px, 1.8vw, 28px)', lineHeight: '1.4' }}
            >
              Browse profiles, spot familiar faces, revisit a few inside jokes.
              Whether you're checking in or catching up, this is where it all comes together.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start pt-2 sm:pt-4">
              <Link href="/directory">
                <button className="bg-white text-[rgba(78,46,140,1)] font-black text-base sm:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Browse the Directory
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Mountain Background + Image Collage (50% width on desktop) */}
        <div className="relative h-[450px] sm:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden order-2">
          {/* Mountain Collage Background - CONSTRAINED TO RIGHT SIDE ONLY */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/219b42832d68c68bc6d901fa348872161818ef2b?placeholderIfAbsent=true"
              alt="Directory collage background"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Overlay Pattern - ALSO RIGHT SIDE ONLY */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67114605b5b4499fa51946af498b30b56961a690?placeholderIfAbsent=true"
              alt="Directory pattern overlay"
              className="w-full h-full object-cover mix-blend-multiply opacity-70"
            />
          </div>

          {/* Foreground Portrait Images - Layered on Top */}
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
            <div className="relative w-full max-w-sm">
              {/* Portrait Badge - Left offset */}
              <div className="absolute -left-8 sm:-left-12 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
                <img
                  src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/20e63c88b0fe6dc3cf2778312d215c65bf2a7e23?placeholderIfAbsent=true"
                  alt="Featured classmate portrait"
                  className="w-28 sm:w-36 md:w-44 h-auto drop-shadow-2xl"
                />
              </div>

              {/* Grid of 2 Square Classmate Photos */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 ml-0 sm:ml-12">
                {/* Classmate 1 - Top */}
                <div className="flex justify-center items-start">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                    alt="Classmate profile 1"
                    className="w-full max-w-[130px] sm:max-w-[160px] aspect-square object-cover rounded-lg shadow-2xl border-4 border-white/30"
                  />
                </div>

                {/* Classmate 2 - Bottom Offset */}
                <div className="flex justify-center items-start pt-12 sm:pt-16">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                    alt="Classmate profile 2"
                    className="w-full max-w-[130px] sm:max-w-[160px] aspect-square object-cover rounded-lg shadow-2xl border-4 border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
