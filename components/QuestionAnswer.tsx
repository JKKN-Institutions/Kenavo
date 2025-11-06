'use client';

import React, { useState } from 'react';

interface QuestionAnswerProps {
  question: string;
  answer: string;
  isExpanded?: boolean;
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({ 
  question, 
  answer, 
  isExpanded = false 
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full max-w-full">
      {/* Decorative Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(217,81,100,0.3)] to-transparent my-6 sm:my-8 md:my-10 lg:my-12 xl:my-8" />

      {/* Question Button - Enhanced for mobile touch */}
      <button
        onClick={toggleExpanded}
        className="group flex w-full items-start gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-[rgba(217,81,100,1)] font-bold leading-tight sm:leading-tight md:leading-[1.3] xl:leading-[1.2] justify-between hover:text-[rgba(237,101,120,1)] transition-all duration-300 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 -mx-2 sm:-mx-3 md:-mx-4 rounded-lg hover:bg-[rgba(255,255,255,0.03)] active:bg-[rgba(255,255,255,0.05)]"
        aria-expanded={expanded}
        aria-controls={`answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="flex-1 text-left pr-3 sm:pr-4">
          {question}
        </span>

        {/* Arrow Icon - Better size for touch */}
        <div className={`flex items-center justify-center shrink-0 transition-all duration-300 ${expanded ? 'rotate-180' : ''}`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Answer Content - Smooth animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          id={`answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-[rgba(254,249,232,1)] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-normal leading-relaxed sm:leading-relaxed md:leading-loose lg:leading-loose xl:leading-[1.3] mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-4 break-words bg-[rgba(255,255,255,0.03)] backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 xl:p-6 border border-[rgba(217,81,100,0.1)]"
        >
          {answer}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswer;
