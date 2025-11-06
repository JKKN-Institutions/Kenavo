'use client';

import React, { useEffect, useState } from 'react';

const ScrollNavigationButtons: React.FC = () => {
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollBottom = scrollTop + winHeight;

      // Show up button after scrolling down 300px
      setShowUpButton(scrollTop > 300);

      // Hide down button when near bottom (within 100px)
      setShowDownButton(scrollBottom < docHeight - 100);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => {
    const currentScroll = window.scrollY;
    const scrollAmount = window.innerHeight; // Scroll by one viewport height
    window.scrollTo({
      top: Math.max(0, currentScroll - scrollAmount),
      behavior: 'smooth',
    });
  };

  const scrollDown = () => {
    const currentScroll = window.scrollY;
    const scrollAmount = window.innerHeight; // Scroll by one viewport height
    window.scrollTo({
      top: currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed right-4 sm:right-6 md:right-8 bottom-24 lg:bottom-8 sm:bottom-26 md:bottom-28 lg:bottom-10 z-60 flex flex-col gap-2 sm:gap-3">
      {/* Scroll Up Button */}
      {showUpButton && (
        <button
          onClick={scrollUp}
          className="group bg-gradient-to-br from-[rgba(217,81,100,0.95)] to-[rgba(193,61,76,0.9)] hover:from-[rgba(217,81,100,1)] hover:to-[rgba(193,61,76,0.95)] text-white rounded-full w-10 h-10 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex items-center justify-center shadow-xl hover:shadow-[0_0_25px_rgba(217,81,100,0.6)] backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[rgba(217,81,100,1)] focus:ring-offset-2 focus:ring-offset-[rgba(64,34,120,1)] animate-fadeIn"
          aria-label="Scroll up"
          title="Scroll up"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 transition-transform duration-300 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}

      {/* Scroll Down Button */}
      {showDownButton && (
        <button
          onClick={scrollDown}
          className="group bg-gradient-to-br from-[rgba(217,81,100,0.95)] to-[rgba(193,61,76,0.9)] hover:from-[rgba(217,81,100,1)] hover:to-[rgba(193,61,76,0.95)] text-white rounded-full w-10 h-10 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex items-center justify-center shadow-xl hover:shadow-[0_0_25px_rgba(217,81,100,0.6)] backdrop-blur-sm border border-white/10 transition-all duration-300 ease-out hover:scale-110 hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-[rgba(217,81,100,1)] focus:ring-offset-2 focus:ring-offset-[rgba(64,34,120,1)] animate-fadeIn"
          aria-label="Scroll down"
          title="Scroll down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 transition-transform duration-300 group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScrollNavigationButtons;
