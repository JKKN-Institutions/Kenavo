'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DirectoryHeroSection from '@/components/DirectoryHeroSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getAllProfiles } from '@/lib/api/profiles';
import type { Profile } from '@/lib/types/database';

// Helper function to create slug from name
const createSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
};

// Group alumni by first letter
const groupByLetter = (profiles: Profile[]) => {
  const groups: { [key: string]: Profile[] } = {};
  profiles.forEach(profile => {
    const firstLetter = profile.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(profile);
  });
  return groups;
};

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profiles from Supabase
  useEffect(() => {
    async function loadProfiles() {
      try {
        setLoading(true);
        const data = await getAllProfiles();
        setProfiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profiles');
        console.error('Error loading profiles:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  const alumniByLetter = groupByLetter(profiles);
  const letters = Object.keys(alumniByLetter).sort();

  const AlphabetNavigation = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-none self-stretch mt-[51px] max-md:max-w-full max-md:mt-10">
        {alphabet.map((letter, index) => {
          const hasProfiles = letters.includes(letter);
          return (
            <span key={letter}>
              {hasProfiles ? (
                <a
                  href={`#letter-${letter}`}
                  className="text-[rgba(217,65,66,1)] hover:text-[rgba(217,65,66,0.8)] transition-colors"
                >
                  {letter}
                </a>
              ) : (
                <span className="opacity-50">
                  {letter}
                </span>
              )}
              {index < alphabet.length - 1 && ' '}
            </span>
          );
        })}
      </div>
    );
  };

  const ProfileCard = ({ profile }: { profile: Profile }) => {
    const slug = createSlug(profile.name);

    // Add cache-busting parameter to force fresh image load
    const getImageUrl = (url: string | null) => {
      if (!url) return '/placeholder-profile.png';
      // Add timestamp or updated_at to bust cache
      const separator = url.includes('?') ? '&' : '?';
      const cacheBuster = profile.updated_at ? new Date(profile.updated_at).getTime() : Date.now();
      return `${url}${separator}t=${cacheBuster}`;
    };

    return (
      <article className="bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full px-[19px] py-6 max-md:mt-[23px] max-md:pr-5">
        <img
          src={getImageUrl(profile.profile_image_url)}
          className="aspect-[0.97] object-contain w-full self-stretch"
          alt={`${profile.name} profile`}
        />
        <div className="text-[rgba(254,249,232,1)] text-[28px] leading-[1.2] mt-[15px]">
          {profile.name}
        </div>
        <Link
          href={`/directory/${slug}`}
          className="text-[rgba(217,81,100,1)] text-lg leading-none underline mt-[97px] max-md:mt-10 text-left hover:text-[rgba(217,81,100,0.8)] transition-colors"
        >
          View More
        </Link>
      </article>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[rgba(64,34,120,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
        <Header />
        <DirectoryHeroSection />
        <main className="self-center flex w-[1011px] max-w-full flex-col ml-[38px] mt-[65px] px-5">
          <div className="text-[rgba(254,249,232,1)] text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgba(217,81,100,1)] mx-auto mb-4"></div>
            <p className="text-2xl">Loading alumni directory...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[rgba(64,34,120,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
        <Header />
        <DirectoryHeroSection />
        <main className="self-center flex w-[1011px] max-w-full flex-col ml-[38px] mt-[65px] px-5">
          <div className="text-[rgba(254,249,232,1)] text-center py-20">
            <p className="text-2xl text-red-400 mb-4">Error loading profiles</p>
            <p className="text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-[rgba(217,81,100,1)] text-white rounded hover:bg-[rgba(217,65,66,0.8)] transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

        {/* All sections A-Z */}
        {letters.map((letter, letterIndex) => (
          <section key={letter} id={`letter-${letter}`}>
            <h2 className={`text-[rgba(217,81,100,1)] text-[42px] font-bold leading-none ${letterIndex === 0 ? 'mt-[285px]' : 'mt-[61px]'} max-md:ml-2 max-md:mt-10`}>
              {letter}
            </h2>

            {Array.from({ length: Math.ceil(alumniByLetter[letter].length / 3) }, (_, groupIndex) => (
              <div key={groupIndex} className="w-[931px] max-w-full mt-[47px] max-md:mt-10">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                  {alumniByLetter[letter].slice(groupIndex * 3, (groupIndex + 1) * 3).map((profile, index) => (
                    <div key={profile.id} className="w-[33%] max-md:w-full max-md:ml-0">
                      <ProfileCard profile={profile} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
