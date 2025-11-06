import React from 'react';

interface ContactInfoProps {
  className?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ className = "" }) => {
  return (
    <section className={`flex flex-col items-center md:items-start text-white text-center md:text-left ${className}`}>
      <h1 className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[38px] md:text-[44px] lg:text-[52px] xl:text-[60px] font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-[1.15]">
        Who to bug
        <br />
        if something's broken
      </h1>

      <div className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[19px] font-normal leading-[1.6] lg:leading-[1.7] mt-5 sm:mt-6 md:mt-7 lg:mt-9 xl:mt-10">
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
      </div>

      <address className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[19px] font-medium leading-[1.7] underline mt-4 sm:mt-5 md:mt-6 lg:mt-8 xl:mt-10 not-italic break-words flex flex-col items-center md:items-start gap-2 lg:gap-3">
        <a href="mailto:kenavo2025reunion@gmail.com" className="hover:text-gray-300 transition-colors">
          kenavo2025reunion@gmail.com
        </a>
        <div className="no-underline text-sm lg:text-base">or</div>
        <a href="mailto:kenavo2k@gmail.com" className="hover:text-gray-300 transition-colors">
          kenavo2k@gmail.com
        </a>
      </address>
    </section>
  );
};
