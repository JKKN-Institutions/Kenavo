'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DirectoryHeroSection from '@/components/DirectoryHeroSection';
import Footer from '@/components/Footer';
import ScrollNavigationButtons from '@/components/ScrollNavigationButtons';
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
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [refreshKey]);

  // Check for refresh parameter in URL and trigger refetch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refreshParam = params.get('refresh');
      if (refreshParam) {
        // Trigger refetch by updating refresh key
        setRefreshKey(prev => prev + 1);
        // Remove refresh parameter from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const alumniByLetter = groupByLetter(profiles);
  const letters = Object.keys(alumniByLetter).sort();

  const AlphabetNavigation = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 self-stretch mt-8 sm:mt-10 md:mt-12 lg:mt-[51px]">
        {alphabet.map((letter) => {
          const hasProfiles = letters.includes(letter);
          return (
            <div key={letter} className="inline-block">
              {hasProfiles ? (
                <a
                  href={`#letter-${letter}`}
                  className="text-[rgba(217,65,66,1)] hover:text-[rgba(217,65,66,0.8)] transition-colors text-base sm:text-lg md:text-xl lg:text-2xl font-normal inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-2"
                >
                  {letter}
                </a>
              ) : (
                <span className="opacity-50 text-base sm:text-lg md:text-xl lg:text-2xl font-normal inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-2 text-[rgba(254,249,232,1)]">
                  {letter}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const ProfileCard = ({ profile }: { profile: Profile }) => {
    const slug = createSlug(profile.name);

    // Add cache-busting parameter to force fresh image load
    const getImageUrl = (url: string | null) => {
      if (!url) return '/placeholder-profile.svg';
      // Add timestamp or updated_at to bust cache
      const separator = url.includes('?') ? '&' : '?';
      const cacheBuster = profile.updated_at ? new Date(profile.updated_at).getTime() : Date.now();
      return `${url}${separator}t=${cacheBuster}`;
    };

    return (
      <article className="bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full px-4 sm:px-5 py-5 sm:py-6 max-md:mt-6">
        <div className="aspect-[0.97] w-full self-stretch rounded-sm bg-[rgba(78,46,140,0.4)] overflow-hidden">
          <img
            src={getImageUrl(profile.profile_image_url)}
            className="w-full h-full object-contain"
            alt={`${profile.name} profile`}
          />
        </div>
        <div className="text-[rgba(254,249,232,1)] text-lg sm:text-xl md:text-2xl lg:text-[28px] leading-tight mt-3 sm:mt-4">
          {profile.name}
        </div>
        <Link
          href={`/directory/${slug}`}
          className="text-[rgba(217,81,100,1)] text-base sm:text-lg leading-none underline mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-left hover:text-[rgba(217,81,100,0.8)] transition-colors inline-block"
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
        <main className="w-full max-w-[1011px] mx-auto flex flex-col mt-12 md:mt-16 px-5 sm:px-8 md:px-10">
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
        <main className="w-full max-w-[1011px] mx-auto flex flex-col mt-12 md:mt-16 px-5 sm:px-8 md:px-10">
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
      <ScrollNavigationButtons />

      <main className="w-full max-w-[1011px] mx-auto flex flex-col mt-12 md:mt-16 px-5 sm:px-8 md:px-10">
        <p className="text-[rgba(254,249,232,1)] text-lg sm:text-xl md:text-2xl lg:text-[28px] font-normal leading-relaxed">
          Start exploring you might just reconnect with someone you forgot you
          missed.
        </p>

        <AlphabetNavigation />

        {/* All sections A-Z */}
        {letters.map((letter, letterIndex) => (
          <section key={letter} id={`letter-${letter}`}>
            <h2 className={`text-[rgba(217,81,100,1)] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-none ${letterIndex === 0 ? 'mt-16 sm:mt-20 md:mt-32 lg:mt-40 xl:mt-[285px]' : 'mt-10 sm:mt-12 md:mt-14 lg:mt-[61px]'}`}>
              {letter}
            </h2>

            {Array.from({ length: Math.ceil(alumniByLetter[letter].length / 3) }, (_, groupIndex) => (
              <div key={groupIndex} className="w-full max-w-[931px] mt-8 sm:mt-10 md:mt-12">
                <div className="gap-4 sm:gap-5 flex max-md:flex-col max-md:items-stretch">
                  {alumniByLetter[letter].slice(groupIndex * 3, (groupIndex + 1) * 3).map((profile) => (
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
