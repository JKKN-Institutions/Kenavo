import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="flex flex-col relative min-h-[350px] sm:min-h-[450px] md:min-h-[600px] lg:min-h-[750px] xl:min-h-[800px] w-full items-center justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-12 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-20 sm:pb-28 md:pb-40 lg:pb-56 xl:pb-[464px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20"
      aria-label="Hero section"
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/30b758abb6f1f9790a8cb900740efa46ee7e3338?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0 brightness-90"
      />
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/e2ebf4b66c657fc90801441604a035e59b991b3d?placeholderIfAbsent=true"
        alt="Kenavo main logo"
        className="aspect-[3.01] object-contain w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[876px] mb-[-15px] sm:mb-[-25px] md:mb-[-45px] lg:mb-[-70px] xl:mb-[-93px] relative z-10 drop-shadow-lg"
      />
    </section>
  );
};

export default HeroSection;
