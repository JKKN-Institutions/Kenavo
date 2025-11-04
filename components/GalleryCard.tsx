import React from 'react';
import Link from 'next/link';

interface GalleryCardProps {
  title: string;
  imageSrc: string;
  overlayImageSrc?: string;
  href: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  title,
  imageSrc,
  overlayImageSrc,
  href
}) => {
  return (
    <article className="bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full pt-4 sm:pt-5 md:pt-[21px] pb-8 sm:pb-9 md:pb-[39px] px-4 sm:px-[19px] rounded-lg hover:bg-[rgba(54,33,92,1)] hover:scale-[1.02] transition-all shadow-lg">
      <div className="flex flex-col self-stretch relative aspect-[0.969]">
        {overlayImageSrc && (
          <img
            src={overlayImageSrc}
            alt=""
            className="absolute h-full w-full object-cover inset-0 rounded"
          />
        )}
        <img
          src={imageSrc}
          alt={`${title} gallery`}
          className="aspect-[0.97] object-contain w-full rounded"
        />
      </div>
      <h2 className="text-[rgba(254,249,232,1)] text-[20px] sm:text-[24px] md:text-[28px] leading-[1.2] mt-4 sm:mt-5 md:mt-[21px] font-semibold">
        {title}
      </h2>
      <Link
        href={href}
        className="text-[rgba(217,81,100,1)] text-base sm:text-lg leading-none underline mt-3 sm:mt-4 md:mt-[19px] hover:text-[rgba(237,101,120,1)] transition-colors"
        aria-label={`View more ${title} photos`}
      >
        View More
      </Link>
    </article>
  );
};

export default GalleryCard;
