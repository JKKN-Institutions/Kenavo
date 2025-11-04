import React from 'react';

export const AboutHeroSection: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10 relative z-10" aria-label="Hero section">
      <div className="max-w-[1400px] mx-auto">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67ba6d61a583986c6407ee841ce249fcc7d94f3e?placeholderIfAbsent=true"
          alt="Montfort School panoramic view"
          className="aspect-[1.93] object-cover w-full
                     sm:aspect-[2] md:aspect-[1.95] lg:aspect-[1.93]
                     rounded-lg md:rounded-xl shadow-xl"
        />
      </div>
    </section>
  );
};
