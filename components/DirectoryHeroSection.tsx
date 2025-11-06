import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col bg-blend-lighten relative min-h-[140px] sm:min-h-[280px] md:min-h-[380px] lg:min-h-[480px] w-full items-center text-center justify-center px-4 sm:px-10 md:px-16 lg:px-20 py-6 sm:py-10 md:py-16 lg:py-24">
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/115ddd54e05b77a2ea33189caca30adae9b52a68?placeholderIfAbsent=true"
        className="absolute h-full w-full object-cover inset-0"
        alt="Kenavo campus background"
      />
      <div className="relative flex w-full max-w-[807px] flex-col items-stretch px-0 sm:px-6">
        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[78px] font-bold leading-tight sm:leading-tight md:leading-[1.1]">
          134 boys.
          <br />
          134 Journeys.
        </h1>
        <p className="text-[rgba(254,249,232,1)] text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] font-normal leading-normal sm:leading-relaxed md:leading-9 self-center mt-2 sm:mt-5 md:mt-6 lg:mt-[23px]">
          Some profiles are packed. Some are still blank. But every name here
          walked the same corridors, sat in the same classrooms, and heard the
          same chapel bell.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
