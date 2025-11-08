import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/lovable/HeroSection';
import AboutSection from '@/components/lovable/AboutSection';
// import DirectorySection from '@/components/lovable/DirectorySection'; // OLD VERSION
import DirectorySectionV2 from '@/components/lovable/DirectorySectionV2'; // NEW CLEAN VERSION
import StorySection from '@/components/lovable/StorySection';
import StatsSection from '@/components/lovable/StatsSection';
import GallerySection from '@/components/lovable/GallerySection';
import Footer from '@/components/lovable/Footer';

export default function Home() {
  return (
    <main className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch">
      <Header />
      <HeroSection />
      <AboutSection />
      <DirectorySectionV2 />
      <StorySection />
      <StatsSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
