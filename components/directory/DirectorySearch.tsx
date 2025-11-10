'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DirectorySearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
  placeholder?: string;
  className?: string;
}

/**
 * Search input component for the alumni directory
 * Features:
 * - Real-time search with debouncing handled by parent
 * - Clear button when search has value
 * - Result count display
 * - Keyboard shortcut support (Ctrl/Cmd + K)
 */
export function DirectorySearch({
  value,
  onChange,
  resultCount,
  totalCount,
  placeholder = 'Search by name, location, company...',
  className = '',
}: DirectorySearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('directory-search');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    const searchInput = document.getElementById('directory-search');
    searchInput?.focus();
  };

  const showResultCount = resultCount !== undefined && totalCount !== undefined && value.trim().length > 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none transition-colors duration-200 ${
            isFocused ? 'text-[rgba(217,81,100,1)]' : 'text-[rgba(254,249,232,0.5)]'
          }`}
          aria-hidden="true"
        />

        {/* Search Input */}
        <Input
          id="directory-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-11 pr-10 h-12 text-base bg-[rgba(44,23,82,1)] border-[rgba(78,46,140,0.6)] text-[rgba(254,249,232,1)] placeholder:text-[rgba(254,249,232,0.5)] focus:border-[rgba(217,81,100,1)] focus:ring-2 focus:ring-[rgba(217,81,100,0.3)] transition-all duration-200 shadow-lg"
          aria-label="Search alumni directory"
          autoComplete="off"
        />

        {/* Clear Button */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[rgba(217,81,100,0.2)] text-[rgba(217,81,100,1)] transition-all duration-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Keyboard Shortcut Hint */}
        {!value && !isFocused && (
          <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-xs text-[rgba(254,249,232,0.5)] pointer-events-none">
            <kbd className="px-2 py-1 text-xs font-semibold bg-[rgba(78,46,140,0.4)] text-[rgba(254,249,232,0.8)] rounded border border-[rgba(217,81,100,0.3)]">
              {typeof window !== 'undefined' && navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}
            </kbd>
            <span>+</span>
            <kbd className="px-2 py-1 text-xs font-semibold bg-[rgba(78,46,140,0.4)] text-[rgba(254,249,232,0.8)] rounded border border-[rgba(217,81,100,0.3)]">
              K
            </kbd>
          </div>
        )}
      </div>

      {/* Result Count */}
      {showResultCount && (
        <div className="mt-3 text-sm text-[rgba(254,249,232,0.7)]">
          {resultCount === 0 ? (
            <span className="flex items-center gap-2">
              <span className="text-[rgba(217,81,100,1)]">●</span>
              No results found for &ldquo;<span className="text-[rgba(254,249,232,1)] font-medium">{value}</span>&rdquo;
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-[rgba(217,81,100,1)]">●</span>
              Showing <span className="font-semibold text-[rgba(217,81,100,1)]">{resultCount}</span> of{' '}
              <span className="font-semibold text-[rgba(254,249,232,1)]">{totalCount}</span> alumni
            </span>
          )}
        </div>
      )}
    </div>
  );
}
