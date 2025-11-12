'use client';

import React, { useState, useEffect } from 'react';

interface FloatingAlphabetNavProps {
  availableLetters: string[];
  className?: string;
}

export const FloatingAlphabetNav: React.FC<FloatingAlphabetNavProps> = ({
  availableLetters,
  className = ''
}) => {
  const [activeLetters] = useState<Set<string>>(new Set(availableLetters));
  const [isVisible, setIsVisible] = useState(false); // Start hidden
  const [lastScrollY, setLastScrollY] = useState(0);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Auto-hide on scroll down, show on scroll up
  // Only show after scrolling past hero section (500px+)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroSectionHeight = 500; // Hero section height threshold

      // Hide if at top (within hero section)
      if (currentScrollY < heroSectionHeight) {
        setIsVisible(false);
      }
      // Show if scrolling up and past hero section
      else if (currentScrollY < lastScrollY && currentScrollY >= heroSectionHeight) {
        setIsVisible(true);
      }
      // Hide if scrolling down and past a certain threshold
      else if (currentScrollY > lastScrollY && currentScrollY > heroSectionHeight + 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLetterClick = (letter: string) => {
    if (!activeLetters.has(letter)) return;

    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      // Smooth scroll to the section with offset for fixed header
      const offset = 100; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`fixed right-3 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
      } ${className}`}
    >
      {/* Floating Container */}
      <div className="bg-[rgba(44,23,82,0.85)] backdrop-blur-md rounded-full py-2 md:py-3 px-1.5 md:px-2 shadow-2xl border border-[rgba(217,81,100,0.3)]">
        <div className="flex flex-col items-center gap-0.5 md:gap-1 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {alphabet.map((letter) => {
            const hasProfiles = activeLetters.has(letter);

            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={!hasProfiles}
                className={`
                  flex items-center justify-center
                  w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full
                  text-[10px] md:text-xs lg:text-sm font-bold
                  transition-all duration-200
                  ${hasProfiles
                    ? 'text-[rgba(217,81,100,1)] hover:bg-[rgba(217,81,100,1)] hover:text-white hover:scale-125 active:scale-110 cursor-pointer'
                    : 'text-[rgba(254,249,232,0.3)] cursor-not-allowed'
                  }
                `}
                aria-label={`Jump to section ${letter}`}
                aria-disabled={!hasProfiles}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tap Indicator (shows briefly on page load) */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FloatingAlphabetNav;
