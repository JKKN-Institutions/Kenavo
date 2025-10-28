'use client';

import React from 'react';
import Header from '@/components/Header';
import DirectoryHeroSection from '@/components/DirectoryHeroSection';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DirectoryPage() {
  // Sample profile data - in production this would come from a database
  const profilesA = [
    {
      id: 'a-arjoon',
      name: "A Arjoon",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/e89e528d27dcb8dc7ac92af8372af16774e9dfb9?placeholderIfAbsent=true"
    },
    {
      id: 'ahamed-khan',
      name: "A S Syed Ahamed Khan",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0cc6b72e80f672ae4bd339fabb8fe37c97df7032?placeholderIfAbsent=true",
      isMultiLine: true
    },
    {
      id: 'abishek-valluru',
      name: "Abishek Valluru",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/ff89d2ee719f706c663f406428367b65c718ac20?placeholderIfAbsent=true"
    },
    {
      id: 'abraham-francis',
      name: "Abraham Francis",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/a2f3baecd11a88226af148b3b519e26151ab7a82?placeholderIfAbsent=true"
    },
    {
      id: 'admin-selvaraj',
      name: "Admin Selvaraj",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/a2f3baecd11a88226af148b3b519e26151ab7a82?placeholderIfAbsent=true",
      isWhiteText: true
    },
    {
      id: 'aji-p-george',
      name: "Aji P George",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/cc57489991cef703751b930117e2b26b3d847c25?placeholderIfAbsent=true"
    }
  ];

  const profilesB = [
    {
      id: 'bachan',
      name: "Bachan",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/a2f3baecd11a88226af148b3b519e26151ab7a82?placeholderIfAbsent=true",
      backgroundImageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b9295cecad21f9ba3de730d0f3f1b464304283d7?placeholderIfAbsent=true"
    },
    {
      id: 'badrinath',
      name: "Badrinath",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/a2f3baecd11a88226af148b3b519e26151ab7a82?placeholderIfAbsent=true",
      backgroundImageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/b9295cecad21f9ba3de730d0f3f1b464304283d7?placeholderIfAbsent=true",
      isWhiteText: true
    },
    {
      id: 'balaji-srimurugan',
      name: "Balaji Srimurugan",
      imageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/6163de1cbf5de80dd6ee767118c48c7a79746337?placeholderIfAbsent=true",
      backgroundImageUrl: "https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/550023b4f2ec6d615a79848dbc25b9ce4845573b?placeholderIfAbsent=true"
    }
  ];

  const AlphabetNavigation = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-none self-stretch mt-[51px] max-md:max-w-full max-md:mt-10">
        {alphabet.map((letter, index) => (
          <span key={letter}>
            {index === 0 ? (
              <button className="text-[rgba(217,65,66,1)] hover:text-[rgba(217,65,66,0.8)] transition-colors">
                {letter}
              </button>
            ) : (
              <button className="hover:text-[rgba(217,65,66,1)] transition-colors">
                {letter}
              </button>
            )}
            {index < alphabet.length - 1 && ' '}
          </span>
        ))}
      </div>
    );
  };

  const ProfileCard = ({ profile }: { profile: any }) => {
    const hasBackground = !!profile.backgroundImageUrl;
    const isWhiteText = profile.isWhiteText;
    const isMultiLine = profile.isMultiLine;

    return (
      <article className="bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full px-[19px] py-6 max-md:mt-[23px] max-md:pr-5">
        {hasBackground ? (
          <div className="flex flex-col self-stretch relative aspect-[0.969]">
            <img
              src={profile.backgroundImageUrl}
              className="absolute h-full w-full object-cover inset-0"
              alt=""
            />
            <img
              src={profile.imageUrl}
              className="aspect-[0.97] object-contain w-full"
              alt={`${profile.name} profile`}
            />
          </div>
        ) : (
          <img
            src={profile.imageUrl}
            className="aspect-[0.97] object-contain w-full self-stretch"
            alt={`${profile.name} profile`}
          />
        )}
        <div className={`${isWhiteText ? 'text-white' : 'text-[rgba(254,249,232,1)]'} text-[28px] ${isMultiLine ? 'leading-[34px]' : 'leading-[1.2]'} mt-[15px]`}>
          {isMultiLine && profile.name.includes(' ') ? (
            profile.name.split(' ').map((word: string, i: number, arr: string[]) => (
              <span key={i}>
                {word}
                {i < arr.length - 1 && (i === Math.floor(arr.length / 2) - 1 ? <br /> : ' ')}
              </span>
            ))
          ) : (
            profile.name
          )}
        </div>
        <Link
          href={`/directory/${profile.id}`}
          className="text-[rgba(217,81,100,1)] text-lg leading-none underline mt-[97px] max-md:mt-10 text-left hover:text-[rgba(217,81,100,0.8)] transition-colors"
        >
          View More
        </Link>
      </article>
    );
  };

  return (
    <div className="bg-[rgba(64,34,120,1)] flex flex-col overflow-hidden items-stretch">
      <Header />
      <DirectoryHeroSection />

      <main className="self-center flex w-[1011px] max-w-full flex-col ml-[38px] mt-[65px] px-5 max-md:mt-10">
        <p className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-9 max-md:max-w-full">
          Start exploring you might just reconnect with someone you forgot you
          missed.
        </p>

        <AlphabetNavigation />

        {/* Section A */}
        <section>
          <h2 className="text-[rgba(217,81,100,1)] text-[42px] font-bold leading-none mt-[285px] max-md:ml-2 max-md:mt-10">
            A
          </h2>

          {Array.from({ length: Math.ceil(profilesA.length / 3) }, (_, groupIndex) => (
            <div key={groupIndex} className="w-[931px] max-w-full mt-[47px] max-md:mt-10">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                {profilesA.slice(groupIndex * 3, (groupIndex + 1) * 3).map((profile, index) => (
                  <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
                    <ProfileCard profile={profile} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Section B */}
        <section>
          <h2 className="text-[rgba(217,81,100,1)] text-[42px] font-bold leading-none mt-[61px] max-md:ml-2 max-md:mt-10">
            B
          </h2>

          <div className="w-[931px] max-w-full mt-[47px] max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              {profilesB.map((profile, index) => (
                <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <p className="text-[rgba(254,249,232,1)] text-2xl mt-16 text-center">
          More profiles coming soon...
        </p>
      </main>

      <Footer />
    </div>
  );
}
