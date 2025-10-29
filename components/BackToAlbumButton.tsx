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
      className="bg-[rgba(217,81,100,1)] flex w-[170px] max-w-full flex-col items-stretch text-lg text-white font-black text-center leading-none justify-center mt-[54px] px-[25px] py-3 rounded-[50px] max-md:mt-10 max-md:px-5 hover:bg-[rgba(197,61,80,1)] transition-colors cursor-pointer"
      aria-label="Navigate back to album view"
    >
      <span>Back to Album</span>
    </button>
  );
}
