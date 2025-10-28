import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import DirectorySection from '@/components/DirectorySection';
import StorySection from '@/components/StorySection';
import StatsSection from '@/components/StatsSection';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';

export default function Home() {
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
