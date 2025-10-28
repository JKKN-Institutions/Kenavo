import React from 'react';
import Header from '@/components/Header';
import { ContactInfo } from '@/components/ContactInfo';
import { ContactForm } from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />

      <main className="self-center w-[931px] max-w-full mt-[142px] px-5 max-md:mt-10" id="contact">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-6/12 max-md:w-full max-md:ml-0">
            <ContactInfo />
          </div>
          <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
            <ContactForm />
          </div>
        </div>
      </main>

      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/d933706fc6f1627b8029a479a1ce04ba3355c432?placeholderIfAbsent=true"
        alt="Decorative background"
        className="aspect-[2.7] object-contain w-full bg-blend-lighten mt-[141px] max-md:max-w-full max-md:mt-10"
      />

      <Footer />
    </div>
  );
}
