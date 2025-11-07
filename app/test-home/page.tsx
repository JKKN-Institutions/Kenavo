import React from 'react';
import Header from '@/components/lovable/Header';
import HeroSection from '@/components/lovable/HeroSection';
import AboutSection from '@/components/lovable/AboutSection';
import DirectorySection from '@/components/lovable/DirectorySection';
import StorySection from '@/components/lovable/StorySection';
import StatsSection from '@/components/lovable/StatsSection';
import GallerySection from '@/components/lovable/GallerySection';
import Footer from '@/components/lovable/Footer';

export default function TestHome() {
  return (
    <main className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch">
      <Header />
      <HeroSection />
      <AboutSection />
      <DirectorySection />
      <StorySection />
      <StatsSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
