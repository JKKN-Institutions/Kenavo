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
    <article className="bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full pt-[21px] pb-[39px] px-[19px] max-md:mt-[23px] max-md:pr-5 hover:bg-[rgba(44,23,82,0.9)] transition-colors">
      <div className="flex flex-col self-stretch relative aspect-[0.969]">
        {overlayImageSrc && (
          <img
            src={overlayImageSrc}
            alt=""
            className="absolute h-full w-full object-cover inset-0"
          />
        )}
        <img
          src={imageSrc}
          alt={`${title} gallery`}
          className="aspect-[0.97] object-contain w-full"
        />
      </div>
      <h2 className="text-[rgba(254,249,232,1)] text-[28px] leading-[1.2] mt-[21px]">
        {title}
      </h2>
      <Link
        href={href}
        className="text-[rgba(217,81,100,1)] text-lg leading-none underline mt-[19px] hover:text-[rgba(217,81,100,0.8)] transition-colors"
        aria-label={`View more ${title} photos`}
      >
        View More
      </Link>
    </article>
  );
};

export default GalleryCard;
