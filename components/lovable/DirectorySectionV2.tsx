'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySectionV2 = () => {
  return (
    <section
      id="directory"
      className="w-full h-[420px] md:h-[480px] lg:h-[520px] bg-[rgba(78,46,140,1)] relative overflow-hidden"
      aria-labelledby="directory-heading"
    >
      {/* Mountain Background - CONSTRAINED to bottom 60% of frame */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/mountain-background.png"
          alt=""
          className="absolute bottom-0 left-0 w-full h-[60%] object-contain object-bottom opacity-30"
        />
      </div>

      {/* Main Content Grid - FILLS the frame */}
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">

        {/* LEFT SIDE - Portrait Collage with Badge */}
        <div className="relative h-full flex items-center justify-center">
          <div className="relative w-full h-[85%] max-w-[500px]">

            {/* Portrait 1 - Top Left (CUT OFF at edge) */}
            <div className="absolute top-[8%] left-0 -translate-x-[35%] z-10">
              <img
                src="/images/profile-1.png"
                alt="Classmate 1"
                className="w-[75px] h-[75px] md:w-[95px] md:h-[95px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 2 - Top Center-Left (small) */}
            <div className="absolute top-[5%] left-[22%] z-10">
              <img
                src="/images/profile-2.png"
                alt="Classmate 2"
                className="w-[70px] h-[70px] md:w-[85px] md:h-[85px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 3 - Top Center (small) */}
            <div className="absolute top-[8%] left-[42%] z-10">
              <img
                src="/images/profile-6.png"
                alt="Classmate 3"
                className="w-[65px] h-[65px] md:w-[80px] md:h-[80px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 4 - Top Center-Right (LARGEST - MAIN FOCAL POINT) */}
            <div className="absolute top-[15%] right-[8%] z-10">
              <img
                src="/images/profile-3.png"
                alt="Classmate 4"
                className="w-[130px] h-[130px] md:w-[165px] md:h-[165px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 5 - Bottom Center-Left (medium) */}
            <div className="absolute bottom-[18%] left-[25%] z-10">
              <img
                src="/images/profile-5.png"
                alt="Classmate 5"
                className="w-[95px] h-[95px] md:w-[120px] md:h-[120px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 6 - Bottom Center (medium-large) */}
            <div className="absolute bottom-[15%] right-[22%] z-10">
              <img
                src="/images/profile-4.png"
                alt="Classmate 6"
                className="w-[105px] h-[105px] md:w-[135px] md:h-[135px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Center Badge - "CLASS OF MONTFORT 2000" (near top-left portrait) */}
            <div className="absolute top-[32%] left-[18%] z-20">
              <div className="relative w-[95px] h-[95px] md:w-[125px] md:h-[125px]">
                {/* Starburst background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="95" fill="white" />
                    {[...Array(24)].map((_, i) => (
                      <line
                        key={i}
                        x1="100"
                        y1="100"
                        x2={100 + 90 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={100 + 90 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="rgba(217,81,100,1)"
                        strokeWidth="2"
                      />
                    ))}
                    <circle cx="100" cy="100" r="85" fill="white" stroke="rgba(217,81,100,1)" strokeWidth="3" />
                  </svg>
                </div>

                {/* Badge text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[rgba(217,81,100,1)] text-[8px] md:text-[11px] font-bold tracking-wider">
                    CLASS OF
                  </div>
                  <div className="text-[rgba(217,81,100,1)] text-[32px] md:text-[42px] font-black leading-none">
                    2000
                  </div>
                  <div className="text-[rgba(217,81,100,1)] text-[7px] md:text-[10px] font-bold tracking-widest">
                    MONTFORT
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - Text Content */}
        <div className="relative h-full flex items-center justify-center">

          {/* Decorative Birds - Top Right */}
          <div className="absolute top-[8%] right-[12%] z-10 opacity-50 hidden md:block">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
              <path d="M10 20 Q15 15, 20 20 Q25 25, 30 20" stroke="rgba(217,81,100,0.5)" strokeWidth="2" fill="none"/>
              <path d="M50 15 Q55 10, 60 15 Q65 20, 70 15" stroke="rgba(217,81,100,0.5)" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          {/* Text Content */}
          <div className="px-6 md:px-12 lg:px-16 py-10 md:py-0 space-y-6 md:space-y-8">

            {/* Heading */}
            <h2
              id="directory-heading"
              className="text-[rgba(217,81,100,1)] font-bold leading-tight text-center md:text-left"
              style={{ fontSize: 'clamp(24px, 5vw, 48px)', lineHeight: '1.3' }}
            >
              From Yercaud to New York, here's what we're all up to now.
            </h2>

            {/* Description */}
            <p
              className="text-[rgba(254,249,232,1)] font-normal leading-relaxed text-center md:text-left"
              style={{ fontSize: 'clamp(15px, 2vw, 20px)', lineHeight: '1.6' }}
            >
              Browse profiles, spot familiar faces, revisit a few inside jokes.
              Whether you're checking in or catching up, this is where it all comes together.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center md:justify-start pt-4">
              <Link href="/directory">
                <button className="bg-white text-[rgba(78,46,140,1)] font-black text-sm md:text-base lg:text-lg px-12 md:px-16 lg:px-20 py-3 md:py-4 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg">
                  Browse the Directory
                </button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default DirectorySectionV2;
