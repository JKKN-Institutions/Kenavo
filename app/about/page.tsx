import React from 'react';
import Header from '@/components/Header';
import { AboutHeroSection } from '@/components/AboutHeroSection';
import { ContentSection } from '@/components/ContentSection';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col items-stretch min-h-screen overflow-x-hidden">
      <Header />

      <main role="main" className="flex-1 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <AboutHeroSection />

        {/* THE CLASS Section */}
        <ContentSection
          title='<span style="font-size: 28px; color: rgba(255,255,255,1);">THE CLASS</span><br />BATCH OF 2000'
          content="We came from different towns, cultures, and families and somehow all ended up on the same hill.<br /><br />Montfort wasn't just a school; it was a world of its own. Misty mornings, chapel bells, football on uneven fields, canteen treats, and those<br />long Wednesday movies that<br />always made midweek feel special."
          imageSrc="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/1b54518e-9c1e-4450-830f-5c7d2c360405?placeholderIfAbsent=true"
          imageAlt="Montfort School students from Class of 2000"
          imagePosition="right"
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32"
        />

        {/* OUR MASCOT Section */}
        <ContentSection
          title='<span style="font-size: 28px; text-transform: uppercase; color: rgba(255,255,255,1);">Our Mascot</span> <br /><span style="text-transform: uppercase;">Albino</span>'
          content="We didn't know much about symbolism back then we just wanted a mascot that no one else had. So we chose Albino, the white monkey. Rare, a little odd,<br />and perfectly imperfect. <br /><br />Turns out, we picked something that described us better than we realised unique, unpredictable, and proudly one of a kind. The kind of choice that made sense then, and even more sense now.<br />"
          imageSrc="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/0f0b3931-e11a-47c4-9502-34bf4a50ce15?placeholderIfAbsent=true"
          imageAlt="Albino the white monkey mascot"
          imagePosition="left"
          className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32"
        />

        {/* THE NAME Section */}
        <ContentSection
          title='<span style="font-size: 28px; text-transform: uppercase; color: rgba(255,255,255,1);">The name</span><br /><span style="text-transform: uppercase;">Kenavo</span>'
          content={'<span style="font-weight: 300; font-style: italic;">It\'s an old Montfort tradition every passing-out class chooses a name to mark their farewell. It\'s a small word that carries a big meaning:</span><br /><span style="font-weight: 300; font-style: italic;">a goodbye that promises a return</span>.<br /><br />Ours was Kenavo, borrowed<br />from the Breton word meaning "Goodbye… until we meet again." At the time, it was just another farewell banner. Today, it feels<br />like a promise we actually kept.'}
          imageSrc="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/43bede24-211b-4256-ab12-a16fc9513a10?placeholderIfAbsent=true"
          imageAlt="Kenavo farewell banner and memories"
          imagePosition="right"
          className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32"
        />
      </main>

      <Footer />
    </div>
  );
}
