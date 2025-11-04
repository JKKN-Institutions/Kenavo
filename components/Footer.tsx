import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      className="bg-[rgba(217,81,100,1)] flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 sm:py-7 md:py-8 lg:py-10 xl:py-12"
      role="contentinfo"
    >
      <div className="w-full max-w-[1400px] mx-auto">
        <h2 className="text-[rgba(254,249,232,1)] text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[54px] font-bold leading-tight sm:leading-[32px] md:leading-[42px] lg:leading-[52px] xl:leading-[60px] text-center md:text-left">
          Built by the boys of Kenavo with grown-up skills and leftover nostalgia.
        </h2>

        {/* Copyright for mobile view */}
        <div className="lg:hidden text-center mt-6 text-white/80 text-xs">
          © {new Date().getFullYear()} Kenavo. All rights reserved.
        </div>

        {/* Divider and navigation - hidden on mobile, visible on desktop */}
        <hr className="hidden lg:block border w-full h-px mt-4 sm:mt-5 md:mt-6 lg:mt-6 border-white border-solid" />
        <nav
          className="hidden lg:flex flex-col sm:flex-row items-center sm:items-stretch gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-[55px] text-[10px] sm:text-xs md:text-sm text-white font-normal leading-none mt-4 sm:mt-5 md:mt-6 lg:mt-6 justify-center md:justify-start"
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
