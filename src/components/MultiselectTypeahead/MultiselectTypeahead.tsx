'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { FilterChip } from './FilterChip';
import { generateFilterOptions, getAvailableOperators } from './dataProcessing';
import type { 
  MultiselectTypeaheadProps, 
  FilterItem, 
  FilterOperator,
  EmployeeFilterOptions 
} from './types';

export function MultiselectTypeahead({
  employees,
  departments,
  teams,
  groups,
  selectedFilters,
  onFiltersChange,
  onEmployeeSelect,
  maxSelections = 50,
  placeholder = "Search employees, departments, teams...",
  disabled = false,
  className = ""
}: MultiselectTypeaheadProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Generate filter options from data
  const filterOptions = useMemo(() => 
    generateFilterOptions(employees, departments, teams, groups), 
    [employees, departments, teams, groups]
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return filterOptions;
    
    const lowerQuery = query.toLowerCase();
    const results = {
      relationships: filterOptions.relationships.filter(option => 
        option.label.toLowerCase().includes(lowerQuery) ||
        option.description.toLowerCase().includes(lowerQuery)
      ),
      groups: filterOptions.groups.filter(option => 
        option.label.toLowerCase().includes(lowerQuery) ||
        option.description.toLowerCase().includes(lowerQuery) ||
        option.category?.toLowerCase().includes(lowerQuery)
      ),
      attributes: filterOptions.attributes.filter(option => 
        option.label.toLowerCase().includes(lowerQuery) ||
        option.description.toLowerCase().includes(lowerQuery)
      ),
      people: filterOptions.people.filter(option => 
        option.name.toLowerCase().includes(lowerQuery) ||
        option.position.toLowerCase().includes(lowerQuery) ||
        option.department.toLowerCase().includes(lowerQuery) ||
        option.team.toLowerCase().includes(lowerQuery) ||
        option.email.toLowerCase().includes(lowerQuery)
      )
    };
    
    return results;
  }, [query, filterOptions]);

  // Get options to display (show all when no query, filtered when query exists)
  const displayOptions = useMemo(() => {
    return query.trim() ? filteredOptions : filterOptions;
  }, [query, filteredOptions, filterOptions]);

  // Create filter from selected option
  const createFilterFromOption = useCallback((option: any, category: string): FilterItem => {
    const id = `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let subject = '';
    let value: any = '';
    let displayValue = '';
    let availableOperators: FilterOperator[] = ['is', 'is not'];
    
    switch (category) {
      case 'relationships':
        subject = option.type === 'direct_report' ? 'Direct reports of' : 
                 option.type === 'supervisor' ? 'Supervised by' : 
                 option.type === 'peer' ? 'Peers of' : 'Relationship';
        value = option.targetPersonId;
        displayValue = option.targetPersonName;
        availableOperators = ['is', 'is not'];
        break;
        
      case 'groups':
        if (option.type === 'department') {
          subject = 'Department';
          value = option.groupName;
          displayValue = option.groupName;
        } else if (option.type === 'team') {
          subject = 'Team';
          value = option.groupName;
          displayValue = option.groupName;
        } else {
          subject = 'Member of';
          value = option.groupId;
          displayValue = option.groupName;
        }
        availableOperators = ['is', 'is not'];
        break;
        
      case 'attributes':
        subject = option.label;
        value = option.possibleValues?.[0] || '';
        displayValue = option.possibleValues?.[0] || 'Select value';
        availableOperators = getAvailableOperators(option.dataType);
        break;
        
      case 'people':
        subject = 'Person';
        value = option.employeeId;
        displayValue = `${option.name} (${option.position})`;
        availableOperators = ['is', 'is not'];
        break;
    }
    
    return {
      id,
      category: category as any,
      subject,
      operator: 'is',
      value,
      displayValue,
      availableOperators,
      metadata: { originalOption: option }
    };
  }, []);

  // Handle option selection
  const handleOptionSelect = useCallback((option: any, category: string) => {
    if (selectedFilters.length >= maxSelections) return;
    
    const newFilter = createFilterFromOption(option, category);
    const updatedFilters = [...selectedFilters, newFilter];
    onFiltersChange(updatedFilters);
    
    // Clear search query
    setQuery('');
    setIsOpen(false);
  }, [selectedFilters, maxSelections, createFilterFromOption, onFiltersChange]);

  // Update filter operator
  const updateFilterOperator = useCallback((filterId: string, newOperator: FilterOperator) => {
    const updatedFilters = selectedFilters.map(filter =>
      filter.id === filterId ? { ...filter, operator: newOperator } : filter
    );
    onFiltersChange(updatedFilters);
  }, [selectedFilters, onFiltersChange]);

  // Remove filter
  const removeFilter = useCallback((filterId: string) => {
    onFiltersChange(selectedFilters.filter(f => f.id !== filterId));
  }, [selectedFilters, onFiltersChange]);

  // Get filtered employees based on current filters
  const filteredEmployees = useMemo(() => {
    if (selectedFilters.length === 0) return employees;
    
    return employees.filter(employee => {
      return selectedFilters.every(filter => {
        // This is a simplified filter evaluation - you'd want to implement the full logic
        // from the dataProcessing.ts file here
        return true; // Placeholder
      });
    });
  }, [employees, selectedFilters]);

  // Notify parent of filtered employees
  React.useEffect(() => {
    if (onEmployeeSelect) {
      onEmployeeSelect(filteredEmployees);
    }
  }, [filteredEmployees, onEmployeeSelect]);

  return (
    <div className={`multiselect-container ${className}`} ref={containerRef}>
              {/* Filter Chips Display */}
        {selectedFilters.length > 0 && (
          <div className="filter-chips-container mb-3 p-3 bg-[#05084A]/[0.02] rounded-xl">
            <div className="text-sm text-gray-600 mb-2">
              Active Filters ({selectedFilters.length}/{maxSelections})
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedFilters.map(filter => (
                <FilterChip
                  key={filter.id}
                  filter={filter}
                  onOperatorChange={updateFilterOperator}
                  onRemove={removeFilter}
                />
              ))}
            </div>
          </div>
        )}

      {/* Headless UI Combobox */}
      <Combobox 
        value={null} 
        onChange={(option: any) => {
          // This will be handled by the individual option clicks
        }}
        disabled={disabled}
      >
                  <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Combobox.Input
                className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
                placeholder={placeholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsOpen(true)}
                onClick={() => setIsOpen(true)}
                aria-label="Search for employees, departments, teams, or attributes"
              />
            <Combobox.Button 
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          {/* Dropdown Options */}
          {isOpen && (
            <Combobox.Options className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {/* Relationships Section */}
              {displayOptions.relationships.length > 0 && (
                <div className="category-section">
                  <div className="category-header px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Relationships
                  </div>
                  {displayOptions.relationships.map((option) => (
                    <Combobox.Option
                      key={option.id}
                      value={option}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                      onClick={() => handleOptionSelect(option, 'relationships')}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs opacity-75">{option.description}</span>
                      </div>
                    </Combobox.Option>
                  ))}
                </div>
              )}

              {/* Groups Section */}
              {displayOptions.groups.length > 0 && (
                <div className="category-section">
                  <div className="category-header px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Groups
                  </div>
                  {displayOptions.groups.map((option) => (
                    <Combobox.Option
                      key={option.id}
                      value={option}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                      onClick={() => handleOptionSelect(option, 'groups')}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs opacity-75">
                          {option.category} • {option.memberCount} members
                        </span>
                      </div>
                    </Combobox.Option>
                  ))}
                </div>
              )}

              {/* Attributes Section */}
              {displayOptions.attributes.length > 0 && (
                <div className="category-section">
                  <div className="category-header px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Select by attribute
                  </div>
                  {displayOptions.attributes.map((option) => (
                    <Combobox.Option
                      key={option.id}
                      value={option}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                      onClick={() => handleOptionSelect(option, 'attributes')}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs opacity-75">{option.description}</span>
                      </div>
                    </Combobox.Option>
                  ))}
                </div>
              )}

              {/* People Section */}
              {displayOptions.people.length > 0 && (
                <div className="category-section">
                  <div className="category-header px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    People
                  </div>
                  {displayOptions.people.map((option) => (
                    <Combobox.Option
                      key={option.id}
                      value={option}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                      onClick={() => handleOptionSelect(option, 'people')}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{option.name}</span>
                        <span className="text-xs opacity-75">
                          {option.position} • {option.department} • {option.team}
                        </span>
                      </div>
                    </Combobox.Option>
                  ))}
                </div>
              )}

              {/* No results message */}
              {query.trim() && Object.values(filteredOptions).every(category => category.length === 0) && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results found for "{query}"
                </div>
              )}

              {/* Empty state when no query */}
              {!query.trim() && (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  Start typing to search or browse categories above
                </div>
              )}
            </Combobox.Options>
          )}
        </div>
      </Combobox>

      {/* Results summary */}
      {selectedFilters.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      )}
    </div>
  );
}
