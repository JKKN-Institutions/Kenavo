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
    <section className={`self-center w-full max-w-[974px] ${className}`} aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className={`${isImageLeft ? 'w-[44%]' : 'w-[54%]'} max-md:w-full max-md:ml-0 ${isImageLeft ? 'order-1' : 'order-2'}`}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`${isImageLeft ? 'aspect-[0.69]' : 'aspect-[0.76]'} object-contain w-full grow ${isImageLeft ? 'mt-[15px] max-md:mt-10' : 'max-md:mt-[27px]'}`}
          />
        </div>
        <div className={`${isImageLeft ? 'w-[56%] ml-5' : 'w-[46%] ml-5'} max-md:w-full max-md:ml-0 ${isImageLeft ? 'order-2' : 'order-1'}`}>
          <article className={`${isImageLeft ? 'max-md:max-w-full max-md:mt-10' : 'max-md:max-w-full max-md:mt-[27px]'}`}>
            <header>
              <h2
                id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-[rgba(217,81,100,1)] text-[78px] font-bold leading-[73px] max-md:text-[40px] max-md:leading-[42px] ${isImageLeft ? 'w-[395px]' : 'max-md:max-w-full'}`}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </header>
            <div
              className={`text-white text-[28px] font-normal leading-9 ${isImageLeft ? 'mt-[68px]' : 'mr-[37px] mt-[69px] max-md:mr-2.5'} max-md:max-w-full max-md:mt-10`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </div>
    </section>
  );
};
