'use client';

import React from 'react';
import Link from 'next/link';

const StorySection = () => {
  return (
    <section
      className="w-full bg-[rgba(78,46,140,1)] py-12 sm:py-16 md:py-20 lg:py-24"
      aria-labelledby="story-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center md:text-left space-y-6 sm:space-y-8">
            <h2
              id="story-heading"
              className="text-[rgba(217,81,100,1)] font-bold leading-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: '1.1' }}
            >
              Who we are.
              <br />
              And why we're
              <br />
              still showing up.
            </h2>

            <p
              className="text-white font-normal leading-relaxed"
              style={{ fontSize: 'clamp(16px, 2vw, 28px)', lineHeight: '1.5' }}
            >
              We're the Montfort School Class of 2000, a batch of 134 boys who grew up together on a hill in Yercaud.
              Some of us lived in dorms. Some walked in every morning. All of us walked out in 2000 with stories we still talk about.
            </p>

            <div className="pt-2">
              <Link href="/about">
                <button className="bg-white text-[rgba(78,46,140,1)] font-black text-base sm:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full hover:bg-gray-100 active:scale-95 transition-all shadow-lg">
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
              className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-full aspect-[0.79] object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
