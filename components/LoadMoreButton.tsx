'use client';

import React, { useState } from 'react';

const LoadMoreButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading more content
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Here you would typically load more gallery items
  };

  return (
    <button
      onClick={handleLoadMore}
      disabled={isLoading}
      className="bg-[rgba(217,81,100,1)] flex w-[160px] sm:w-[180px] md:w-[190px] max-w-full flex-col items-stretch text-base sm:text-lg text-white font-black text-center leading-none justify-center whitespace-nowrap mt-16 sm:mt-20 md:mt-24 lg:mt-32 mb-16 sm:mb-20 md:mb-24 lg:mb-32 px-8 sm:px-10 md:px-[42px] py-2.5 sm:py-3 rounded-[50px] hover:bg-[rgba(197,61,80,1)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      aria-label="Load more gallery items"
    >
      {isLoading ? 'Loading...' : 'Load more'}
    </button>
  );
};

export default LoadMoreButton;
