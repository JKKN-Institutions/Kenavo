'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white flex w-full flex-col text-sm text-black font-semibold leading-none px-0 py-3 sm:py-4 md:py-[15px] sticky top-0 z-50">
      <div className="flex w-full max-w-[1400px] items-center justify-between px-2 sm:px-4 md:px-10 lg:px-[70px] mx-auto">
        <Link href="/">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/1786e1fe8a5eb8ea616d009a830f24f5eda8fa46?placeholderIfAbsent=true"
            alt="Kenavo Logo"
            className="aspect-[1.98] object-contain w-[120px] sm:w-[150px] md:w-[200px] lg:w-[231px] cursor-pointer transition-all"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[86px]" role="navigation" aria-label="Main navigation">
          <Link href="/about" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs lg:text-sm">
            ABOUT KENAVO
          </Link>
          <Link href="/directory" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs lg:text-sm">
            DIRECTORY
          </Link>
          <Link href="/gallery" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs lg:text-sm">
            GALLERY
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs lg:text-sm">
            CONTACT
          </Link>
        </nav>

        {/* Tablet Navigation */}
        <nav className="hidden md:flex lg:hidden items-center gap-6" role="navigation" aria-label="Tablet navigation">
          <Link href="/about" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs">
            ABOUT
          </Link>
          <Link href="/directory" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs">
            DIRECTORY
          </Link>
          <Link href="/gallery" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs">
            GALLERY
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors whitespace-nowrap text-xs">
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
