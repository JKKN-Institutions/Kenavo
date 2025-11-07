import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      id="contact"
      className="w-full bg-[rgba(217,81,100,1)] py-12 sm:py-16 md:py-20"
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Message */}
        <h2
          className="text-[rgba(254,249,232,1)] font-bold leading-tight text-center md:text-left mb-6 sm:mb-8"
          style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', lineHeight: '1.2' }}
        >
          Built by the boys of Kenavo with grown-up skills and leftover nostalgia.
        </h2>

        {/* Divider */}
        <hr className="border-white border-t w-full my-6 sm:my-8" />

        {/* Navigation Links */}
        <nav
          className="flex flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base text-white font-normal"
          role="navigation"
          aria-label="Footer navigation"
        >
          <Link href="#about" className="hover:text-gray-200 transition-colors whitespace-nowrap">
            ABOUT KENAVO
          </Link>
          <Link href="#directory" className="hover:text-gray-200 transition-colors whitespace-nowrap">
            DIRECTORY
          </Link>
          <Link href="#gallery" className="hover:text-gray-200 transition-colors whitespace-nowrap">
            GALLERY
          </Link>
          <Link href="#contact" className="hover:text-gray-200 transition-colors whitespace-nowrap">
            CONTACT
          </Link>
        </nav>

        {/* Copyright or Additional Info (Optional) */}
        <div className="text-center md:text-left mt-8 text-white/80 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Montfort School Class of 2000. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
