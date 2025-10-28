import React from 'react';

const HeroSection = () => {
  return (
    <section className="flex flex-col relative min-h-[800px] w-full items-center mt-[54px] pt-[45px] pb-[464px] px-20 max-md:max-w-full max-md:mt-10 max-md:pb-[100px] max-md:px-5" aria-label="Hero section">
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/30b758abb6f1f9790a8cb900740efa46ee7e3338?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/e2ebf4b66c657fc90801441604a035e59b991b3d?placeholderIfAbsent=true"
        alt="Kenavo main logo"
        className="aspect-[3.01] object-contain w-[876px] mb-[-93px] max-w-full max-md:mb-2.5 relative z-10"
      />
    </section>
  );
};

export default HeroSection;
