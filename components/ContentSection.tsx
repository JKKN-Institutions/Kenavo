import React from 'react';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  content,
  imageSrc,
  imageAlt,
  imagePosition,
  className = ''
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <section
      className={`self-center w-full max-w-[974px] mx-auto px-4 sm:px-6 md:px-8 lg:px-6 xl:px-0 relative z-10 ${className}`}
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      style={{ background: 'transparent' }}
    >
      <div className="gap-6 sm:gap-8 md:gap-10 flex flex-col md:flex-row md:items-start md:justify-between" style={{ background: 'transparent' }}>
        {/* Image Container */}
        <div
          className={`
            ${isImageLeft ? 'w-full md:w-[44%] order-2 md:order-1' : 'w-full md:w-[54%] order-2 md:order-2'}
            flex-shrink-0 overflow-visible flex justify-center items-start
            ${isImageLeft ? 'mt-0 md:mt-[10px]' : 'mt-0'}
          `}
          style={{
            background: 'transparent',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
            border: 'none',
            outline: 'none'
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto object-cover max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[380px] block"
            style={{
              display: 'block',
              background: 'transparent',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              border: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Text Content Container */}
        <div className={
          isImageLeft
            ? 'w-full md:w-[56%] order-1 md:order-2 md:ml-3 lg:ml-4'
            : 'w-full md:w-[46%] order-1 md:order-1 md:mr-3 lg:mr-4'
        }>
          <article className="mt-0">
            <header>
              <h2
                id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
                className={`
                  text-[rgba(217,81,100,1)] font-bold text-center md:text-left
                  text-[26px] leading-[1.1]
                  sm:text-[32px] sm:leading-[1.1]
                  md:text-[40px] md:leading-[1.1]
                  lg:text-[44px] lg:leading-[1.1]
                  xl:text-[48px] xl:leading-[1.1]
                  mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-6
                  ${isImageLeft ? 'md:max-w-[395px]' : ''}
                `}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </header>
            <div
              className={`
                text-white font-normal text-center md:text-left
                text-[14px] leading-[1.6]
                sm:text-[15px] sm:leading-[1.65]
                md:text-[16px] md:leading-[1.7]
                lg:text-[17px] lg:leading-[1.7]
                xl:text-[18px] xl:leading-[1.7]
                mt-3 sm:mt-4 md:mt-5 lg:mt-5 xl:mt-6
              `}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </div>
    </section>
  );
};
