import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="flex flex-col relative w-full items-center justify-center py-5 sm:py-6 md:py-7 lg:py-8 xl:py-10 bg-[rgba(78,46,140,1)]"
      aria-label="Hero section"
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/30b758abb6f1f9790a8cb900740efa46ee7e3338?placeholderIfAbsent=true"
        alt="Hero background"
        className="w-full max-w-[92%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[86%] xl:max-w-[85%] object-contain relative brightness-90"
      />
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/e2ebf4b66c657fc90801441604a035e59b991b3d?placeholderIfAbsent=true"
        alt="Kenavo main logo"
        className="aspect-[3.01] object-contain w-[60%] sm:w-[65%] md:w-[65%] lg:w-[60%] xl:w-[58%] max-w-[280px] sm:max-w-[350px] md:max-w-[480px] lg:max-w-[600px] xl:max-w-[700px] absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-lg"
      />
    </section>
  );
};

export default HeroSection;
