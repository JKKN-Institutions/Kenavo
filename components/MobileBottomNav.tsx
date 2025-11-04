'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Users, Image, Mail } from 'lucide-react';

const MobileBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/about', icon: Info, label: 'About' },
    { href: '/directory', icon: Users, label: 'Directory' },
    { href: '/gallery', icon: Image, label: 'Gallery' },
    { href: '/contact', icon: Mail, label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden z-50"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-20 px-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center min-w-[60px] py-2 transition-all duration-300 ease-out active:scale-95"
            >
              {/* Active State Background Pill */}
              {active && (
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <div className="w-full h-[52px] bg-[rgba(78,46,140,1)] rounded-[16px] shadow-lg animate-in zoom-in-95 duration-300" />
                </div>
              )}

              {/* Content */}
              <div className="relative flex flex-col items-center justify-center gap-1 z-10">
                <Icon
                  size={26}
                  strokeWidth={active ? 2.5 : 2}
                  className={`transition-all duration-300 ${
                    active
                      ? 'text-white scale-105'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold transition-all duration-300 ${
                    active
                      ? 'text-white opacity-100 translate-y-0'
                      : 'text-gray-500 opacity-0 translate-y-1 absolute'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
