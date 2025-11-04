'use client';

import React from 'react';
import Link from 'next/link';

const StorySection = () => {
  return (
    <section
      className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-12 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-[140px]"
      aria-labelledby="story-heading"
    >
      <div className="max-w-[930px] mx-auto">
        <div className="gap-4 sm:gap-5 md:gap-6 lg:gap-8 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-6/12 order-2 md:order-1">
            <div className="flex flex-col items-stretch text-center md:text-left">
              <h2
                id="story-heading"
                className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[38px] md:text-[46px] lg:text-[56px] xl:text-[64px] font-bold leading-tight sm:leading-[42px] md:leading-[50px] lg:leading-[60px] xl:leading-[63px]"
              >
                Who we are.
                <br />
                And why we're
                <br />
                still showing up.
              </h2>
              <p className="text-white text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px] xl:text-[28px] font-normal leading-relaxed sm:leading-7 md:leading-8 lg:leading-9 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
                We're the Montfort School Class of 2000, a batch of 134 boys who grew up together on a hill in Yercaud. Some of us lived in dorms. Some walked in every morning. All of us walked out in 2000 with stories we still talk about.
              </p>
              <Link href="/about">
                <button
                  className="bg-white flex items-center justify-center text-sm sm:text-base text-[rgba(78,46,140,1)] font-black px-6 sm:px-8 md:px-10 lg:px-[45px] py-2.5 sm:py-3 rounded-[50px] mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-[61px] hover:bg-gray-100 active:scale-95 transition-all mx-auto md:mx-0 w-fit"
                  aria-label="Read our complete story"
                >
                  Our Story
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-6/12 md:ml-4 lg:ml-5 order-1 md:order-2">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/f7128c57aa28e3dfcba51c7ffa2fe11814b7129c?placeholderIfAbsent=true"
              alt="School memories collage"
              className="aspect-[0.79] object-contain w-full max-w-[280px] sm:max-w-[350px] md:max-w-full mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
