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
                {/* Center: 2000 ALUMNI Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] sm:w-[140px] h-[120px] sm:h-[140px] z-30">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full bg-[rgba(217,81,100,1)] flex items-center justify-center shadow-xl">
                      <div className="text-center">
                        <div className="text-white text-[32px] sm:text-[36px] font-black leading-none">
                          2000
                        </div>
                        <div className="text-white text-[11px] sm:text-[13px] font-bold uppercase tracking-wider mt-1">
                          ALUMNI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[70px] sm:w-[80px] h-[70px] sm:h-[80px] z-20">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Right */}
                <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[70px] sm:w-[80px] h-[70px] sm:h-[80px] z-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Bottom */}
                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[75px] sm:w-[85px] h-[75px] sm:h-[85px] z-20">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/ff89d2ee719f706c663f406428367b65c718ac20?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Left */}
                <div className="absolute top-1/2 left-[8%] -translate-y-1/2 w-[70px] sm:w-[80px] h-[70px] sm:h-[80px] z-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/20e63c88b0fe6dc3cf2778312d215c65bf2a7e23?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* Bottom left */}
                <div className="absolute bottom-[18%] left-[15%] w-[65px] sm:w-[75px] h-[65px] sm:h-[75px] z-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0cc6b72e80f672ae4bd339fabb8fe37c97df7032?placeholderIfAbsent=true"
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
                {/* Center: 2000 ALUMNI Badge (focal point) */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px] h-[160px] md:h-[180px] lg:h-[200px] xl:h-[220px] z-30">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full bg-[rgba(217,81,100,1)] flex items-center justify-center shadow-xl">
                      <div className="text-center">
                        <div className="text-white text-[38px] md:text-[42px] lg:text-[46px] xl:text-[50px] font-black leading-none">
                          2000
                        </div>
                        <div className="text-white text-[13px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold uppercase tracking-wider mt-1">
                          ALUMNI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 12 o'clock - Top center */}
                <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[110px] md:w-[120px] lg:w-[135px] xl:w-[150px] h-[110px] md:h-[120px] lg:h-[135px] xl:h-[150px] z-20">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* 2 o'clock - Top right */}
                <div className="absolute top-[10%] right-[3%] w-[105px] md:w-[115px] lg:w-[130px] xl:w-[145px] h-[105px] md:h-[115px] lg:h-[130px] xl:h-[145px] z-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* 6 o'clock - Bottom center */}
                <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[115px] md:w-[125px] lg:w-[140px] xl:w-[155px] h-[115px] md:h-[125px] lg:h-[140px] xl:h-[155px] z-20">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/ff89d2ee719f706c663f406428367b65c718ac20?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* 8 o'clock - Bottom left */}
                <div className="absolute bottom-[14%] left-[3%] w-[105px] md:w-[115px] lg:w-[130px] xl:w-[145px] h-[105px] md:h-[115px] lg:h-[130px] xl:h-[145px] z-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0cc6b72e80f672ae4bd339fabb8fe37c97df7032?placeholderIfAbsent=true"
                    alt="Classmate profile"
                    className="rounded-full aspect-square object-cover w-full h-full shadow-lg"
                  />
                </div>

                {/* 10 o'clock - Left */}
                <div className="absolute top-[42%] left-[1%] w-[110px] md:w-[120px] lg:w-[135px] xl:w-[150px] h-[110px] md:h-[120px] lg:h-[135px] xl:h-[150px] z-10">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/20e63c88b0fe6dc3cf2778312d215c65bf2a7e23?placeholderIfAbsent=true"
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
