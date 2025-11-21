'use client';

import React from 'react';
import Link from 'next/link';

const StorySection = () => {
  return (
    <section
      className="w-full bg-[rgba(78,46,140,1)] py-8 sm:py-10 md:py-12 lg:py-14"
      aria-labelledby="story-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center">
          {/* Left Column - Text */}
          <div className="text-center md:text-left space-y-3 sm:space-y-4">
            <h2
              id="story-heading"
              className="text-[rgba(217,81,100,1)] font-bold leading-tight"
              style={{ fontSize: 'clamp(22px, 3vw, 38px)', lineHeight: '1.15' }}
            >
              Who we are.
              <br />
              And why we're
              <br />
              still showing up.
            </h2>

            <p
              className="text-white font-normal leading-relaxed"
              style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', lineHeight: '1.6' }}
            >
              We're the Montfort School Class of 2000, a batch of 134 boys who grew up together on a hill in Yercaud.
              Some of us lived in dorms. Some walked in every morning. All of us walked out in 2000 with stories we still talk about.
            </p>

            <div className="pt-2 sm:pt-3">
              <Link href="/about">
                <button className="bg-white text-[rgba(78,46,140,1)] font-black text-sm sm:text-base px-8 sm:px-12 md:px-14 py-2.5 sm:py-3 !rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[rgba(78,46,140,1)]">
                  Our Story
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/f7128c57aa28e3dfcba51c7ffa2fe11814b7129c?placeholderIfAbsent=true"
              alt="School memories collage"
              className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] aspect-[0.79] object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
