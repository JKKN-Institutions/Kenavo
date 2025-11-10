'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FilterOption {
  value: string;
  count: number;
}

interface FilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear?: () => void;
  emptyMessage?: string;
}

/**
 * Horizontal filter dropdown component
 * Opens a popover below the button with checkbox options
 */
export function FilterDropdown({
  label,
  icon,
  options,
  selectedValues,
  onToggle,
  onClear,
  emptyMessage = 'No options available',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`
            h-10 px-4 gap-2
            bg-[rgba(44,23,82,1)]
            border-[rgba(78,46,140,0.6)]
            text-[rgba(254,249,232,1)]
            hover:bg-[rgba(78,46,140,0.4)]
            hover:text-[rgba(254,249,232,1)]
            transition-all duration-200
            shadow-md
            ${isOpen ? 'border-[rgba(217,81,100,1)] bg-[rgba(78,46,140,0.4)]' : ''}
          `}
        >
          {icon && <span className="text-[rgba(217,81,100,1)]">{icon}</span>}
          <span className="font-medium">{label}</span>
          {selectedValues.length > 0 && (
            <Badge className="ml-1 h-5 px-1.5 text-xs bg-[rgba(217,81,100,1)] text-white border-0">
              {selectedValues.length}
            </Badge>
          )}
          <ChevronDown
            className={`h-4 w-4 text-[rgba(217,81,100,1)] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 p-0 bg-[rgba(44,23,82,1)] border-[rgba(78,46,140,0.6)] shadow-2xl"
      >
        {/* Content Area */}
        <div className="max-h-[400px] overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[rgba(44,23,82,0.5)] [&::-webkit-scrollbar-thumb]:bg-[rgba(217,81,100,0.6)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[rgba(217,81,100,0.8)]">
          {options.length === 0 ? (
            <p className="text-sm text-[rgba(254,249,232,0.6)] text-center py-4">
              {emptyMessage}
            </p>
          ) : (
            <div className="space-y-2">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 group hover:bg-[rgba(78,46,140,0.2)] p-2 rounded-md transition-all duration-200 cursor-pointer"
                  onClick={() => onToggle(option.value)}
                >
                  <Checkbox
                    id={`filter-${label}-${option.value}`}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={() => onToggle(option.value)}
                    className="border-[rgba(217,81,100,0.5)] data-[state=checked]:bg-[rgba(217,81,100,1)] data-[state=checked]:border-[rgba(217,81,100,1)] transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={`filter-${label}-${option.value}`}
                    className="flex-1 text-sm font-normal cursor-pointer leading-none text-[rgba(254,249,232,0.9)] hover:text-[rgba(254,249,232,1)] transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
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
        </div>

        {/* Footer Actions */}
        {selectedValues.length > 0 && (
          <div className="border-t border-[rgba(78,46,140,0.4)] p-3 bg-[rgba(44,23,82,0.8)]">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full text-[rgba(217,81,100,1)] hover:text-[rgba(217,65,66,0.8)] hover:bg-[rgba(78,46,140,0.4)] transition-all duration-200"
            >
              Clear {selectedValues.length} {selectedValues.length === 1 ? 'filter' : 'filters'}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
