'use client';

import { useRouter } from 'next/navigation';

export default function BackToAlbumButton() {
  const router = useRouter();

  const handleBackToAlbum = () => {
    router.push('/gallery');
  };

  return (
    <button
      onClick={handleBackToAlbum}
      className="bg-[rgba(217,81,100,1)] flex w-[180px] sm:w-[190px] md:w-[200px] lg:w-[210px] max-w-full flex-col items-stretch text-base sm:text-lg md:text-xl text-white font-black text-center leading-none justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-14 mb-10 sm:mb-12 md:mb-14 lg:mb-16 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 min-h-[44px] rounded-[50px] hover:bg-[rgba(197,61,80,1)] active:scale-95 transition-all cursor-pointer shadow-lg"
      aria-label="Navigate back to album view"
    >
      <span>Back to Album</span>
    </button>
  );
}
