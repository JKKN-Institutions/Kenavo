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
      className="bg-[rgba(217,81,100,1)] flex w-[140px] sm:w-[160px] md:w-[170px] max-w-full flex-col items-stretch text-base sm:text-lg text-white font-black text-center leading-none justify-center mt-12 sm:mt-14 md:mt-16 lg:mt-[70px] px-8 sm:px-10 md:px-[42px] py-2.5 sm:py-3 rounded-[50px] hover:bg-[rgba(197,61,80,1)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      aria-label="Load more gallery items"
    >
      {isLoading ? 'Loading...' : 'Load more'}
    </button>
  );
};

export default LoadMoreButton;
