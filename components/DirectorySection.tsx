'use client';

import React from 'react';
import Link from 'next/link';

const DirectorySection = () => {
  return (
    <section className="w-full mt-8 sm:mt-10 md:mt-14 lg:mt-16 xl:mt-20 overflow-visible" aria-labelledby="directory-heading">
      <div className="flex flex-col relative min-h-[400px] sm:min-h-[420px] md:min-h-[450px] lg:min-h-[480px] xl:min-h-[500px] max-h-[90vh] w-full py-6 sm:py-7 md:py-8 lg:py-9 xl:py-10">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/219b42832d68c68bc6d901fa348872161818ef2b?placeholderIfAbsent=true"
          alt="Directory section background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <div className="flex flex-col relative bg-blend-normal h-full w-full pl-0 pr-6 sm:pr-10 md:pr-16 lg:pr-24 xl:pr-32">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67114605b5b4499fa51946af498b30b56961a690?placeholderIfAbsent=true"
            alt="Directory overlay background"
            className="absolute h-full w-full object-cover inset-0 left-0 right-0 opacity-30"
          />
          <div className="relative z-10 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-8 max-w-[1400px] mx-auto w-full h-full flex flex-col justify-center">
            {/* Mobile/Tablet Layout */}
            <div className="flex flex-col md:hidden items-center text-center space-y-4 sm:space-y-6">
              <h2
                id="directory-heading"
                className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[36px] font-bold leading-tight px-3 sm:px-4"
              >
                From Yercaud to New York, here's what we're all up to now.
              </h2>
              <p className="text-[rgba(254,249,232,1)] text-[16px] sm:text-[20px] font-normal leading-relaxed px-3 sm:px-4">
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
            <div className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 items-center">
              <div className="w-[16%] flex items-center justify-start -ml-4 md:-ml-6 lg:-ml-8 xl:-ml-10">
                <img
                  src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/20e63c88b0fe6dc3cf2778312d215c65bf2a7e23?placeholderIfAbsent=true"
                  alt="Portrait photo"
                  className="aspect-square object-cover w-full max-w-[160px] lg:max-w-[180px] xl:max-w-[200px] shadow-lg"
                  style={{ borderRadius: '0 100% 100% 0' }}
                />
              </div>
              <div className="w-[84%]">
                <div className="relative flex w-full flex-col items-stretch">
                  <div className="w-full">
                    <div className="gap-4 lg:gap-6 xl:gap-8 flex items-start">
                      <div className="w-5/12">
                        <div className="gap-4 lg:gap-5 xl:gap-6 flex flex-col">
                          <img
                            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                            alt="Classmate photo 1"
                            className="aspect-[1] object-cover w-full rounded-lg shadow-md"
                          />
                          <img
                            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                            alt="Classmate photo 2"
                            className="aspect-[1] object-cover w-full rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                      <div className="w-7/12">
                        <div className="flex grow flex-col items-stretch text-left">
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
                      </div>
                    </div>
                  </div>
                  <Link href="/directory">
                    <button
                      className="bg-white self-center flex items-center justify-center w-[180px] md:w-[200px] lg:w-[220px] max-w-full text-base md:text-lg text-[rgba(78,46,140,1)] font-black px-5 md:px-6 py-2.5 md:py-3 rounded-[50px] mt-4 md:mt-5 lg:mt-6 xl:mt-8 hover:bg-gray-100 active:scale-95 transition-all"
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
