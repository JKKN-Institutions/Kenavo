'use client';

import React from 'react';

const DirectorySection = () => {
  const handleDirectoryClick = () => {
    // Navigate to directory page
    console.log('Navigate to directory');
  };

  return (
    <section className="w-full mt-[178px] max-md:max-w-full max-md:mt-10" aria-labelledby="directory-heading">
      <div className="flex flex-col relative min-h-[670px] w-full pt-[30px] max-md:max-w-full">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/219b42832d68c68bc6d901fa348872161818ef2b?placeholderIfAbsent=true"
          alt="Directory section background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <div className="flex flex-col relative bg-blend-normal min-h-[640px] w-full px-[70px] max-md:max-w-full max-md:pl-5">
          <img
            src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/67114605b5b4499fa51946af498b30b56961a690?placeholderIfAbsent=true"
            alt="Directory overlay background"
            className="absolute h-full w-full object-cover inset-0"
          />
          <div className="relative z-10 mt-[-30px] pt-[31px] pb-[111px] max-md:max-w-full max-md:pr-5 max-md:pb-[100px]">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-[16%] max-md:w-full max-md:ml-0">
                <img
                  src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/20e63c88b0fe6dc3cf2778312d215c65bf2a7e23?placeholderIfAbsent=true"
                  alt="Portrait photo"
                  className="aspect-[0.55] object-contain w-[216px] shrink-0 max-w-full grow mt-[134px] max-md:mt-10"
                />
              </div>
              <div className="w-[84%] ml-5 max-md:w-full max-md:ml-0">
                <div className="relative flex w-full flex-col items-stretch max-md:max-w-full max-md:mt-10">
                  <div className="w-full max-md:max-w-full">
                    <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                      <div className="w-6/12 max-md:w-full max-md:ml-0">
                        <div className="max-md:max-w-full max-md:mt-10">
                          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                            <div className="w-6/12 max-md:w-full max-md:ml-0">
                              <img
                                src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/24b6092061762f9c056ef449f82e306264bcb41d?placeholderIfAbsent=true"
                                alt="Classmate photo 1"
                                className="aspect-[1] object-contain w-full max-md:mt-3.5"
                              />
                            </div>
                            <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                              <img
                                src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/7bb63ea0ad3ab902514ed4aa13964ca0c8ad0883?placeholderIfAbsent=true"
                                alt="Classmate photo 2"
                                className="aspect-[1] object-contain w-full mt-[82px] max-md:mt-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                        <div className="flex grow flex-col items-stretch mt-[93px] max-md:max-w-full max-md:mt-10">
                          <h2 
                            id="directory-heading"
                            className="text-[rgba(217,81,100,1)] text-[52px] font-bold leading-[49px] max-md:max-w-full max-md:text-[40px] max-md:leading-[42px]"
                          >
                            From Yercaud
                            <br />
                            to New York, here's what we're all up to now.
                            <br />
                          </h2>
                          <p className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-9 mt-[30px] max-md:max-w-full">
                            Browse profiles, spot familiar faces,
                            <br />
                            revisit a few inside jokes. Whether you're
                            checking in or catching up,
                            <br />
                            this is where it all comes together.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleDirectoryClick}
                    className="bg-white self-center flex w-[220px] max-w-full flex-col items-stretch text-lg text-[rgba(78,46,140,1)] font-black leading-none justify-center ml-[143px] mt-[54px] px-[23px] py-3 rounded-[50px] max-md:mt-10 max-md:px-5 hover:bg-gray-100 transition-colors"
                    aria-label="Browse the directory of classmates"
                  >
                    Browse the Directory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
