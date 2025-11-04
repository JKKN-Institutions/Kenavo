import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      className="bg-[rgba(217,81,100,1)] flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 sm:py-12 md:py-14 lg:py-16 xl:py-[77px]"
      role="contentinfo"
    >
      <div className="w-full max-w-[665px]">
        <h2 className="text-[rgba(254,249,232,1)] text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[54px] font-bold leading-tight sm:leading-[32px] md:leading-[42px] lg:leading-[52px] xl:leading-[60px] text-center md:text-left">
          Built by the boys of Kenavo with grown-up skills and leftover nostalgia.
        </h2>
        <hr className="border w-full h-px mt-5 sm:mt-6 md:mt-8 lg:mt-[26px] border-white border-solid" />
        <nav
          className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-[55px] text-[10px] sm:text-xs md:text-sm text-white font-normal leading-none mt-5 sm:mt-6 md:mt-8 lg:mt-[31px] justify-center md:justify-start"
          role="navigation"
          aria-label="Footer navigation"
        >
          <Link href="/about" className="hover:text-gray-200 hover:underline transition-all whitespace-nowrap">
            ABOUT KENAVO
          </Link>
          <Link href="/directory" className="hover:text-gray-200 hover:underline transition-all whitespace-nowrap">
            DIRECTORY
          </Link>
          <Link href="/gallery" className="hover:text-gray-200 hover:underline transition-all whitespace-nowrap">
            GALLERY
          </Link>
          <Link href="/contact" className="hover:text-gray-200 hover:underline transition-all whitespace-nowrap">
            CONTACT
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
