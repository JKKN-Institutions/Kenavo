import React from 'react';

const AboutSection = () => {
  return (
    <section
      id="about"
      className="w-full bg-[rgba(78,46,140,1)] py-12 sm:py-16 md:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Image Column */}
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b07c93a4fb548cd640b788c38cbfe06311634054?placeholderIfAbsent=true"
              alt="Class photo"
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-full aspect-square object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Text Column */}
          <div className="md:col-span-3 text-center md:text-left space-y-4 sm:space-y-6">
            <h1
              id="about-heading"
              className="text-[rgba(217,81,100,1)] font-bold leading-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 78px)', lineHeight: '1.1' }}
            >
              134 boys.
              <br />
              One shared story.
            </h1>
            <p
              className="text-[rgba(254,249,232,1)] font-bold leading-snug"
              style={{ fontSize: 'clamp(20px, 3vw, 34px)', lineHeight: '1.2' }}
            >
              This isn't just a website.
              <br />
              It's a memory you can scroll.
            </p>
          </div>
        </div>

        {/* Bottom Description */}
        <p
          className="text-[rgba(254,249,232,1)] font-normal text-center mt-8 sm:mt-10 md:mt-12 lg:mt-14 leading-relaxed max-w-4xl mx-auto"
          style={{ fontSize: 'clamp(16px, 2vw, 28px)', lineHeight: '1.5' }}
        >
          A space for the Montfort Class of 2000 to reconnect, remember, and maybe
          laugh at those old photos. This is where we all meet again with our
          stories, our nicknames, and maybe a better haircut.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
