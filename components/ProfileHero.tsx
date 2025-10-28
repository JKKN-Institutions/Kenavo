import React from 'react';

const ProfileHero: React.FC = () => {
  return (
    <section className="self-center flex w-[969px] max-w-full flex-col ml-[19px]">
      <h1 className="text-[rgba(217,81,100,1)] text-[78px] font-bold leading-[73px] w-[488px] ml-[11px] max-md:max-w-full max-md:text-[40px] max-md:leading-[42px]">
        Chenthil
        <br />
        Aruun Mohan
      </h1>
      
      <div className="self-stretch mt-[59px] max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-6/12 max-md:w-full max-md:ml-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/830138c8a96078a03a3b71b9edf824542ccbb8e7?placeholderIfAbsent=true"
              alt="Chenthil Aruun Mohan Profile"
              className="aspect-[0.95] object-contain w-full grow max-md:max-w-full max-md:mt-10"
            />
          </div>
          <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
            <div className="flex grow flex-col text-lg text-[rgba(217,81,100,1)] font-normal leading-none max-md:mt-10">
              <div>Tenure at Montfort</div>
              <div className="text-white text-[28px] leading-[1.1] mt-4">
                1990-1998
              </div>
              
              <div className="leading-[17px] w-[251px] mt-[53px] max-md:mt-10">
                Company / Organization / Industry Name
              </div>
              <div className="text-white text-[28px] leading-[1.1] self-stretch mt-6">
                Ministry of health , Saudi Arabia
              </div>
              
              <div className="mt-[53px] max-md:mt-10">
                Current Residential Address
              </div>
              <address className="text-white text-[28px] leading-[31px] self-stretch mt-5 max-md:mr-2.5 not-italic">
                9-1-28, Double agraharam,
                <br />
                Sholavandan, Madurai 625214.
              </address>
              
              <div className="mt-[53px] max-md:mt-10">
                Nick Names
              </div>
              <div className="text-white text-[28px] leading-[1.1] mt-5">
                Karuvaaya, Junior Amma
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;
