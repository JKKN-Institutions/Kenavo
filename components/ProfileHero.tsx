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
  const imageUrl = addCacheBuster(profileImageUrl || '/placeholder-profile.png', updatedAt);

  return (
    <section className="self-center flex w-[969px] max-w-full flex-col ml-[19px]">
      <h1 className="text-[rgba(217,81,100,1)] text-[78px] font-bold leading-[73px] w-[488px] ml-[11px] max-md:max-w-full max-md:text-[40px] max-md:leading-[42px]">
        {nameLines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < nameLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>

      <div className="self-stretch mt-[59px] max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-6/12 max-md:w-full max-md:ml-0">
            <img
              src={imageUrl}
              alt={`${name} Profile`}
              className="aspect-[0.95] object-contain w-full grow max-md:max-w-full max-md:mt-10"
            />
          </div>
          <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
            <div className="flex grow flex-col text-lg text-[rgba(217,81,100,1)] font-normal leading-none max-md:mt-10">
              {yearGraduated && (
                <>
                  <div>Tenure at Montfort</div>
                  <div className="text-white text-[28px] leading-[1.1] mt-4">
                    {yearGraduated}
                  </div>
                </>
              )}

              {(company || currentJob) && (
                <>
                  <div className="leading-[17px] w-[251px] mt-[53px] max-md:mt-10">
                    Company / Organization / Industry Name
                  </div>
                  <div className="text-white text-[28px] leading-[1.1] self-stretch mt-6">
                    {currentJob && company ? `${currentJob} at ${company}` : company || currentJob}
                  </div>
                </>
              )}

              {location && (
                <>
                  <div className="mt-[53px] max-md:mt-10">
                    Current Residential Address
                  </div>
                  <address className="text-white text-[28px] leading-[31px] self-stretch mt-5 max-md:mr-2.5 not-italic">
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
                  <div className="mt-[53px] max-md:mt-10">
                    Nick Names
                  </div>
                  <div className="text-white text-[28px] leading-[1.1] mt-5">
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
