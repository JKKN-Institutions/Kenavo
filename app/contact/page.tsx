import React from 'react';
import Header from '@/components/Header';
import { ContactInfo } from '@/components/ContactInfo';
import { ContactForm } from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />

      <main className="self-center w-full max-w-[931px] mt-12 sm:mt-16 md:mt-20 lg:mt-[142px] px-4 sm:px-6 md:px-8 lg:px-5" id="contact">
        <div className="gap-4 sm:gap-5 flex flex-col md:flex-row md:items-stretch">
          <div className="w-full md:w-6/12">
            <ContactInfo />
          </div>
          <div className="w-full md:w-6/12 md:ml-4 lg:ml-5">
            <ContactForm />
          </div>
        </div>
      </main>

      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/d933706fc6f1627b8029a479a1ce04ba3355c432?placeholderIfAbsent=true"
        alt="Decorative background"
        className="aspect-[2.7] object-contain w-full bg-blend-lighten mt-16 sm:mt-20 md:mt-24 lg:mt-[141px] px-4 sm:px-6"
      />

      <Footer />
    </div>
  );
}
