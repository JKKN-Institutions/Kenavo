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
    <div className="w-[932px] max-w-full">
      <img
        src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/25e55f321500867ea98ab7ff67b3bc3f0b0940b0?placeholderIfAbsent=true"
        alt="Decorative divider"
        className="aspect-[1000] object-contain w-[931px] max-w-full mt-[53px] max-md:mt-10"
      />
      
      <button
        onClick={toggleExpanded}
        className="flex w-full items-stretch gap-5 text-[28px] text-[rgba(217,81,100,1)] font-bold leading-[1.3] flex-wrap justify-between mt-[53px] max-md:mt-10 hover:opacity-80 transition-opacity"
        aria-expanded={expanded}
        aria-controls={`answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="max-md:max-w-full text-left">
          {question}
        </span>
        <img
          src="https://api.builder.io/api/v1/image/assets/b95740542f8a4181a070e70dfc13758e/290c6af7c9ffa4e1197e01a47e19d6e5b03181d4?placeholderIfAbsent=true"
          alt={expanded ? "Collapse" : "Expand"}
          className={`aspect-[1.73] object-contain w-[26px] shrink-0 mt-[5px] transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {expanded && (
        <div
          id={`answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-white text-[28px] font-normal leading-none mt-[22px] max-md:max-w-full"
        >
          {answer}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;
