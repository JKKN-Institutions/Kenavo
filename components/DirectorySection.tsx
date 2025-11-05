'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section className="w-full mt-12 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-[140px] bg-[rgba(78,46,140,1)]" aria-labelledby="directory-heading">
      <div className="flex flex-col relative min-h-[600px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[750px] xl:min-h-[800px] w-full py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 overflow-hidden">
        <div className="flex flex-col relative bg-blend-normal h-full w-full px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24">
          <div className="relative z-10 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 max-w-[1400px] mx-auto w-full h-full flex flex-col justify-center">
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col md:hidden items-center text-center space-y-6 sm:space-y-8">
              <h2
                id="directory-heading"
                className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[36px] font-bold leading-tight px-3 sm:px-4"
              >
                From Yercaud to New York, here's what we're all up to now.
              </h2>
              <p className="text-[rgba(254,249,232,1)] text-[16px] sm:text-[20px] font-normal leading-relaxed px-3 sm:px-4">
                Browse profiles, spot familiar faces, revisit a few inside jokes. Whether you're checking in or catching up, this is where it all comes together.
              </p>

              {/* Mobile Circular Arrangement */}
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] h-[320px] sm:h-[380px] bg-[rgba(78,46,140,1)] rounded-lg">
                {/* Center: CLASS OF 2000 Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85px] sm:w-[95px] h-[85px] sm:h-[95px] z-20">
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
                <div className="absolute top-[22%] left-[10%] w-[62px] sm:w-[72px] h-[62px] sm:h-[72px] z-10">
                  <img
                    src="/images/alumni/profile-1.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Top Center - Profile 2 */}
                <div className="absolute top-[5%] left-[40%] w-[66px] sm:w-[76px] h-[66px] sm:h-[76px] z-10">
                  <img
                    src="/images/alumni/profile-2.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>

                {/* Top Right - Profile 3 */}
                <div className="absolute top-[14%] right-[10%] w-[63px] sm:w-[73px] h-[63px] sm:h-[73px] z-10">
                  <img
                    src="/images/alumni/profile-3.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Middle Left - Profile 4 */}
                <div className="absolute top-[60%] left-[6%] -translate-y-1/2 w-[66px] sm:w-[76px] h-[66px] sm:h-[76px] z-10">
                  <img
                    src="/images/alumni/profile-4.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Middle Right - Profile 5 */}
                <div className="absolute top-[52%] right-[6%] -translate-y-1/2 w-[64px] sm:w-[74px] h-[64px] sm:h-[74px] z-10">
                  <img
                    src="/images/alumni/profile-5.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Bottom Center - Profile 6 */}
                <div className="absolute bottom-[6%] left-[43%] w-[67px] sm:w-[77px] h-[67px] sm:h-[77px] z-10">
                  <img
                    src="/images/alumni/profile-6.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
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
              <div className="w-[42%] relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:min-h-[550px] overflow-hidden bg-[rgba(78,46,140,1)]">
                {/* Center: CLASS OF 2000 Badge (focal point) */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] md:w-[120px] lg:w-[135px] xl:w-[145px] h-[110px] md:h-[120px] lg:h-[135px] xl:h-[145px] z-20">
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
                <div className="absolute top-[25%] left-[8%] w-[90px] md:w-[100px] lg:w-[115px] xl:w-[125px] h-[90px] md:h-[100px] lg:h-[115px] xl:h-[125px] z-10">
                  <img
                    src="/images/alumni/profile-1.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Top Center - Profile 2 */}
                <div className="absolute top-[5%] left-[38%] w-[95px] md:w-[105px] lg:w-[120px] xl:w-[130px] h-[95px] md:h-[105px] lg:h-[120px] xl:h-[130px] z-10">
                  <img
                    src="/images/alumni/profile-2.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                    style={{ objectPosition: 'center 20%' }}
                  />
                </div>

                {/* Top Right - Profile 3 */}
                <div className="absolute top-[15%] right-[8%] w-[92px] md:w-[102px] lg:w-[117px] xl:w-[127px] h-[92px] md:h-[102px] lg:h-[117px] xl:h-[127px] z-10">
                  <img
                    src="/images/alumni/profile-3.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Middle Left - Profile 4 */}
                <div className="absolute top-[60%] left-[4%] -translate-y-1/2 w-[95px] md:w-[105px] lg:w-[120px] xl:w-[130px] h-[95px] md:h-[105px] lg:h-[120px] xl:h-[130px] z-10">
                  <img
                    src="/images/alumni/profile-4.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Middle Right - Profile 5 */}
                <div className="absolute top-[52%] right-[5%] -translate-y-1/2 w-[93px] md:w-[103px] lg:w-[118px] xl:w-[128px] h-[93px] md:h-[103px] lg:h-[118px] xl:h-[128px] z-10">
                  <img
                    src="/images/alumni/profile-5.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Bottom Center - Profile 6 */}
                <div className="absolute bottom-[8%] left-[42%] w-[97px] md:w-[107px] lg:w-[122px] xl:w-[132px] h-[97px] md:h-[107px] lg:h-[122px] xl:h-[132px] z-10">
                  <img
                    src="/images/alumni/profile-6.png"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="w-[58%] flex flex-col">
                <div className="flex flex-col items-stretch text-left">
                  <h2
                    id="directory-heading"
                    className="text-[rgba(217,81,100,1)] text-[32px] md:text-[38px] lg:text-[50px] xl:text-[58px] font-bold leading-tight md:leading-[42px] lg:leading-[54px] xl:leading-[62px]"
                  >
                    From Yercaud
                    <br />
                    to New York, here's what we're all up to now.
                  </h2>
                  <p className="text-[rgba(254,249,232,1)] text-[18px] md:text-[20px] lg:text-[26px] xl:text-[30px] font-normal leading-relaxed md:leading-8 lg:leading-9 xl:leading-10 mt-4 md:mt-5 lg:mt-6 xl:mt-7">
                    Browse profiles, spot familiar faces,
                    <br />
                    revisit a few inside jokes. Whether you're
                    checking in or catching up,
                    <br />
                    this is where it all comes together.
                  </p>
                </div>
                <Link href="/directory">
                  <button
                    className="bg-white self-start flex items-center justify-center w-[180px] md:w-[200px] lg:w-[220px] max-w-full text-base md:text-lg text-[rgba(78,46,140,1)] font-black px-5 md:px-6 py-2.5 md:py-3 rounded-[50px] mt-6 md:mt-8 lg:mt-10 xl:mt-12 hover:bg-gray-100 active:scale-95 transition-all"
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
    </section>
  );
};

export default DirectorySection;
