import React from 'react';
import GalleryCard from './GalleryCard';

const GalleryGrid: React.FC = () => {
  const galleryItems = [
    {
      title: "Group",
      imageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c1ff0fa0275654dc9945cdba44e458882ca5cdcf?placeholderIfAbsent=true",
      href: "/gallery/group"
    },
    {
      title: "Sports",
      imageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c1ff0fa0275654dc9945cdba44e458882ca5cdcf?placeholderIfAbsent=true",
      overlayImageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0cc6b72e80f672ae4bd339fabb8fe37c97df7032?placeholderIfAbsent=true",
      href: "/gallery/sports"
    },
    {
      title: "Hostel",
      imageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c1ff0fa0275654dc9945cdba44e458882ca5cdcf?placeholderIfAbsent=true",
      href: "/gallery/hostel"
    },
    {
      title: "Tours",
      imageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c1ff0fa0275654dc9945cdba44e458882ca5cdcf?placeholderIfAbsent=true",
      href: "/gallery/tours"
    },
    {
      title: "Events",
      imageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c1ff0fa0275654dc9945cdba44e458882ca5cdcf?placeholderIfAbsent=true",
      overlayImageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0cc6b72e80f672ae4bd339fabb8fe37c97df7032?placeholderIfAbsent=true",
      href: "/gallery/events"
    },
    {
      title: "Annual day",
      imageSrc: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/c1ff0fa0275654dc9945cdba44e458882ca5cdcf?placeholderIfAbsent=true",
      href: "/gallery/annual-day"
    }
  ];

  return (
    <section className="w-full max-w-[931px] mx-auto px-4 sm:px-6 md:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-[119px]" aria-label="Photo gallery">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {galleryItems.map((item, index) => (
          <div key={index} className="w-full">
            <GalleryCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryGrid;
