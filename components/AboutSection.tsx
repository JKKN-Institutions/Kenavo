import React from 'react';

const AboutSection = () => {
  return (
    <section
      className="w-full relative z-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mt-0 pt-4 sm:pt-5 md:pt-6 lg:pt-7 xl:pt-8 pb-4 sm:pb-5 md:pb-6 bg-[rgba(78,46,140,1)]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1400px] mx-auto" style={{ background: 'transparent' }}>
        <div className="gap-3 sm:gap-4 md:gap-5 flex flex-col md:flex-row items-center md:items-center" style={{ background: 'transparent' }}>
          <div className="w-full md:w-[60%] lg:w-[65%] order-1 md:order-2">
            <div className="flex flex-col items-center font-bold text-center">
              <h1
                id="about-heading"
                className="text-[rgba(217,81,100,1)] text-[24px] sm:text-[40px] md:text-[50px] lg:text-[52px] xl:text-[58px] leading-[1.02] sm:leading-[1.02] md:leading-[1.02] lg:leading-[1.02] xl:leading-[1.02]"
              >
                134 boys.
                <br />
                One shared story.
              </h1>
              <p className="text-[rgba(254,249,232,1)] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[24px] xl:text-[26px] leading-[1.2] sm:leading-[1.2] md:leading-[1.2] lg:leading-[1.2] xl:leading-[1.2] mt-1 sm:mt-1 md:mt-1 lg:mt-2 xl:mt-2">
                This isn't just a website.
                <br />
                It's a memory you can scroll.
              </p>
            </div>
          </div>
          <div
            className="w-full md:w-[40%] lg:w-[35%] order-2 md:order-1 flex justify-center items-center"
            style={{
              background: 'transparent',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              border: 'none',
              outline: 'none'
            }}
          >
            <div style={{ background: 'transparent', padding: 0, margin: 0, width: '100%', maxWidth: '220px' }} className="sm:max-w-[240px] md:max-w-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b07c93a4fb548cd640b788c38cbfe06311634054?placeholderIfAbsent=true"
                alt="Class photo"
                className="w-full h-auto object-cover block"
                style={{
                  display: 'block',
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  boxShadow: 'none',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-[rgba(254,249,232,1)] text-[14px] sm:text-[18px] md:text-[22px] lg:text-[20px] xl:text-[22px] font-normal leading-[1.25] sm:leading-[1.25] md:leading-[1.25] lg:leading-[1.25] xl:leading-[1.25] text-center mt-1 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-3">
          A space for the Montfort Class of 2000 to reconnect, remember, and maybe
          laugh at those old photos. This is where we all meet again with our
          stories, our nicknames, and maybe a better haircut.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
