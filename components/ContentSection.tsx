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
      className={`self-center w-full max-w-[974px] mx-auto px-4 sm:px-6 md:px-8 lg:px-4 xl:px-0 relative z-10 ${className}`}
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      style={{ background: 'transparent' }}
    >
      <div className="gap-3 sm:gap-4 md:gap-5 flex flex-col md:flex-row md:items-start md:justify-between" style={{ background: 'transparent' }}>
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
            className="w-full h-auto object-cover max-w-[280px] sm:max-w-[350px] md:max-w-full block"
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
                  text-[28px] leading-[1.05]
                  sm:text-[36px] sm:leading-[1.05]
                  md:text-[46px] md:leading-[1.05]
                  lg:text-[48px] lg:leading-[1.05]
                  xl:text-[54px] xl:leading-[1.05]
                  mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5
                  ${isImageLeft ? 'md:max-w-[395px]' : ''}
                `}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </header>
            <div
              className={`
                text-white font-normal text-center md:text-left
                text-[13px] leading-[1.4]
                sm:text-[16px] sm:leading-[1.45]
                md:text-[18px] md:leading-[1.45]
                lg:text-[18px] lg:leading-[1.4]
                xl:text-[20px] xl:leading-[1.4]
                mt-2 sm:mt-3 md:mt-4 lg:mt-4 xl:mt-4
              `}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </div>
    </section>
  );
};
