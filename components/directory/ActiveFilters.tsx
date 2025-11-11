'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FilterPill {
  type: 'cities' | 'countries' | 'industries';
  value: string;
  label: string;
}

interface ActiveFiltersProps {
  selectedCities: string[];
  selectedCountries: string[];
  selectedIndustries: string[];
  onRemoveFilter: (type: 'cities' | 'countries' | 'industries', value: string) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * Component to display active filter pills
 * Shows all currently applied filters with remove buttons
 * Provides a clear all button when filters are active
 */
export function ActiveFilters({
  selectedCities,
  selectedCountries,
  selectedIndustries,
  onRemoveFilter,
  onClearAll,
  className = '',
}: ActiveFiltersProps) {
  // Build array of all active filters
  const activeFilters: FilterPill[] = [
    ...selectedCities.map((city) => ({
      type: 'cities' as const,
      value: city,
      label: `City: ${city}`,
    })),
    ...selectedCountries.map((country) => ({
      type: 'countries' as const,
      value: country,
      label: `Country: ${country}`,
    })),
    ...selectedIndustries.map((industry) => ({
      type: 'industries' as const,
      value: industry,
      label: `Industry: ${industry}`,
    })),
  ];

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-[rgba(254,249,232,0.7)] font-medium">Active filters:</span>

      {/* Filter Pills */}
      {activeFilters.map((filter) => (
        <Badge
          key={`${filter.type}-${filter.value}`}
          className="pl-3 pr-1 py-1.5 gap-1 text-sm bg-[rgba(78,46,140,0.6)] text-[rgba(254,249,232,1)] border border-[rgba(217,81,100,0.4)] hover:bg-[rgba(78,46,140,0.8)] transition-all duration-200 shadow-md"
        >
          <span className="max-w-[200px] truncate">{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.type, filter.value)}
            className="h-5 w-5 p-0 hover:bg-[rgba(217,81,100,0.3)] ml-1 text-[rgba(217,81,100,1)] transition-all duration-200 rounded-full"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {/* Clear All Button */}
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 text-xs text-[rgba(217,81,100,1)] hover:text-[rgba(217,65,66,0.8)] hover:bg-[rgba(78,46,140,0.4)] transition-all duration-200"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
