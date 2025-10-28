import React from 'react';

export const AboutHeroSection: React.FC = () => {
  return (
    <section className="w-full" aria-label="Hero section">
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67ba6d61a583986c6407ee841ce249fcc7d94f3e?placeholderIfAbsent=true"
        alt="Montfort School panoramic view"
        className="aspect-[1.93] object-contain w-full max-md:max-w-full"
      />
    </section>
  );
};
