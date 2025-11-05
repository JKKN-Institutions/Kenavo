import React from 'react';
import { addCacheBuster } from '@/lib/utils/image-cache-buster';

interface ProfileHeroProps {
  name: string;
  profileImageUrl: string | null;
  yearGraduated: string | null;
  company: string | null;
  currentJob: string | null;
  location: string | null;
  nicknames: string | null;
  updatedAt: string;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
  name,
  profileImageUrl,
  yearGraduated,
  company,
  currentJob,
  location,
  nicknames,
  updatedAt
}) => {
  // Format name for display (split into two lines if long)
  const formatName = (fullName: string) => {
    const words = fullName.split(' ');
    if (words.length <= 2) return [fullName];

    const midPoint = Math.ceil(words.length / 2);
    return [
      words.slice(0, midPoint).join(' '),
      words.slice(midPoint).join(' ')
    ];
  };

  const nameLines = formatName(name);
  const imageUrl = addCacheBuster(profileImageUrl || '/placeholder-profile.svg', updatedAt);

  return (
    <section className="self-center flex w-full max-w-[969px] flex-col px-4 md:px-6 lg:px-0">
      <h1 className="text-[rgba(217,81,100,1)] text-3xl md:text-5xl lg:text-[78px] font-bold leading-tight md:leading-[50px] lg:leading-[73px] max-w-full md:max-w-[488px]">
        {nameLines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < nameLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>

      <div className="self-stretch mt-8 md:mt-12 lg:mt-[59px]">
        <div className="gap-5 flex flex-col md:flex-row md:items-stretch">
          <div className="w-full md:w-6/12">
            <img
              src={imageUrl}
              alt={`${name} Profile`}
              className="aspect-[0.95] object-contain object-center w-full max-w-full"
            />
          </div>
          <div className="w-full md:w-6/12 md:ml-5 mt-6 md:mt-0">
            <div className="flex grow flex-col text-sm md:text-base lg:text-lg text-[rgba(217,81,100,1)] font-normal leading-none">
              {yearGraduated && (
                <>
                  <div>Tenure at Montfort</div>
                  <div className="text-white text-xl md:text-2xl lg:text-[28px] leading-[1.1] mt-3 md:mt-4">
                    {yearGraduated}
                  </div>
                </>
              )}

              {(company || currentJob) && (
                <>
                  <div className="leading-tight max-w-full mt-8 md:mt-10 lg:mt-[53px]">
                    Company / Organization / Industry Name
                  </div>
                  <div className="text-white text-xl md:text-2xl lg:text-[28px] leading-[1.1] self-stretch mt-4 md:mt-5 lg:mt-6 break-words">
                    {currentJob && company ? `${currentJob} at ${company}` : company || currentJob}
                  </div>
                </>
              )}

              {location && (
                <>
                  <div className="mt-8 md:mt-10 lg:mt-[53px]">
                    Current Residential Address
                  </div>
                  <address className="text-white text-xl md:text-2xl lg:text-[28px] leading-relaxed md:leading-relaxed lg:leading-[31px] self-stretch mt-4 md:mt-5 not-italic break-words">
                    {location.split(',').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line.trim()}
                        {idx < location.split(',').length - 1 && <>,<br /></>}
                      </React.Fragment>
                    ))}
                  </address>
                </>
              )}

              {nicknames && (
                <>
                  <div className="mt-8 md:mt-10 lg:mt-[53px]">
                    Nick Names
                  </div>
                  <div className="text-white text-xl md:text-2xl lg:text-[28px] leading-[1.1] mt-4 md:mt-5 break-words">
                    {nicknames}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;
