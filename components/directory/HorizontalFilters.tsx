'use client';

import { GraduationCap, MapPin, Building2 } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';

interface HorizontalFiltersProps {
  yearOptions: string[];
  locationOptions: string[];
  industryOptions: string[];
  selectedYears: string[];
  selectedLocations: string[];
  selectedIndustries: string[];
  onToggleYear: (year: string) => void;
  onToggleLocation: (location: string) => void;
  onToggleIndustry: (industry: string) => void;
  onClearYears: () => void;
  onClearLocations: () => void;
  onClearIndustries: () => void;
  getYearCount: (year: string) => number;
  getLocationCount: (location: string) => number;
  getIndustryCount: (industry: string) => number;
}

/**
 * Horizontal filter bar component
 * Displays filter dropdowns in a horizontal row
 */
export function HorizontalFilters({
  yearOptions,
  locationOptions,
  industryOptions,
  selectedYears,
  selectedLocations,
  selectedIndustries,
  onToggleYear,
  onToggleLocation,
  onToggleIndustry,
  onClearYears,
  onClearLocations,
  onClearIndustries,
  getYearCount,
  getLocationCount,
  getIndustryCount,
}: HorizontalFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Graduation Year Filter */}
      <FilterDropdown
        label="Graduation Year"
        icon={<GraduationCap className="h-4 w-4" />}
        options={yearOptions.map((year) => ({
          value: year,
          count: getYearCount(year),
        }))}
        selectedValues={selectedYears}
        onToggle={onToggleYear}
        onClear={onClearYears}
        emptyMessage="No graduation years available"
      />

      {/* Location Filter */}
      <FilterDropdown
        label="Location"
        icon={<MapPin className="h-4 w-4" />}
        options={locationOptions
          .map((loc) => ({
            value: loc,
            count: getLocationCount(loc),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)} // Top 20 locations
        selectedValues={selectedLocations}
        onToggle={onToggleLocation}
        onClear={onClearLocations}
        emptyMessage="No locations available"
      />

      {/* Company/Industry Filter */}
      <FilterDropdown
        label="Company/Industry"
        icon={<Building2 className="h-4 w-4" />}
        options={industryOptions
          .map((ind) => ({
            value: ind,
            count: getIndustryCount(ind),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)} // Top 20 companies
        selectedValues={selectedIndustries}
        onToggle={onToggleIndustry}
        onClear={onClearIndustries}
        emptyMessage="No companies available"
      />
    </div>
  );
}
