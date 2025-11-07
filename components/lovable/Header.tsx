'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white w-full sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/1786e1fe8a5eb8ea616d009a830f24f5eda8fa46?placeholderIfAbsent=true"
              alt="Kenavo Logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" role="navigation" aria-label="Main navigation">
            <Link
              href="#about"
              className="text-xs lg:text-sm font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              ABOUT KENAVO
            </Link>
            <Link
              href="#directory"
              className="text-xs lg:text-sm font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              DIRECTORY
            </Link>
            <Link
              href="#gallery"
              className="text-xs lg:text-sm font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              GALLERY
            </Link>
            <Link
              href="#contact"
              className="text-xs lg:text-sm font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              CONTACT
            </Link>
          </nav>

          {/* Navigation - Mobile (Horizontal Scroll) */}
          <nav className="md:hidden flex items-center gap-4 overflow-x-auto scrollbar-hide" role="navigation" aria-label="Mobile navigation">
            <Link
              href="#about"
              className="text-[10px] sm:text-xs font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              ABOUT
            </Link>
            <Link
              href="#directory"
              className="text-[10px] sm:text-xs font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              DIRECTORY
            </Link>
            <Link
              href="#gallery"
              className="text-[10px] sm:text-xs font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              GALLERY
            </Link>
            <Link
              href="#contact"
              className="text-[10px] sm:text-xs font-semibold text-black hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              CONTACT
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
