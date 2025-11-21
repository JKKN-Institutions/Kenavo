import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="flex flex-col relative w-full items-center justify-center py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6 bg-[rgba(78,46,140,1)]"
      aria-label="Hero section"
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/30b758abb6f1f9790a8cb900740efa46ee7e3338?placeholderIfAbsent=true"
        alt="Hero background"
        className="w-full max-w-full sm:max-w-full md:max-w-[70%] lg:max-w-[60%] xl:max-w-[55%] 2xl:max-w-[50%] object-contain relative brightness-90"
      />
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/e2ebf4b66c657fc90801441604a035e59b991b3d?placeholderIfAbsent=true"
        alt="Kenavo main logo"
        className="aspect-[3.01] object-contain w-[28%] sm:w-[45%] md:w-[46%] lg:w-[48%] xl:w-[50%] 2xl:w-[50%] max-w-[112px] sm:max-w-[225px] md:max-w-[290px] lg:max-w-[340px] xl:max-w-[390px] 2xl:max-w-[430px] absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-lg"
      />
    </section>
  );
};

export default HeroSection;
