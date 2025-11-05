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
      className="bg-[rgba(217,81,100,1)] flex w-[170px] max-w-full flex-col items-stretch text-lg text-white font-black text-center leading-none justify-center mt-10 sm:mt-12 md:mt-14 lg:mt-[54px] mb-12 sm:mb-14 md:mb-16 px-[25px] py-3 rounded-[50px] max-md:px-5 hover:bg-[rgba(197,61,80,1)] transition-colors cursor-pointer"
      aria-label="Navigate back to album view"
    >
      <span>Back to Album</span>
    </button>
  );
}
