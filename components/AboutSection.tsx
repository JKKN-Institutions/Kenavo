import React from 'react';

const AboutSection = () => {
  return (
    <section
      className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-[106px]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 flex flex-col md:flex-row items-center md:items-center">
          <div className="w-full md:w-[40%] lg:w-[35%]">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b07c93a4fb548cd640b788c38cbfe06311634054?placeholderIfAbsent=true"
              alt="Class photo"
              className="aspect-[0.99] object-contain w-full max-w-[300px] sm:max-w-[350px] md:max-w-full mx-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-[60%] lg:w-[65%]">
            <div className="flex flex-col items-stretch font-bold text-center md:text-left">
              <h1
                id="about-heading"
                className="text-[rgba(217,81,100,1)] text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] xl:text-[84px] leading-tight sm:leading-[48px] md:leading-[60px] lg:leading-[76px] xl:leading-[88px]"
              >
                134 boys.
                <br />
                One shared story.
              </h1>
              <p className="text-[rgba(254,249,232,1)] text-[18px] sm:text-[22px] md:text-[28px] lg:text-[34px] xl:text-[38px] leading-relaxed sm:leading-[28px] md:leading-[34px] lg:leading-[42px] xl:leading-[46px] mt-4 sm:mt-5 md:mt-6 lg:mt-8">
                This isn't just a website.
                <br />
                It's a memory you can scroll.
              </p>
            </div>
          </div>
        </div>
        <p className="text-[rgba(254,249,232,1)] text-[16px] sm:text-[20px] md:text-[26px] lg:text-[30px] xl:text-[32px] font-normal leading-relaxed sm:leading-8 md:leading-9 lg:leading-10 xl:leading-[44px] text-center md:text-left mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20">
          A space for the Montfort Class of 2000 to reconnect, remember, and maybe
          laugh at those old photos. This is where we all meet again with our
          stories, our nicknames, and maybe a better haircut.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
