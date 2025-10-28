import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white flex w-full flex-col items-center text-sm text-black font-semibold leading-none justify-center px-[70px] py-[15px] max-md:max-w-full max-md:px-5">
      <div className="flex w-full max-w-[1310px] items-stretch gap-5 flex-wrap justify-between max-md:max-w-full">
        <Link href="/">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/1786e1fe8a5eb8ea616d009a830f24f5eda8fa46?placeholderIfAbsent=true"
            alt="Kenavo Logo"
            className="aspect-[1.98] object-contain w-[231px] shrink-0 max-w-full cursor-pointer"
          />
        </Link>
        <nav className="flex items-stretch gap-[40px_86px] flex-wrap my-auto max-md:max-w-full" role="navigation" aria-label="Main navigation">
          <Link href="/about" className="basis-auto hover:text-gray-600 transition-colors">
            ABOUT KENAVO
          </Link>
          <Link href="/directory" className="hover:text-gray-600 transition-colors">
            DIRECTORY
          </Link>
          <Link href="/gallery" className="hover:text-gray-600 transition-colors">
            GALLERY
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
