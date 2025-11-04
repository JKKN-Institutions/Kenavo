import React from 'react';

const AboutSection = () => {
  return (
    <section
      className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-[106px]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[951px] mx-auto">
        <div className="gap-4 sm:gap-5 md:gap-6 lg:gap-8 flex flex-col md:flex-row items-center md:items-stretch">
          <div className="w-full md:w-[35%] lg:w-[38%]">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b07c93a4fb548cd640b788c38cbfe06311634054?placeholderIfAbsent=true"
              alt="Class photo"
              className="aspect-[0.99] object-contain w-full max-w-[240px] sm:max-w-[280px] md:max-w-full mx-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-[65%] lg:w-[62%] md:ml-4 lg:ml-5">
            <div className="flex flex-col items-stretch font-bold my-auto text-center md:text-left">
              <h1
                id="about-heading"
                className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[40px] md:text-[50px] lg:text-[68px] xl:text-[78px] leading-tight sm:leading-[44px] md:leading-[54px] lg:leading-[72px] xl:leading-[73px]"
              >
                134 boys.
                <br />
                One shared story.
              </h1>
              <p className="text-[rgba(254,249,232,1)] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[30px] xl:text-[34px] leading-tight sm:leading-[24px] md:leading-[28px] lg:leading-[34px] xl:leading-[38px] mt-3 sm:mt-4 md:mt-5 lg:mt-[22px]">
                This isn't just a website.
                <br />
                It's a memory you can scroll.
              </p>
            </div>
          </div>
        </div>
        <p className="text-[rgba(254,249,232,1)] text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[28px] font-normal leading-relaxed sm:leading-7 md:leading-8 lg:leading-9 text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-[41px]">
          A space for the Montfort Class of 2000 to reconnect, remember, and maybe
          laugh at those old photos. This is where we all meet again with our
          stories, our nicknames, and maybe a better haircut.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
