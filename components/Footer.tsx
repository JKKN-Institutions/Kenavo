import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[rgba(217,81,100,1)] flex w-full flex-col items-center justify-center px-20 py-[77px] max-md:max-w-full max-md:px-5" role="contentinfo">
      <div className="w-[665px] max-w-full">
        <h2 className="text-[rgba(254,249,232,1)] text-[54px] font-bold leading-[60px] mr-14 max-md:max-w-full max-md:text-[40px] max-md:leading-[49px] max-md:mr-2.5">
          Built by the boys of Kenavo <br />
          with grown-up skills and
          <br />
          leftover nostalgia.
          <br />
        </h2>
        <hr className="border w-full shrink-0 h-px mt-[26px] border-white border-solid" />
        <nav className="flex w-[470px] max-w-full items-stretch gap-[40px_55px] text-sm text-white font-normal leading-none mt-[31px]" role="navigation" aria-label="Footer navigation">
          <a href="#about" className="grow shrink w-[91px] hover:text-gray-200 transition-colors">
            ABOUT KENAVO
          </a>
          <a href="#directory" className="hover:text-gray-200 transition-colors">
            DIRECTORY
          </a>
          <a href="#gallery" className="hover:text-gray-200 transition-colors">
            GALLERY
          </a>
          <a href="#contact" className="hover:text-gray-200 transition-colors">
            CONTACT
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
