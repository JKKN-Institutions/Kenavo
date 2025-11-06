import React from 'react';

export const AboutHeroSection: React.FC = () => {
  return (
    <section
      className="w-full hero-section"
      aria-label="Hero section"
      style={{ background: 'transparent', padding: 0, margin: 0 }}
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67ba6d61a583986c6407ee841ce249fcc7d94f3e?placeholderIfAbsent=true"
        alt="Montfort School panoramic view"
        className="w-full h-auto object-contain block"
        style={{ display: 'block', background: 'transparent', padding: 0, margin: 0 }}
      />
    </section>
  );
};
