import React from 'react';

interface StatCardProps {
  number: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, description, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} flex flex-col items-center justify-center font-bold aspect-square w-full max-w-[180px] sm:max-w-[200px] mx-auto p-6 sm:p-8 md:p-10 rounded-full shadow-xl hover:scale-105 transition-transform`}>
      <div className={`${textColor} text-4xl sm:text-5xl md:text-6xl leading-none`}>
        {number}
      </div>
      <div className="text-white text-sm sm:text-base md:text-lg leading-tight text-center mt-4 sm:mt-6">
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
    <section
      className="relative w-full bg-[rgba(64,34,120,1)] py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/3fd1f4a82581cd0af28b50a05b1f32a051095786?placeholderIfAbsent=true"
          alt="Stats section background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <h2
            id="stats-heading"
            className="text-[rgba(217,81,100,1)] font-bold leading-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 54px)' }}
          >
            Kenavo by the Numbers
          </h2>
          <p
            className="text-white font-normal mt-2"
            style={{ fontSize: 'clamp(18px, 2.5vw, 28px)' }}
          >
            Some stats. Some smiles.
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-center">
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
