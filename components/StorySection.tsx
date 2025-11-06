'use client';

import React from 'react';
import Link from 'next/link';

const StorySection = () => {
  return (
    <section
      className="w-full mt-2 sm:mt-3 md:mt-5 lg:mt-7 xl:mt-9"
      aria-labelledby="story-heading"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-6/12 order-1 md:order-1">
            <div className="flex flex-col items-stretch text-center">
              <h2
                id="story-heading"
                className="text-[rgba(217,81,100,1)] text-[26px] sm:text-[42px] md:text-[52px] lg:text-[64px] xl:text-[72px] font-bold leading-tight sm:leading-[42px] md:leading-[52px] lg:leading-[62px] xl:leading-[70px]"
              >
                Who we are.
                <br />
                And why we're
                <br />
                still showing up.
              </h2>
              <p className="text-white text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-normal leading-snug sm:leading-6 md:leading-7 lg:leading-8 xl:leading-9 mt-2 sm:mt-3 md:mt-3 lg:mt-4 xl:mt-5">
                We're the Montfort School Class of 2000, a batch of 134 boys who grew up together on a hill in Yercaud. Some of us lived in dorms. Some walked in every morning. All of us walked out in 2000 with stories we still talk about.
              </p>
              <div className="flex justify-center mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7">
                <Link href="/about">
                  <button
                    className="bg-white flex items-center justify-center text-sm sm:text-base text-[rgba(78,46,140,1)] font-black px-6 sm:px-8 md:px-10 lg:px-[45px] py-2.5 sm:py-3 rounded-[50px] hover:bg-gray-100 active:scale-95 transition-all w-fit"
                    aria-label="Read our complete story"
                  >
                    Our Story
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-6/12 md:ml-4 lg:ml-5 order-2 md:order-2">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/f7128c57aa28e3dfcba51c7ffa2fe11814b7129c?placeholderIfAbsent=true"
                alt="School memories collage"
                className="aspect-[0.79] object-cover w-full max-w-[280px] sm:max-w-[350px] md:max-w-full mx-auto rounded-lg shadow-lg scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
