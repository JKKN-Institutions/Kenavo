import React from 'react';

interface StatCardProps {
  number: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, description, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} flex flex-col items-center justify-center font-bold w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[192px] mx-auto p-4 sm:p-6 md:p-8 lg:p-9 rounded-full shadow-lg`}>
      <div className={`${textColor} text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] leading-none`}>
        {number}
      </div>
      <div className="text-white text-xs sm:text-sm md:text-base lg:text-lg leading-tight text-center mt-3 sm:mt-4 md:mt-5 lg:mt-[25px]">
        {description.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < description.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      number: "72",
      description: "Nicknames still remembered",
      bgColor: "bg-[rgba(217,81,100,1)]",
      textColor: "text-[rgba(65,32,128,1)]"
    },
    {
      number: "120+",
      description: "Happy\nclassmates",
      bgColor: "bg-[rgba(137,58,190,1)]",
      textColor: "text-neutral-100"
    },
    {
      number: "150+",
      description: "Photos\nuploaded",
      bgColor: "bg-[rgba(217,81,100,1)]",
      textColor: "text-[rgba(65,32,128,1)]"
    },
    {
      number: "43",
      description: "Cities Represented",
      bgColor: "bg-[rgba(137,58,190,1)]",
      textColor: "text-neutral-100"
    }
  ];

  return (
    <section className="bg-[rgba(64,34,120,1)] w-full mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-[90px]" aria-labelledby="stats-heading">
      <div className="flex flex-col relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:min-h-[457px] w-full items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 sm:py-12 md:py-14 lg:py-16 xl:py-[60px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/3fd1f4a82581cd0af28b50a05b1f32a051095786?placeholderIfAbsent=true"
          alt="Stats section background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <div className="relative flex w-full max-w-[930px] flex-col">
          <div className="text-center md:text-left">
            <h2
              id="stats-heading"
              className="text-[rgba(217,81,100,1)] text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[54px] font-bold leading-tight"
            >
              Kenavo by the Numbers
            </h2>
            <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] xl:text-[28px] font-normal leading-tight md:text-right mt-2">
              Some stats. Some smiles.
            </p>
          </div>
          <div className="self-stretch mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-[69px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-4 lg:gap-5">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-center">
                  <StatCard {...stat} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
