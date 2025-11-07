'use client';

import React from 'react';

interface QuestionAnswerProps {
  question: string;
  answer: string;
  isExpanded?: boolean; // Kept for backwards compatibility but not used
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  question,
  answer,
}) => {
  return (
    <div className="w-full max-w-full">
      {/* Decorative Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(217,81,100,0.3)] to-transparent my-4 sm:my-5 md:my-6 lg:my-7 xl:my-5" />

      {/* Question - Static, non-interactive */}
      <div className="w-full mb-3 sm:mb-4 md:mb-4 lg:mb-5 xl:mb-3">
        <h3 className="text-[rgba(217,81,100,1)] text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-[22px] font-bold leading-tight sm:leading-tight md:leading-[1.3] xl:leading-[1.3]">
          {question}
        </h3>
      </div>

      {/* Answer Content - Always visible */}
      <div className="w-full">
        <p
          className="text-[rgba(254,249,232,1)] text-base sm:text-lg md:text-xl lg:text-xl xl:text-[18px] font-normal leading-relaxed sm:leading-relaxed md:leading-loose lg:leading-loose xl:leading-[1.7] break-words bg-[rgba(255,255,255,0.03)] backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 lg:p-7 xl:p-5 border border-[rgba(217,81,100,0.1)]"
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

export default QuestionAnswer;
