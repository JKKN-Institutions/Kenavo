'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Image, Mail, Plus, Info, X } from 'lucide-react';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
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
      className="fixed bottom-4 left-4 right-4 bg-[rgba(78,46,140,0.75)] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full lg:hidden z-50"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-4 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center transition-all duration-300 ease-out active:scale-95"
            >
              {/* Active: Horizontal Pill (Icon + Label) | Inactive: Just Icon */}
              {active ? (
                <div className="flex flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-[rgba(50,30,90,0.8)] backdrop-blur-md shadow-lg border border-white/20 transition-all duration-300">
                  <Icon size={20} strokeWidth={2.5} className="text-white transition-all duration-300" />
                  <span className="text-xs font-semibold text-white whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center p-2">
                  <Icon
                    size={20}
                    strokeWidth={2}
                    className="text-white/70 hover:text-white/90 transition-all duration-300"
                  />
                </div>
              )}
            </Link>
          );
        })}

        {/* Floating Action Button (FAB) */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(217,81,100,1)] to-[rgba(217,81,100,0.8)] shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 border-2 border-white/20"
          aria-label="More options"
        >
          {showMenu ? (
            <X size={24} strokeWidth={2.5} className="text-white" />
          ) : (
            <Plus size={24} strokeWidth={2.5} className="text-white" />
          )}
        </button>
      </div>

      {/* FAB Menu - Bottom Sheet */}
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="absolute bottom-20 right-4 bg-[rgba(78,46,140,0.98)] backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-2 min-w-[160px]">
              <Link
                href="/about"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
              >
                <Info size={20} className="text-white/90" />
                <span className="text-sm font-medium text-white">About</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileBottomNav;
