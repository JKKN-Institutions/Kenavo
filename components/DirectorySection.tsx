'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#4e2e8c] to-[#3a1d7a]" aria-labelledby="directory-heading">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-2 gap-16 items-center">
          {/* Left Column - Profile Images - Increased size */}
          <div className="relative w-[600px] h-[600px]">
            {/* Center Badge - Increased size */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] z-20">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full bg-[#d95164] shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-sm font-bold uppercase tracking-wider">
                      CLASS OF
                    </div>
                    <div className="text-white text-4xl font-black mt-1">
                      2000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Images - Adjusted size and positioning */}
            {[...Array(6)].map((_, index) => {
              const angle = (index * 60 * Math.PI) / 180;
              const radius = 220; // Increased radius for better spacing
              const centerX = 300; // Center X coordinate (half of container width)
              const centerY = 300; // Center Y coordinate (half of container height)
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;

              return (
                <div
                  key={index}
                  className="absolute w-[140px] h-[140px] z-10 rounded-full overflow-hidden shadow-xl transition-transform hover:scale-105"
                  style={{
                    top: `${y}px`,
                    left: `${x}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={`/images/alumni/profile-${index + 1}.png`}
                    alt="Classmate profile"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column - Text Content - Adjusted spacing */}
          <div className="flex flex-col items-start space-y-8">
            <h2
              id="directory-heading"
              className="text-[#d95164] text-4xl lg:text-5xl font-bold leading-tight"
            >
              From Yercaud to New York, here's what we're all up to now.
            </h2>
            <p className="text-[#fef9e8] text-lg leading-relaxed max-w-xl">
              Browse profiles, spot familiar faces, revisit a few inside jokes. Whether you're checking in or catching up, this is where it all comes together.
            </p>
            <Link href="/directory">
              <button
                className="bg-white text-[#4e2e8c] px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all"
                aria-label="Browse the directory of classmates"
              >
                Browse the Directory
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout - Adjusted for better proportions */}
        <div className="md:hidden flex flex-col items-center text-center space-y-10">
          <h2
            id="directory-heading-mobile"
            className="text-[#d95164] text-3xl font-bold leading-tight px-4"
          >
            From Yercaud to New York, here's what we're all up to now.
          </h2>
          <p className="text-[#fef9e8] text-lg px-4">
            Browse profiles, spot familiar faces, revisit a few inside jokes. Whether you're checking in or catching up, this is where it all comes together.
          </p>

          {/* Mobile Circle Layout - Increased size */}
          <div className="relative w-[340px] h-[340px] my-8">
            {/* Center Badge - Mobile - Adjusted size */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] z-20">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full bg-[#d95164] shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-xs font-bold uppercase tracking-wider">
                      CLASS OF
                    </div>
                    <div className="text-white text-2xl font-black mt-1">
                      2000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Profile Images - Adjusted size and spacing */}
            {[...Array(6)].map((_, index) => {
              const angle = (index * 60 * Math.PI) / 180;
              const radius = 120; // Increased radius for mobile
              const centerX = 170; // Center X coordinate
              const centerY = 170; // Center Y coordinate
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;

              return (
                <div
                  key={index}
                  className="absolute w-[80px] h-[80px] z-10 rounded-full overflow-hidden shadow-xl"
                  style={{
                    top: `${y}px`,
                    left: `${x}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={`/images/alumni/profile-${index + 1}.png`}
                    alt="Classmate profile"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
              );
            })}
          </div>

          <Link href="/directory">
            <button
              className="bg-white text-[#4e2e8c] px-8 py-3 rounded-full font-bold text-base hover:bg-opacity-90 transition-all"
              aria-label="Browse the directory of classmates"
            >
              Browse the Directory
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
