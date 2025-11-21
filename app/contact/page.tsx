import React from 'react';
import Header from '@/components/Header';
import { ContactInfo } from '@/components/ContactInfo';
import { ContactForm } from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />

      <main className="self-center w-full max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px] mt-10 sm:mt-14 md:mt-18 lg:mt-20 xl:mt-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" id="contact">
        <div className="gap-8 sm:gap-10 flex flex-col md:flex-row md:items-start lg:gap-14 xl:gap-18">
          <div className="w-full md:w-[45%] lg:w-[42%] xl:w-[40%]">
            <ContactInfo />
          </div>
          <div className="w-full md:w-[55%] lg:w-[58%] xl:w-[60%]">
            <ContactForm />
          </div>
        </div>
      </main>

      <div className="w-full mt-8 sm:mt-10 md:mt-12 lg:mt-16 relative">
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/d933706fc6f1627b8029a479a1ce04ba3355c432?placeholderIfAbsent=true"
          alt="Decorative background"
          className="w-full h-auto object-cover object-center max-h-[300px] sm:max-h-[400px] md:max-h-[500px] bg-blend-lighten"
        />
      </div>

      <Footer />
    </div>
  );
}
