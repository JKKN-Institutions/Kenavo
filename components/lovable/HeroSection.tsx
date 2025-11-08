import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="flex flex-col relative w-full items-center justify-center py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 bg-[rgba(78,46,140,1)]"
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
        className="aspect-[3.01] object-contain w-[55%] sm:w-[58%] md:w-[60%] lg:w-[62%] xl:w-[65%] 2xl:w-[65%] max-w-[240px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-[450px] xl:max-w-[520px] 2xl:max-w-[580px] absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-lg"
      />
    </section>
  );
};

export default HeroSection;
