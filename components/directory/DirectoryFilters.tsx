'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface FilterSection {
  title: string;
  options: Array<{ value: string; count: number }>;
  selectedValues: string[];
  onToggle: (value: string) => void;
  emptyMessage?: string;
}

interface DirectoryFiltersProps {
  yearOptions: string[];
  locationOptions: string[];
  industryOptions: string[];
  selectedYears: string[];
  selectedLocations: string[];
  selectedIndustries: string[];
  onToggleYear: (year: string) => void;
  onToggleLocation: (location: string) => void;
  onToggleIndustry: (industry: string) => void;
  onClearAll: () => void;
  getYearCount: (year: string) => number;
  getLocationCount: (location: string) => number;
  getIndustryCount: (industry: string) => number;
  activeFilterCount: number;
  className?: string;
}

/**
 * Filter panel component for the alumni directory
 * Features smart filters for:
 * - Graduation Year (multi-select)
 * - Location (multi-select)
 * - Industry/Company (multi-select)
 */
export function DirectoryFilters({
  yearOptions,
  locationOptions,
  industryOptions,
  selectedYears,
  selectedLocations,
  selectedIndustries,
  onToggleYear,
  onToggleLocation,
  onToggleIndustry,
  onClearAll,
  getYearCount,
  getLocationCount,
  getIndustryCount,
  activeFilterCount,
  className = '',
}: DirectoryFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    year: false,
    location: false,
    industry: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Prepare filter sections
  const filterSections: Array<FilterSection & { id: string }> = [
    {
      id: 'year',
      title: 'Graduation Year',
      options: yearOptions.map((year) => ({
        value: year,
        count: getYearCount(year),
      })),
      selectedValues: selectedYears,
      onToggle: onToggleYear,
      emptyMessage: 'No graduation years available',
    },
    {
      id: 'location',
      title: 'Location',
      options: locationOptions
        .map((loc) => ({
          value: loc,
          count: getLocationCount(loc),
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
        .slice(0, 20), // Show top 20 locations
      selectedValues: selectedLocations,
      onToggle: onToggleLocation,
      emptyMessage: 'No locations available',
    },
    {
      id: 'industry',
      title: 'Company/Industry',
      options: industryOptions
        .map((ind) => ({
          value: ind,
          count: getIndustryCount(ind),
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
        .slice(0, 20), // Show top 20 companies
      selectedValues: selectedIndustries,
      onToggle: onToggleIndustry,
      emptyMessage: 'No companies available',
    },
  ];

  return (
    <div className={`bg-[rgba(44,23,82,1)] border border-[rgba(78,46,140,0.6)] rounded-lg shadow-lg backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[rgba(78,46,140,0.4)] bg-gradient-to-r from-[rgba(44,23,82,1)] to-[rgba(78,46,140,0.3)]">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgba(217,81,100,1)]" />
          <h3 className="font-semibold text-base text-[rgba(254,249,232,1)]">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge className="ml-1 bg-[rgba(217,81,100,1)] text-white hover:bg-[rgba(217,65,66,0.8)] border-0">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 text-xs text-[rgba(217,81,100,1)] hover:text-[rgba(217,65,66,0.8)] hover:bg-[rgba(78,46,140,0.4)] transition-all duration-200"
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[rgba(44,23,82,0.5)] [&::-webkit-scrollbar-thumb]:bg-[rgba(217,81,100,0.6)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[rgba(217,81,100,0.8)]">
        <div className="p-2">
          {filterSections.map((section) => (
            <Collapsible
              key={section.id}
              open={expandedSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
              className="border-b border-[rgba(78,46,140,0.3)] last:border-b-0"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 hover:bg-[rgba(78,46,140,0.4)] text-[rgba(254,249,232,1)] transition-all duration-200"
                >
                  <span className="font-medium text-sm">{section.title}</span>
                  <div className="flex items-center gap-2">
                    {section.selectedValues.length > 0 && (
                      <Badge className="h-5 px-2 text-xs bg-[rgba(217,81,100,1)] text-white border-0">
                        {section.selectedValues.length}
                      </Badge>
                    )}
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-4 w-4 text-[rgba(217,81,100,1)]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[rgba(217,81,100,1)]" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4 pb-4">
                {section.options.length === 0 ? (
                  <p className="text-sm text-[rgba(254,249,232,0.6)] py-2">
                    {section.emptyMessage}
                  </p>
                ) : (
                  <div className="space-y-3 pt-2">
                    {section.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 group hover:bg-[rgba(78,46,140,0.2)] p-2 rounded-md transition-all duration-200">
                        <Checkbox
                          id={`${section.id}-${option.value}`}
                          checked={section.selectedValues.includes(option.value)}
                          onCheckedChange={() => section.onToggle(option.value)}
                          className="border-[rgba(217,81,100,0.5)] data-[state=checked]:bg-[rgba(217,81,100,1)] data-[state=checked]:border-[rgba(217,81,100,1)] transition-all duration-200"
                        />
                        <Label
                          htmlFor={`${section.id}-${option.value}`}
                          className="flex-1 text-sm font-normal cursor-pointer leading-none text-[rgba(254,249,232,0.9)] hover:text-[rgba(254,249,232,1)] transition-colors duration-200"
                        >
                          <span className="flex items-center justify-between">
                            <span className="truncate">{option.value}</span>
                            <span className="ml-2 text-xs text-[rgba(254,249,232,0.5)] bg-[rgba(78,46,140,0.4)] px-2 py-0.5 rounded-full">
                              {option.count}
                            </span>
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}
