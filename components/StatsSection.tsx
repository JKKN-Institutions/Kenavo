import React from 'react';

interface StatCardProps {
  number: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, description, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} flex flex-col items-stretch font-bold w-48 h-48 mx-auto px-9 py-[46px] rounded-[96px] max-md:mt-10 max-md:px-5`}>
      <div className={`${textColor} text-[64px] leading-none self-center max-md:text-[40px]`}>
        {number}
      </div>
      <div className="text-white text-lg leading-[17px] text-center mt-[25px]">
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
    <section className="bg-[rgba(64,34,120,1)] w-full mt-[90px] max-md:max-w-full max-md:mt-10" aria-labelledby="stats-heading">
      <div className="flex flex-col relative min-h-[457px] w-full items-center justify-center px-20 py-[60px] max-md:max-w-full max-md:px-5">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/3fd1f4a82581cd0af28b50a05b1f32a051095786?placeholderIfAbsent=true"
          alt="Stats section background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <div className="relative flex w-[930px] max-w-full flex-col">
          <h2 
            id="stats-heading"
            className="text-[rgba(217,81,100,1)] text-[54px] font-bold leading-none max-md:max-w-full max-md:text-[40px]"
          >
            Kenavo by the Numbers
          </h2>
          <p className="text-white text-[28px] font-normal leading-none text-right mt-1">
            Some stats. Some smiles.
          </p>
          <div className="self-stretch mt-[69px] max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              {stats.map((stat, index) => (
                <div key={index} className="w-3/12 max-md:w-full max-md:ml-0">
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
