import React from 'react';

interface ContactInfoProps {
  className?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ className = "" }) => {
  return (
    <section className={`flex flex-col items-stretch text-white ${className}`}>
      <h1 className="text-[rgba(217,81,100,1)] text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] xl:text-[64px] font-bold leading-tight sm:leading-[48px] md:leading-[56px] lg:leading-[66px] xl:leading-[70px] mr-0 sm:mr-4 md:mr-6 lg:mr-7">
        Who to bug
        <br />
        if something's broken
      </h1>

      <div className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal leading-relaxed mt-8 sm:mt-10 md:mt-12 lg:mt-[60px]">
        This project was built by a few classmates
        <br />
        who finally decided to do their homework
        <br />
        25 years late. We're still improving things
        <br />
        as we go.
        <br />
        <br />
        If you've got a suggestion, a photo, or
        <br />
        just want to say hello, reach out anytime.
        <br />
      </div>

      <address className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-medium leading-relaxed underline mt-6 sm:mt-7 md:mt-8 lg:mt-[35px] not-italic break-words">
        <a href="mailto:kenavo2025reunion@gmail.com" className="hover:text-gray-300 transition-colors">
          kenavo2025reunion@gmail.com
        </a>
        <br />
        <span className="no-underline">or </span>
        <a href="mailto:kenavo2k@gmail.com" className="hover:text-gray-300 transition-colors">
          kenavo2k@gmail.com
        </a>
      </address>
    </section>
  );
};
