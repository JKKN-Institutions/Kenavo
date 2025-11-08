'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySectionV2 = () => {
  return (
    <section
      id="directory"
      className="w-full h-[320px] md:h-[380px] lg:h-[420px] bg-[rgba(78,46,140,1)] relative overflow-hidden"
      aria-labelledby="directory-heading"
    >
      {/* Mountain Background - Full Section */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/mountain-background.png"
          alt=""
          className="absolute w-full h-full object-contain object-bottom md:object-right-bottom opacity-60 md:opacity-70 scale-110 md:scale-100"
        />
      </div>

      {/* Main Content Grid - FILLS the frame */}
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">

        {/* LEFT SIDE - Portrait Collage with Badge */}
        <div className="relative h-full flex items-start justify-center">
          <div className="relative w-full h-full max-w-[500px]">

            {/* Portrait 1 - Top Left */}
            <div className="absolute top-[-10%] left-[-15%] z-10">
              <img
                src="/images/profile-1.png"
                alt="Classmate 1"
                className="w-[85px] h-[85px] md:w-[140px] md:h-[140px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 2 - Top Center */}
            <div className="absolute top-[4%] left-[31%] z-10">
              <img
                src="/images/profile-2.png"
                alt="Classmate 2"
                className="w-[95px] h-[95px] md:w-[150px] md:h-[150px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 3 - Top Right (LARGEST) */}
            <div className="absolute top-[6%] left-[65%] z-10">
              <img
                src="/images/profile-3.png"
                alt="Classmate 3"
                className="w-[120px] h-[120px] md:w-[190px] md:h-[190px] rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 4 - Bottom Left */}
            <div className="absolute bottom-[25%] left-[-31%] z-10">
              <img
                src="/images/profile-6.png"
                alt="Classmate 4"
                className="w-[150px] h-[150px] md:w-[220px] md:h-[220px] rounded-full object-contain border-4 border-white shadow-xl"
              />
            </div>

            {/* Portrait 5 - Bottom Center */}
            <div className="absolute bottom-[-20px] md:bottom-[-35px] left-[22%] z-10">
              <img
                src="/images/profile-5.png"
                alt="Classmate 5"
                className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-full object-contain border-4 border-white shadow-xl scale-90"
              />
            </div>

            {/* Portrait 6 - Bottom Right */}
            <div className="absolute bottom-[-70px] md:bottom-[-110px] left-[72%] z-10 w-[140px] h-[140px] md:w-[220px] md:h-[220px]">
              <img
                src="/images/profile-4.png"
                alt="Classmate 6"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl aspect-square"
              />
            </div>

            {/* Badge - "CLASS OF 2000 MONTFORT" */}
            <div className="absolute top-[38%] left-[18%] z-20" style={{transform: 'rotate(-15deg)'}}>
              <div className="relative w-[85px] h-[85px] md:w-[110px] md:h-[110px]">
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
                  <div className="text-[rgba(217,81,100,1)] text-[8px] md:text-[10px] font-bold tracking-wider">
                    CLASS OF
                  </div>
                  <div className="text-[rgba(217,81,100,1)] text-[28px] md:text-[38px] font-black leading-none">
                    2000
                  </div>
                  <div className="text-[rgba(217,81,100,1)] text-[7px] md:text-[9px] font-bold tracking-widest">
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
          <div className="px-2 md:px-12 lg:px-16 py-10 md:py-0 space-y-6 md:space-y-8">

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
