import { useMemo, useState, useCallback } from 'react';
import { Profile } from '@/lib/types/database';

export interface FilterState {
  years: string[];
  locations: string[];
  industries: string[];
}

export interface FilterOptions {
  availableYears: string[];
  availableLocations: string[];
  availableIndustries: string[];
}

/**
 * Custom hook for managing profile filters (year, location, industry)
 * Provides filter state management and filtered profile results
 *
 * @param profiles - Array of profiles to filter
 * @returns Filter state, filtered profiles, and control functions
 */
export function useProfileFilters(profiles: Profile[]) {
  const [filters, setFilters] = useState<FilterState>({
    years: [],
    locations: [],
    industries: [],
  });

  // Extract unique filter options from profiles
  const filterOptions = useMemo<FilterOptions>(() => {
    const years = new Set<string>();
    const locations = new Set<string>();
    const industries = new Set<string>();

    profiles.forEach((profile) => {
      // Extract graduation years
      if (profile.year_graduated) {
        years.add(profile.year_graduated);
      }

      // Extract locations
      if (profile.location) {
        locations.add(profile.location);
      }

      // Extract industries from designation_organisation
      if (profile.designation_organisation) {
        // Try to extract industry/company name
        // Format is typically "Position / Company" or "Company"
        const parts = profile.designation_organisation.split('/').map(p => p.trim());
        const company = parts.length > 1 ? parts[1] : parts[0];
        if (company) {
          industries.add(company);
        }
      }
    });

    return {
      availableYears: Array.from(years).sort(),
      availableLocations: Array.from(locations).sort(),
      availableIndustries: Array.from(industries).sort(),
    };
  }, [profiles]);

  // Apply filters to profiles
  const filteredProfiles = useMemo(() => {
    let result = profiles;

    // Filter by year
    if (filters.years.length > 0) {
      result = result.filter((profile) =>
        profile.year_graduated && filters.years.includes(profile.year_graduated)
      );
    }

    // Filter by location
    if (filters.locations.length > 0) {
      result = result.filter((profile) =>
        profile.location && filters.locations.includes(profile.location)
      );
    }

    // Filter by industry
    if (filters.industries.length > 0) {
      result = result.filter((profile) => {
        if (!profile.designation_organisation) return false;

        const parts = profile.designation_organisation.split('/').map(p => p.trim());
        const company = parts.length > 1 ? parts[1] : parts[0];
        return company && filters.industries.includes(company);
      });
    }

    return result;
  }, [profiles, filters]);

  // Filter control functions
  const toggleYear = useCallback((year: string) => {
    setFilters((prev) => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter((y) => y !== year)
        : [...prev.years, year],
    }));
  }, []);

  const toggleLocation = useCallback((location: string) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
    }));
  }, []);

  const toggleIndustry = useCallback((industry: string) => {
    setFilters((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      years: [],
      locations: [],
      industries: [],
    });
  }, []);

  const removeFilter = useCallback((type: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  }, []);

  const hasActiveFilters = useMemo(
    () => filters.years.length > 0 || filters.locations.length > 0 || filters.industries.length > 0,
    [filters]
  );

  const activeFilterCount = useMemo(
    () => filters.years.length + filters.locations.length + filters.industries.length,
    [filters]
  );

  // Get counts for each filter option
  const getYearCount = useCallback(
    (year: string) => profiles.filter((p) => p.year_graduated === year).length,
    [profiles]
  );

  const getLocationCount = useCallback(
    (location: string) => profiles.filter((p) => p.location === location).length,
    [profiles]
  );

  const getIndustryCount = useCallback(
    (industry: string) => {
      return profiles.filter((p) => {
        if (!p.designation_organisation) return false;
        const parts = p.designation_organisation.split('/').map(p => p.trim());
        const company = parts.length > 1 ? parts[1] : parts[0];
        return company === industry;
      }).length;
    },
    [profiles]
  );

  return {
    // Filter state
    filters,
    filterOptions,
    hasActiveFilters,
    activeFilterCount,

    // Filtered results
    profiles: filteredProfiles,
    resultCount: filteredProfiles.length,
    totalCount: profiles.length,

    // Control functions
    toggleYear,
    toggleLocation,
    toggleIndustry,
    clearAllFilters,
    removeFilter,

    // Count functions
    getYearCount,
    getLocationCount,
    getIndustryCount,
  };
}
