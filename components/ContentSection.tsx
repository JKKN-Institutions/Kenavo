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
      className={`self-center w-full max-w-[974px] px-4 sm:px-6 md:px-8 lg:px-4 xl:px-0 relative z-10 ${className}`}
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="gap-4 sm:gap-5 md:gap-6 lg:gap-5 flex flex-col md:flex-row md:items-start">
        {/* Image Container */}
        <div className={
          isImageLeft
            ? 'w-full md:w-[44%] md:order-1 flex-shrink-0'
            : 'w-full md:w-[54%] md:order-2 flex-shrink-0'
        }>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`
              ${isImageLeft ? 'aspect-[0.69]' : 'aspect-[0.76]'}
              object-cover w-full
              max-w-[280px] sm:max-w-[350px] md:max-w-full
              mx-auto md:mx-0 rounded-lg shadow-lg
              ${isImageLeft ? 'mt-0 md:mt-[15px]' : 'mt-0'}
            `}
          />
        </div>

        {/* Text Content Container */}
        <div className={
          isImageLeft
            ? 'w-full md:w-[56%] md:order-2 md:ml-4 lg:ml-5'
            : 'w-full md:w-[46%] md:order-1 md:mr-4 lg:mr-5'
        }>
          <article className="mt-4 sm:mt-6 md:mt-0">
            <header>
              <h2
                id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
                className={`
                  text-[rgba(217,81,100,1)] font-bold
                  text-[32px] leading-[34px]
                  sm:text-[42px] sm:leading-[44px]
                  md:text-[52px] md:leading-[54px]
                  lg:text-[68px] lg:leading-[68px]
                  xl:text-[78px] xl:leading-[73px]
                  ${isImageLeft ? 'max-w-[395px]' : ''}
                `}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </header>
            <div
              className={`
                text-white font-normal
                text-[14px] leading-6
                sm:text-[18px] sm:leading-7
                md:text-[20px] md:leading-7
                lg:text-[24px] lg:leading-8
                xl:text-[28px] xl:leading-9
                mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12
              `}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </div>
    </section>
  );
};
