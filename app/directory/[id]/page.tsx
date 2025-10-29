import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileHero from '@/components/ProfileHero';
import QuestionAnswer from '@/components/QuestionAnswer';

// Generate static paths for all directory profiles
export function generateStaticParams() {
  return [
    { id: 'a-arjoon' },
    { id: 'ahamed-khan' },
    { id: 'abishek-valluru' },
    { id: 'abraham-francis' },
    { id: 'admin-selvaraj' },
    { id: 'aji-p-george' },
    { id: 'bachan' },
    { id: 'badrinath' },
    { id: 'balaji-srimurugan' }
  ];
}

// Allow dynamic routes for any other profile IDs at runtime
export const dynamicParams = true;

export default async function DirectoryIndividualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const questionsAndAnswers = [
    {
      question: "A school memory that still makes you smile",
      answer: "Diwalis with nerds"
    },
    {
      question: "Your favourite spot in school",
      answer: "All those places which had stumps drawn on walls"
    },
    {
      question: "If you get one full day in school today, what would you do...",
      answer: "Eat a lot of parotta in charmettes"
    },
    {
      question: "What advice would you give to the younger students entering the workforce today:",
      answer: "Money follows skill, skill follows discipline"
    },
    {
      question: "A book / movie / experience that changed your perspective of life:",
      answer: "Marriage :)"
    },
    {
      question: "A personal achievement that means a lot to you:",
      answer: "Having a family"
    },
    {
      question: "Your favourite hobby that you pursue when off work:",
      answer: "Pencil art"
    },
    {
      question: "Your favourite go-to song(s) to enliven your spirits",
      answer: "Boulevard of broken dreams"
    },
    {
      question: "What does reconnecting with this alumini group mean to you at this stage of your life?",
      answer: "Mid term audit"
    },
    {
      question: "Would you be open to mentoring younger students or collaborating with alumni?",
      answer: "Maybe"
    }
  ];

  return (
    <div className="bg-[rgba(78,46,140,1)] flex flex-col overflow-hidden items-stretch min-h-screen">
      <Header />

      <div className="flex min-h-[147px] w-full max-md:max-w-full" />

      <main>
        <ProfileHero />

        <section className="self-center flex w-[969px] max-w-full flex-col ml-[19px] px-5" aria-label="Questions and Answers">
          {questionsAndAnswers.map((qa, index) => (
            <QuestionAnswer
              key={index}
              question={qa.question}
              answer={qa.answer}
              isExpanded={index === 0}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
