import React from 'react';

interface ProfileCardProps {
  name: string;
  imageUrl: string;
  backgroundImageUrl?: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name, 
  imageUrl, 
  backgroundImageUrl,
  className = ""
}) => {
  const hasBackground = !!backgroundImageUrl;
  
  return (
    <article className={`bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full px-[19px] py-6 max-md:mt-[23px] max-md:pr-5 ${className}`}>
      {hasBackground ? (
        <div className="flex flex-col self-stretch relative aspect-[0.969]">
          <img
            src={backgroundImageUrl}
            className="absolute h-full w-full object-cover inset-0"
            alt=""
          />
          <img
            src={imageUrl}
            className="aspect-[0.97] object-contain w-full"
            alt={`${name} profile`}
          />
        </div>
      ) : (
        <img
          src={imageUrl}
          className="aspect-[0.97] object-contain w-full self-stretch"
          alt={`${name} profile`}
        />
      )}
      <h3 className="text-[rgba(254,249,232,1)] text-[28px] leading-[1.2] mt-[15px]">
        {name}
      </h3>
      <button className="text-[rgba(217,81,100,1)] text-lg leading-none underline mt-[97px] max-md:mt-10 text-left hover:text-[rgba(217,81,100,0.8)] transition-colors">
        View More
      </button>
    </article>
  );
};

export default ProfileCard;
