import React from 'react';

interface StatCardProps {
  number: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, description, bgColor, textColor }) => {
  return (
    <div
      className="flex flex-col items-center justify-center font-bold w-full aspect-square max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[192px] mx-auto p-4 sm:p-6 md:p-8 lg:p-9 rounded-full shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] leading-none"
        style={{ color: textColor }}
      >
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
      bgColor: "rgba(217,81,100,1)",
      textColor: "#ffffff"
    },
    {
      number: "120+",
      description: "Happy\nclassmates",
      bgColor: "rgba(137,58,190,1)",
      textColor: "#f5f5f5"
    },
    {
      number: "150+",
      description: "Photos\nuploaded",
      bgColor: "rgba(217,81,100,1)",
      textColor: "#ffffff"
    },
    {
      number: "43",
      description: "Cities Represented",
      bgColor: "rgba(137,58,190,1)",
      textColor: "#f5f5f5"
    }
  ];

  return (
    <section className="w-full mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6" aria-labelledby="stats-heading">
      <div className="flex flex-col relative w-full items-center justify-center py-4 sm:py-5 md:py-6">
        <div className="relative flex w-full max-w-[1400px] mx-auto flex-col px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <h2
              id="stats-heading"
              className="text-[rgba(217,81,100,1)] text-[28px] sm:text-[32px] md:text-[36px] lg:text-[38px] xl:text-[40px] font-bold leading-tight"
            >
              Kenavo by the Numbers
            </h2>
            <p className="text-white text-[18px] sm:text-[18px] md:text-[18px] lg:text-[19px] xl:text-[20px] font-normal leading-snug text-center mt-2">
              Some stats. Some smiles.
            </p>
          </div>
          <div className="self-stretch mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-4 lg:gap-5">
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
