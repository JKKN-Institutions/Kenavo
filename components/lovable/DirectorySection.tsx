'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section
      id="directory"
      className="w-full overflow-hidden bg-[rgba(78,46,140,1)] relative"
      aria-labelledby="directory-heading"
    >
      {/* Mountain Background - Full Section */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mountain-background.png"
          alt=""
          className="w-full h-full object-cover object-center md:object-right opacity-80 md:opacity-90"
        />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent to-[rgba(78,46,140,0.3)]"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-full relative z-10">
        {/* LEFT SIDE - Portrait Collage with Center Badge */}
        <div className="relative h-[280px] xs:h-[320px] sm:h-[380px] md:h-[525px] lg:h-[575px] xl:h-[625px] overflow-hidden order-1">
          {/* Subtle background overlay for mobile */}
          <div className="absolute inset-0 bg-[rgba(78,46,140,0.4)] md:bg-transparent z-[1]"></div>

          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            <div className="relative w-full h-full max-w-[500px] transform translate-x-[20px] md:translate-x-[50px]">

              {/* Portrait 1 - Top Left */}
              <div className="absolute top-[8%] left-[5%] z-20">
                <img
                  src="/images/profile-1.png"
                  alt="Classmate 1"
                  className="w-[55px] h-[55px] xs:w-[65px] xs:h-[65px] sm:w-[85px] sm:h-[85px] md:w-[105px] md:h-[105px] rounded-full object-cover border-[3px] sm:border-[5px] border-white shadow-2xl"
                />
              </div>

              {/* Portrait 2 - Top Center */}
              <div className="absolute top-[5%] left-[35%] z-20">
                <img
                  src="/images/profile-2.png"
                  alt="Classmate 2"
                  className="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[80px] sm:h-[80px] md:w-[95px] md:h-[95px] rounded-full object-cover border-[3px] sm:border-[5px] border-white shadow-2xl"
                />
              </div>

              {/* Portrait 3 - Center Right (LARGEST) */}
              <div className="absolute top-[22%] right-[8%] z-30">
                <img
                  src="/images/profile-3.png"
                  alt="Classmate 3"
                  className="w-[85px] h-[85px] xs:w-[100px] xs:h-[100px] sm:w-[125px] sm:h-[125px] md:w-[155px] md:h-[155px] rounded-full object-cover border-[3px] sm:border-[5px] border-white shadow-2xl"
                />
              </div>

              {/* Portrait 4 - Left Side (Large portrait at edge) */}
              <div className="absolute top-[35%] left-0 z-20 transform -translate-x-[60%] xs:-translate-x-[70%] md:-translate-x-[80%]">
                <img
                  src="/images/profile-6.png"
                  alt="Classmate 4"
                  className="w-[140px] h-[140px] xs:w-[170px] xs:h-[170px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[250px] lg:h-[250px] rounded-full object-contain border-[3px] sm:border-[5px] border-white shadow-2xl"
                />
              </div>

              {/* Portrait 5 - Bottom Left (with dramatic bottom crop effect) */}
              <div className="absolute bottom-[15%] left-[15%] z-20 transform translate-y-[15%]">
                <img
                  src="/images/profile-5.png"
                  alt="Classmate 5"
                  className="w-[75px] h-[75px] xs:w-[90px] xs:h-[90px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[150px] lg:h-[150px] rounded-full object-cover border-[3px] sm:border-[5px] border-white shadow-2xl"
                />
              </div>

              {/* Portrait 6 - Bottom Center (with dramatic bottom crop effect) */}
              <div className="absolute bottom-[15%] left-[49%] z-20 transform translate-y-[15%]">
                <img
                  src="/images/profile-4.png"
                  alt="Classmate 6"
                  className="w-[85px] h-[85px] xs:w-[100px] xs:h-[100px] sm:w-[125px] sm:h-[125px] md:w-[155px] md:h-[155px] rounded-full object-cover border-[3px] sm:border-[5px] border-white shadow-2xl"
                />
              </div>

              {/* Center Badge - "CLASS OF MONTFORT 2000" */}
              <div className="absolute top-[42%] left-[22%] -translate-y-1/2 z-40">
                <div className="relative w-[70px] h-[70px] xs:w-[85px] xs:h-[85px] sm:w-[105px] sm:h-[105px] md:w-[125px] md:h-[125px]">
                  {/* Starburst background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Starburst rays */}
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
                    <div className="text-[rgba(217,81,100,1)] text-[7px] xs:text-[9px] sm:text-[11px] md:text-[12px] font-bold tracking-wider">
                      CLASS OF
                    </div>
                    <div className="text-[rgba(217,81,100,1)] text-[24px] xs:text-[32px] sm:text-[40px] md:text-[44px] font-black leading-none">
                      2000
                    </div>
                    <div className="text-[rgba(217,81,100,1)] text-[6px] xs:text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-widest">
                      MONTFORT
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Text Content */}
        <div className="relative min-h-[350px] md:h-[525px] lg:h-[575px] xl:h-[625px] order-2">
          {/* Background overlay for mobile - ensures text is readable */}
          <div className="absolute inset-0 bg-[rgba(78,46,140,0.65)] md:bg-transparent z-[1]"></div>

          {/* Decorative Birds - Top Right */}
          <div className="absolute top-[8%] right-[12%] z-10 opacity-60 hidden sm:block">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
              <path d="M10 20 Q15 15, 20 20 Q25 25, 30 20" stroke="rgba(217,81,100,0.4)" strokeWidth="2" fill="none"/>
              <path d="M50 15 Q55 10, 60 15 Q65 20, 70 15" stroke="rgba(217,81,100,0.4)" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          {/* Text Content */}
          <div className="relative flex flex-col justify-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-14 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16 z-20 h-full">
            <div className="max-w-xl mx-auto md:mx-0 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Heading */}
              <h2
                id="directory-heading"
                className="text-[rgba(217,81,100,1)] font-bold leading-tight text-center md:text-left"
                style={{ fontSize: 'clamp(22px, 5vw, 48px)', lineHeight: '1.3' }}
              >
                From Yercaud to New York, here's what we're all up to now.
              </h2>

              {/* Description */}
              <p
                className="text-[rgba(254,249,232,1)] font-normal leading-relaxed text-center md:text-left"
                style={{ fontSize: 'clamp(14px, 2.2vw, 20px)', lineHeight: '1.6' }}
              >
                Browse profiles, spot familiar faces, revisit a few inside jokes.
                Whether you're checking in or catching up, this is where it all comes together.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center md:justify-start pt-2 sm:pt-4">
                <Link href="/directory">
                  <button className="bg-white text-[rgba(78,46,140,1)] font-black text-sm sm:text-base md:text-lg px-12 sm:px-16 md:px-20 py-3 sm:py-4 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[rgba(78,46,140,1)]">
                    Browse the Directory
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
