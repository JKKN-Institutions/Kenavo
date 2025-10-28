import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col bg-blend-lighten relative min-h-[570px] mt-[-19px] w-full items-center text-center justify-center px-20 py-[177px] max-md:max-w-full max-md:px-5 max-md:py-[100px]">
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/115ddd54e05b77a2ea33189caca30adae9b52a68?placeholderIfAbsent=true"
        className="absolute h-full w-full object-cover inset-0"
        alt="Kenavo campus background"
      />
      <div className="relative flex mb-[-31px] w-[807px] max-w-full flex-col items-stretch max-md:mb-2.5">
        <h1 className="text-white text-[78px] font-bold leading-[1.1] max-md:max-w-full max-md:text-[40px]">
          134 Names. 134 Journeys.
        </h1>
        <p className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-9 self-center mt-[23px] max-md:max-w-full">
          Some profiles are packed. Some are still blank.But every name here
          walked the same corridors, sat in the same classrooms, and heard the
          same chapel bell.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
