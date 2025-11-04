'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section className="w-full mt-12 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-[178px]" aria-labelledby="directory-heading">
      <div className="flex flex-col relative min-h-[450px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[640px] xl:min-h-[670px] w-full pt-4 sm:pt-6 md:pt-8">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/219b42832d68c68bc6d901fa348872161818ef2b?placeholderIfAbsent=true"
          alt="Directory section background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <div className="flex flex-col relative bg-blend-normal min-h-[430px] sm:min-h-[500px] md:min-h-[560px] lg:min-h-[620px] xl:min-h-[640px] w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-[70px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67114605b5b4499fa51946af498b30b56961a690?placeholderIfAbsent=true"
            alt="Directory overlay background"
            className="absolute h-full w-full object-cover inset-0"
          />
          <div className="relative z-10 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[111px]">
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col md:hidden items-center text-center space-y-4 sm:space-y-6">
              <h2
                id="directory-heading"
                className="text-[rgba(217,81,100,1)] text-[24px] sm:text-[32px] font-bold leading-tight px-3 sm:px-4"
              >
                From Yercaud to New York, here's what we're all up to now.
              </h2>
              <p className="text-[rgba(254,249,232,1)] text-[14px] sm:text-[18px] font-normal leading-relaxed px-3 sm:px-4">
                Browse profiles, spot familiar faces, revisit a few inside jokes. Whether you're checking in or catching up, this is where it all comes together.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-[300px] sm:max-w-md px-3 sm:px-4">
                <img
                  src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                  alt="Classmate photo 1"
                  className="aspect-[1] object-contain w-full rounded-lg shadow-md"
                />
                <img
                  src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                  alt="Classmate photo 2"
                  className="aspect-[1] object-contain w-full rounded-lg shadow-md"
                />
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
            <div className="hidden md:flex gap-3 lg:gap-5">
              <div className="w-[16%]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/20e63c88b0fe6dc3cf2778312d215c65bf2a7e23?placeholderIfAbsent=true"
                  alt="Portrait photo"
                  className="aspect-[0.55] object-contain w-full max-w-[180px] lg:max-w-[216px] mt-10 md:mt-12 lg:mt-16 xl:mt-[134px] rounded-lg shadow-lg"
                />
              </div>
              <div className="w-[84%] ml-3 lg:ml-5">
                <div className="relative flex w-full flex-col items-stretch">
                  <div className="w-full">
                    <div className="gap-3 lg:gap-5 flex">
                      <div className="w-5/12">
                        <div className="gap-3 lg:gap-5 flex flex-col">
                          <img
                            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                            alt="Classmate photo 1"
                            className="aspect-[1] object-contain w-full rounded-lg shadow-md"
                          />
                          <img
                            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                            alt="Classmate photo 2"
                            className="aspect-[1] object-contain w-full rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                      <div className="w-7/12 ml-3 lg:ml-5">
                        <div className="flex grow flex-col items-stretch mt-4 md:mt-6 lg:mt-8 xl:mt-[93px]">
                          <h2
                            id="directory-heading"
                            className="text-[rgba(217,81,100,1)] text-[28px] md:text-[32px] lg:text-[44px] xl:text-[52px] font-bold leading-tight md:leading-[34px] lg:leading-[46px] xl:leading-[49px]"
                          >
                            From Yercaud
                            <br />
                            to New York, here's what we're all up to now.
                          </h2>
                          <p className="text-[rgba(254,249,232,1)] text-[16px] md:text-[18px] lg:text-[24px] xl:text-[28px] font-normal leading-relaxed md:leading-7 lg:leading-8 xl:leading-9 mt-4 md:mt-5 lg:mt-6 xl:mt-[30px]">
                            Browse profiles, spot familiar faces,
                            <br />
                            revisit a few inside jokes. Whether you're
                            checking in or catching up,
                            <br />
                            this is where it all comes together.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/directory">
                    <button
                      className="bg-white self-center flex items-center justify-center w-[180px] md:w-[200px] lg:w-[220px] max-w-full text-base md:text-lg text-[rgba(78,46,140,1)] font-black px-5 md:px-6 py-2.5 md:py-3 rounded-[50px] mt-6 md:mt-8 lg:mt-10 xl:mt-[54px] hover:bg-gray-100 active:scale-95 transition-all"
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
