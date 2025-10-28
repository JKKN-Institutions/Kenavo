import React from 'react';

interface ContactInfoProps {
  className?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ className = "" }) => {
  return (
    <section className={`flex flex-col items-stretch text-white max-md:mt-10 ${className}`}>
      <h1 className="text-[rgba(217,81,100,1)] text-[64px] font-bold leading-[70px] mr-7 max-md:text-[40px] max-md:leading-[48px] max-md:mr-2.5">
        Who to bug
        <br />
        if something's broken
      </h1>
      
      <div className="text-lg font-normal leading-[23px] mt-[60px] max-md:mt-10">
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
      
      <address className="text-[28px] font-medium leading-9 underline mt-[35px] not-italic">
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
