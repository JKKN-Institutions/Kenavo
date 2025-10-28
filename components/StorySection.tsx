'use client';

import React from 'react';

const StorySection = () => {
  const handleStoryClick = () => {
    // Navigate to story page
    console.log('Navigate to our story');
  };

  return (
    <section className="self-center w-[930px] max-w-full mt-[140px] max-md:mt-10" aria-labelledby="story-heading">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-6/12 max-md:w-full max-md:ml-0">
          <div className="flex grow flex-col items-stretch mt-[5px] max-md:max-w-full max-md:mt-[38px]">
            <h2 
              id="story-heading"
              className="text-[rgba(217,81,100,1)] text-[64px] font-bold leading-[63px] max-md:max-w-full max-md:text-[40px] max-md:leading-[43px] max-md:mr-[9px]"
            >
              Who we are.
              <br />
              And why we're
              <br />
              still showing up.
            </h2>
            <p className="text-white text-[28px] font-normal leading-9 mt-10 max-md:max-w-full">
              We're the Montfort School
              <br />
              Class of 2000, a batch of 134 boys
              <br />
              who grew up together on a hill in Yercaud. Some of us lived in
              dorms. Some walked in every morning.
              <br />
              All of us walked out in 2000 with stories we still talk about.
            </p>
            <button 
              onClick={handleStoryClick}
              className="bg-white flex flex-col items-stretch text-lg text-[rgba(78,46,140,1)] font-black leading-none justify-center mt-[61px] px-[45px] py-3 rounded-[50px] max-md:mt-10 max-md:px-5 hover:bg-gray-100 transition-colors"
              aria-label="Read our complete story"
            >
              Our Story
            </button>
          </div>
        </div>
        <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/f7128c57aa28e3dfcba51c7ffa2fe11814b7129c?placeholderIfAbsent=true"
            alt="School memories collage"
            className="aspect-[0.79] object-contain w-full grow max-md:max-w-full max-md:mt-[33px]"
          />
        </div>
      </div>
    </section>
  );
};

export default StorySection;
