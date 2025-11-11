'use client';

import { MapPin, Globe, Building2 } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';

interface HorizontalFiltersProps {
  cityOptions: string[];
  countryOptions: string[];
  industryOptions: string[];
  selectedCities: string[];
  selectedCountries: string[];
  selectedIndustries: string[];
  onToggleCity: (city: string) => void;
  onToggleCountry: (country: string) => void;
  onToggleIndustry: (industry: string) => void;
  onClearCities: () => void;
  onClearCountries: () => void;
  onClearIndustries: () => void;
  getCityCount: (city: string) => number;
  getCountryCount: (country: string) => number;
  getIndustryCount: (industry: string) => number;
}

/**
 * Horizontal filter bar component
 * Displays filter dropdowns in a horizontal row
 */
export function HorizontalFilters({
  cityOptions,
  countryOptions,
  industryOptions,
  selectedCities,
  selectedCountries,
  selectedIndustries,
  onToggleCity,
  onToggleCountry,
  onToggleIndustry,
  onClearCities,
  onClearCountries,
  onClearIndustries,
  getCityCount,
  getCountryCount,
  getIndustryCount,
}: HorizontalFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* City Filter */}
      <FilterDropdown
        label="City"
        icon={<MapPin className="h-4 w-4" />}
        options={cityOptions
          .map((city) => ({
            value: city,
            count: getCityCount(city),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)} // Top 20 cities
        selectedValues={selectedCities}
        onToggle={onToggleCity}
        onClear={onClearCities}
        emptyMessage="No cities available"
      />

      {/* Country Filter */}
      <FilterDropdown
        label="Country"
        icon={<Globe className="h-4 w-4" />}
        options={countryOptions
          .map((country) => ({
            value: country,
            count: getCountryCount(country),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)} // Top 20 countries
        selectedValues={selectedCountries}
        onToggle={onToggleCountry}
        onClear={onClearCountries}
        emptyMessage="No countries available"
      />

      {/* Industry Filter */}
      <FilterDropdown
        label="Industry"
        icon={<Building2 className="h-4 w-4" />}
        options={industryOptions
          .map((ind) => ({
            value: ind,
            count: getIndustryCount(ind),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)} // Top 20 industries
        selectedValues={selectedIndustries}
        onToggle={onToggleIndustry}
        onClear={onClearIndustries}
        emptyMessage="No industries available"
      />
    </div>
  );
}
