'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section className="w-full mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6 bg-[rgba(78,46,140,1)]" aria-labelledby="directory-heading">
      <div className="flex flex-col relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px] w-full py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 overflow-hidden">
        <div className="flex flex-col relative bg-blend-normal h-full w-full">
          <div className="relative z-10 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 max-w-[1400px] mx-auto w-full h-full flex flex-col justify-center px-4 sm:px-10 md:px-16 lg:px-20 xl:px-24">
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col md:hidden items-center text-center space-y-5 sm:space-y-6">
              <h2
                id="directory-heading"
                className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[36px] font-bold leading-tight px-2 sm:px-4"
              >
                From Yercaud to New York, here's what we're all up to now.
              </h2>
              <p className="text-[rgba(254,249,232,1)] text-[16px] sm:text-[20px] font-normal leading-tight px-2 sm:px-4">
                Browse profiles, spot familiar faces, revisit a few inside jokes. Whether you're checking in or catching up, this is where it all comes together.
              </p>

              {/* Mobile Circular Arrangement */}
              <div className="relative w-full max-w-[260px] sm:max-w-[320px] h-[260px] sm:h-[320px] bg-transparent rounded-lg">
                {/* Center: CLASS OF 2000 Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] sm:w-[85px] h-[75px] sm:h-[85px] z-20">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full bg-[rgba(217,81,100,1)] flex items-center justify-center shadow-xl">
                      <div className="text-center rotate-[8deg]">
                        <div className="text-white text-[7px] sm:text-[8px] font-bold uppercase tracking-wide leading-tight">
                          CLASS OF
                        </div>
                        <div className="text-white text-[24px] sm:text-[28px] font-black leading-none mt-0.5">
                          2000
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Left - Profile 1 */}
                <div className="absolute top-[22%] left-[10%] w-[52px] sm:w-[60px] h-[52px] sm:h-[60px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-1.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Top Center - Profile 2 */}
                <div className="absolute top-[5%] left-[40%] w-[54px] sm:w-[62px] h-[54px] sm:h-[62px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-2.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>

                {/* Top Right - Profile 3 */}
                <div className="absolute top-[14%] right-[10%] w-[53px] sm:w-[61px] h-[53px] sm:h-[61px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-3.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Middle Left - Profile 4 */}
                <div className="absolute top-[60%] left-[6%] -translate-y-1/2 w-[54px] sm:w-[62px] h-[54px] sm:h-[62px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-4.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Middle Right - Profile 5 */}
                <div className="absolute top-[52%] right-[6%] -translate-y-1/2 w-[53px] sm:w-[61px] h-[53px] sm:h-[61px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-5.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Bottom Center - Profile 6 */}
                <div className="absolute bottom-[6%] left-[43%] w-[55px] sm:w-[63px] h-[55px] sm:h-[63px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-6.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>
              </div>

              <Link href="/directory">
                <button
                  className="bg-white flex items-center justify-center text-sm sm:text-base text-[rgba(78,46,140,1)] font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-[50px] hover:bg-gray-100 active:scale-95 transition-all"
                  aria-label="Browse the directory of classmates"
                >
                  Browse the Directory
                </button>
              </Link>
            </div>

            {/* Desktop/Tablet Layout */}
            <div className="hidden md:flex gap-8 lg:gap-12 xl:gap-16 items-center">
              {/* Left: Artistic Image Collage - Circular Arrangement */}
              <div className="w-[42%] relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:min-h-[550px] overflow-hidden bg-transparent">
                {/* Center: CLASS OF 2000 Badge (focal point) */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95px] md:w-[105px] lg:w-[115px] xl:w-[125px] h-[95px] md:h-[105px] lg:h-[115px] xl:h-[125px] z-20">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full bg-[rgba(217,81,100,1)] flex items-center justify-center shadow-xl">
                      <div className="text-center rotate-[8deg]">
                        <div className="text-white text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] font-bold uppercase tracking-wide leading-tight">
                          CLASS OF
                        </div>
                        <div className="text-white text-[28px] md:text-[32px] lg:text-[36px] xl:text-[38px] font-black leading-none mt-1">
                          2000
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Left - Profile 1 */}
                <div className="absolute top-[25%] left-[8%] w-[75px] md:w-[85px] lg:w-[95px] xl:w-[105px] h-[75px] md:h-[85px] lg:h-[95px] xl:h-[105px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-1.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Top Center - Profile 2 */}
                <div className="absolute top-[5%] left-[38%] w-[78px] md:w-[88px] lg:w-[98px] xl:w-[108px] h-[78px] md:h-[88px] lg:h-[98px] xl:h-[108px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-2.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>

                {/* Top Right - Profile 3 */}
                <div className="absolute top-[15%] right-[8%] w-[76px] md:w-[86px] lg:w-[96px] xl:w-[106px] h-[76px] md:h-[86px] lg:h-[96px] xl:h-[106px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-3.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Middle Left - Profile 4 */}
                <div className="absolute top-[60%] left-[4%] -translate-y-1/2 w-[78px] md:w-[88px] lg:w-[98px] xl:w-[108px] h-[78px] md:h-[88px] lg:h-[98px] xl:h-[108px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-4.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Middle Right - Profile 5 */}
                <div className="absolute top-[52%] right-[5%] -translate-y-1/2 w-[77px] md:w-[87px] lg:w-[97px] xl:w-[107px] h-[77px] md:h-[87px] lg:h-[97px] xl:h-[107px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-5.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>

                {/* Bottom Center - Profile 6 */}
                <div className="absolute bottom-[8%] left-[42%] w-[79px] md:w-[89px] lg:w-[99px] xl:w-[109px] h-[79px] md:h-[89px] lg:h-[99px] xl:h-[109px] z-10 overflow-hidden rounded-full">
                  <img
                    src="/images/alumni/profile-6.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg scale-110"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="w-[58%] flex flex-col">
                <div className="flex flex-col items-stretch text-center">
                  <h2
                    id="directory-heading"
                    className="text-[rgba(217,81,100,1)] text-[32px] md:text-[32px] lg:text-[36px] xl:text-[38px] font-bold leading-tight md:leading-[40px] lg:leading-[50px] xl:leading-[58px]"
                  >
                    From Yercaud
                    <br />
                    to New York, here's what we're all up to now.
                  </h2>
                  <p className="text-[rgba(254,249,232,1)] text-[18px] md:text-[18px] lg:text-[18px] xl:text-[19px] font-normal leading-relaxed md:leading-7 lg:leading-8 xl:leading-9 mt-2 md:mt-2 lg:mt-3 xl:mt-3">
                    Browse profiles, spot familiar faces,
                    <br />
                    revisit a few inside jokes. Whether you're
                    checking in or catching up,
                    <br />
                    this is where it all comes together.
                  </p>
                </div>
                <div className="flex justify-center mt-3 md:mt-4 lg:mt-5 xl:mt-6">
                  <Link href="/directory">
                    <button
                      className="bg-white flex items-center justify-center w-[180px] md:w-[200px] lg:w-[220px] max-w-full text-base md:text-lg text-[rgba(78,46,140,1)] font-black px-5 md:px-6 py-2.5 md:py-3 rounded-[50px] hover:bg-gray-100 active:scale-95 transition-all"
                      aria-label="Browse the directory of classmates"
                    >
                      Browse the Directory
                    </button>
                  </Link>
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
