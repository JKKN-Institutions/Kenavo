import React from 'react';

const AboutSection = () => {
  return (
    <section className="self-center w-[951px] max-w-full ml-[11px] mt-[106px] max-md:mt-10" aria-labelledby="about-heading">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-[35%] max-md:w-full max-md:ml-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b07c93a4fb548cd640b788c38cbfe06311634054?placeholderIfAbsent=true"
            alt="Class photo"
            className="aspect-[0.99] object-contain w-full grow max-md:mt-10"
          />
        </div>
        <div className="w-[65%] ml-5 max-md:w-full max-md:ml-0">
          <div className="flex flex-col self-stretch items-stretch font-bold my-auto max-md:max-w-full max-md:mt-10">
            <h1 
              id="about-heading"
              className="text-[rgba(217,81,100,1)] text-[78px] leading-[73px] max-md:max-w-full max-md:text-[40px] max-md:leading-[42px]"
            >
              134 boys.
              <br />
              One shared story.
            </h1>
            <p className="text-[rgba(254,249,232,1)] text-[34px] leading-[38px] mt-[22px] max-md:max-w-full">
              This isn't just a website.
              <br />
              It's a memory you can scroll.
            </p>
          </div>
        </div>
      </div>
      <p className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-9 text-center self-center mt-[41px] max-md:max-w-full max-md:mt-10">
        A space for the Montfort Class of 2000 to reconnect, remember, and maybe
        laugh at those old photos.. This is where we all meet again with our
        stories, our nicknames, and maybe a better haircut.
      </p>
    </section>
  );
};

export default AboutSection;
