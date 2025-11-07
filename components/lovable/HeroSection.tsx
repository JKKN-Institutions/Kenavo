import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden bg-[rgba(78,46,140,1)]"
      style={{ minHeight: 'clamp(400px, 60vh, 800px)' }}
      aria-label="Hero section"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/30b758abb6f1f9790a8cb900740efa46ee7e3338?placeholderIfAbsent=true"
          alt="Hero background"
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Logo - Centered and Responsive */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 flex items-center justify-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/e2ebf4b66c657fc90801441604a035e59b991b3d?placeholderIfAbsent=true"
          alt="Kenavo main logo"
          className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[876px] h-auto object-contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;
