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
      className="bg-[rgba(217,81,100,1)] flex w-[170px] max-w-full flex-col items-stretch text-lg text-white font-black text-center leading-none justify-center mt-[70px] px-[42px] py-3 rounded-[50px] max-md:mt-10 max-md:px-5 hover:bg-[rgba(217,81,100,0.9)] transition-colors disabled:opacity-50"
      aria-label="Load more gallery items"
    >
      {isLoading ? 'Loading...' : 'Load more'}
    </button>
  );
};

export default LoadMoreButton;
