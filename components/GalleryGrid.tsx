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
    <section className="w-[931px] max-w-full ml-[42px] mt-[119px] max-md:mt-10" aria-label="Photo gallery">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        {galleryItems.slice(0, 3).map((item, index) => (
          <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
            <GalleryCard {...item} />
          </div>
        ))}
      </div>
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch mt-[27px]">
        {galleryItems.slice(3, 6).map((item, index) => (
          <div key={index + 3} className="w-[33%] max-md:w-full max-md:ml-0">
            <GalleryCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryGrid;
