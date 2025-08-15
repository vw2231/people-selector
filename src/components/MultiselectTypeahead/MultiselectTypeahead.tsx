'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@heroicons/react/24/outline';
import { FilterChip } from './FilterChip';
import { generateFilterOptions } from './dataProcessing';
import type { 
  FilterItem, 
  Employee,
  Department,
  Team,
  Group
} from './types';

interface MultiselectTypeaheadProps {
  employees: Employee[];
  departments: Department[];
  teams: Team[];
  groups: Group[];
  selectedFilters: FilterItem[];
  onFiltersChange: (filters: FilterItem[]) => void;
  maxSelections?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MultiselectTypeahead: React.FC<MultiselectTypeaheadProps> = ({
  employees,
  departments,
  teams,
  groups,
  selectedFilters,
  onFiltersChange,
  maxSelections = 50,
  placeholder = "Search employees, departments, teams...",
  disabled = false,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedRelationships, setExpandedRelationships] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  const [attributeSearchQuery, setAttributeSearchQuery] = useState('');
  const [valueSearchQuery, setValueSearchQuery] = useState('');
  const [relationshipSearchQuery, setRelationshipSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to clear all search queries
  const clearAllSearchQueries = useCallback(() => {
    setAttributeSearchQuery('');
    setValueSearchQuery('');
    setRelationshipSearchQuery('');
    setGroupSearchQuery('');
    setPeopleSearchQuery('');
    setSelectedAttribute(null);
    setActiveSubmenu(null);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        clearAllSearchQueries();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearAllSearchQueries]);

  // Close dropdown when query is empty
  useEffect(() => {
    if (!query.trim()) {
      // Don't close dropdown when query is empty - keep it open to show default view
      // setIsDropdownOpen(false);
    }
  }, [query]);

  // Clear search queries when dropdown closes
  useEffect(() => {
    if (!isDropdownOpen) {
      clearAllSearchQueries();
    }
  }, [isDropdownOpen, clearAllSearchQueries]);

  // Generate all available filter options
  const filterOptions = useMemo(() => 
    generateFilterOptions(employees, departments, teams, groups), 
    [employees, departments, teams, groups]
  );

  // Handle relationship checkbox changes
  const handleRelationshipChange = useCallback((relationshipId: string, checked: boolean) => {
    if (checked) {
      // Add relationship filter immediately
      const relationship = filterOptions.relationships.find(r => r.id === relationshipId);
      if (relationship) {
        const newFilter: FilterItem = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'relationships',
          subject: relationship.label,
          operator: 'is',
          value: relationship.targetPersonId,
          displayValue: relationship.targetPersonName,
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: relationship }
        };
        const updatedFilters = [...selectedFilters, newFilter];
        onFiltersChange(updatedFilters);
      }
    } else {
      // Remove relationship filter immediately
      const filterToRemove = selectedFilters.find(f => 
        f.category === 'relationships' && 
        f.metadata?.originalOption && 
        (f.metadata.originalOption as { id: string }).id === relationshipId
      );
      if (filterToRemove) {
        const updatedFilters = selectedFilters.filter(f => f.id !== filterToRemove.id);
        onFiltersChange(updatedFilters);
      }
    }
  }, [filterOptions.relationships, selectedFilters, onFiltersChange]);

  // Handle group checkbox changes
  const handleGroupChange = useCallback((groupId: string, checked: boolean) => {
    if (checked) {
      // Add group filter immediately
      const group = filterOptions.groups.find(g => g.groupId === groupId);
      if (group) {
        const newFilter: FilterItem = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'groups',
          subject: group.label,
          operator: 'is',
          value: group.groupId,
          displayValue: group.groupName,
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: group }
        };
        const updatedFilters = [...selectedFilters, newFilter];
        onFiltersChange(updatedFilters);
      }
    } else {
      // Remove group filter immediately
      const filterToRemove = selectedFilters.find(f => 
        f.category === 'groups' && 
        f.value === groupId
      );
      if (filterToRemove) {
        const updatedFilters = selectedFilters.filter(f => f.id !== filterToRemove.id);
        onFiltersChange(updatedFilters);
      }
    }
  }, [filterOptions.groups, selectedFilters, onFiltersChange]);

  // Handle people checkbox changes
  const handlePersonChange = useCallback((employeeId: string, checked: boolean) => {
    if (checked) {
      // Add person filter immediately
      const person = filterOptions.people.find(p => p.employeeId === employeeId);
      if (person) {
        const newFilter: FilterItem = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'people',
          subject: 'Person',
          operator: 'is',
          value: employeeId,
          displayValue: person.label,
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: person }
        };
        const updatedFilters = [...selectedFilters, newFilter];
        onFiltersChange(updatedFilters);
      }
    } else {
      // Remove person filter immediately
      const filterToRemove = selectedFilters.find(f => 
        f.category === 'people' && 
        f.value === employeeId
      );
      if (filterToRemove) {
        const updatedFilters = selectedFilters.filter(f => f.id !== filterToRemove.id);
        onFiltersChange(updatedFilters);
      }
    }
  }, [filterOptions.people, selectedFilters, onFiltersChange]);

  // Handle attribute value checkbox changes
  const handleAttributeValueChange = useCallback((attributeKey: string, value: string | number, checked: boolean) => {
    if (checked) {
      // Add attribute filter immediately
      const attr = filterOptions.attributes.find(a => a.attributeKey === attributeKey);
      if (attr) {
        const newFilter: FilterItem = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'attributes',
          subject: attr.label,
          operator: 'is',
          value: `${attributeKey}:${value}`,
          displayValue: String(value),
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: { ...attr, selectedValue: value } }
        };
        const updatedFilters = [...selectedFilters, newFilter];
        onFiltersChange(updatedFilters);
      }
    } else {
      // Remove attribute filter immediately
      const filterToRemove = selectedFilters.find(f => 
        f.category === 'attributes' && 
        f.value === `${attributeKey}:${value}`
      );
      if (filterToRemove) {
        const updatedFilters = selectedFilters.filter(f => f.id !== filterToRemove.id);
        onFiltersChange(updatedFilters);
      }
    }
  }, [filterOptions.attributes, selectedFilters, onFiltersChange]);

  // Update filter operator
  const updateFilterOperator = useCallback((filterId: string, newOperator: string) => {
    const updatedFilters = selectedFilters.map(filter =>
      filter.id === filterId ? { ...filter, operator: newOperator as FilterItem['operator'] } : filter
    );
    onFiltersChange(updatedFilters);
  }, [selectedFilters, onFiltersChange]);

  // Remove filter
  const removeFilter = useCallback((filterId: string) => {
    const newFilters = selectedFilters.filter(f => f.id !== filterId);
    onFiltersChange(newFilters);
  }, [selectedFilters, onFiltersChange]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onFiltersChange([]);
    setQuery('');
  }, [onFiltersChange]);

  // Get top 3 relationships and groups for default view
  const topRelationships = useMemo(() => 
    filterOptions.relationships.slice(0, 3), 
    [filterOptions.relationships]
  );
  
  const topGroups = useMemo(() => 
    filterOptions.groups.slice(0, 3), 
    [filterOptions.groups]
  );

  // Flatten all options for display
  const allOptions = useMemo(() => {
    const options: Array<{
      id: string;
      label: string;
      description?: string;
      category: string;
      type: string;
      value: string | number;
      originalOption: unknown;
    }> = [];

    // Add relationships
    filterOptions.relationships.forEach(rel => {
      options.push({
        id: rel.id,
        label: rel.label,
        description: rel.description,
        category: 'Relationships',
        type: 'relationship',
        value: rel.targetPersonId,
        originalOption: rel
      });
    });

    // Add groups
    filterOptions.groups.forEach(group => {
      options.push({
        id: group.id,
        label: group.label,
        description: group.description,
        category: group.category || 'Groups',
        type: 'group',
        value: group.groupId,
        originalOption: group
      });
    });

    // Add attributes
    filterOptions.attributes.forEach(attr => {
      options.push({
        id: attr.id,
        label: attr.label,
        description: attr.description,
        category: 'Attributes',
        type: 'attribute',
        value: attr.attributeKey,
        originalOption: attr
      });
    });

    // Add people
    filterOptions.people.forEach(person => {
      options.push({
        id: person.id,
        label: person.label,
        description: `${person.position} • ${person.department}`,
        category: 'People',
        type: 'person',
        value: person.employeeId,
        originalOption: person
      });
    });

    return options;
  }, [filterOptions]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return allOptions;
    
    const searchTerm = query.toLowerCase();
    return allOptions.filter(option => {
      const searchableText = [
        option.label,
        option.description || '',
        option.category || ''
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
  }, [query, allOptions]);

  // Display options (show all categories when no query)
  const displayOptions = useMemo(() => {
    if (!query.trim()) return allOptions;
    return filteredOptions;
  }, [query, allOptions, filteredOptions]);

  // Create a filter from a selected option
  const createFilterFromOption = useCallback((option: {
    id: string;
    label: string;
    description?: string;
    category: string;
    type: string;
    value: string | number;
    originalOption: unknown;
  }) => {
    if (selectedFilters.length >= maxSelections) return;
    
    let newFilter: FilterItem;
    
    switch (option.type) {
      case 'relationship':
        const relationshipOption = option.originalOption as { type: string; targetPersonName: string };
        newFilter = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'relationships',
          subject: option.label,
          operator: 'is',
          value: option.value,
          displayValue: relationshipOption.targetPersonName,
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: option.originalOption }
        };
        break;
        
      case 'group':
        newFilter = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'groups',
          subject: option.label,
          operator: 'is',
          value: option.value,
          displayValue: (option.originalOption as { groupName: string }).groupName,
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: option.originalOption }
        };
        break;
        
      case 'attribute':
        newFilter = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'attributes',
          subject: option.label,
          operator: 'is',
          value: option.value,
          displayValue: 'Select value',
          availableOperators: ['is', 'is not', 'contains', 'does not contain'],
          metadata: { originalOption: option.originalOption }
        };
        break;
        
      case 'person':
        newFilter = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'people',
          subject: 'Person',
          operator: 'is',
          value: option.value,
          displayValue: option.label,
          availableOperators: ['is', 'is not'],
          metadata: { originalOption: option.originalOption }
        };
        break;
        
      default:
        return;
    }
    
    const updatedFilters = [...selectedFilters, newFilter];
    onFiltersChange(updatedFilters);
    setQuery('');
    setIsDropdownOpen(false);
  }, [selectedFilters, maxSelections, onFiltersChange]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Field with Clear Icon */}
      <div className="relative">
        <div className="flex flex-wrap items-center gap-1 px-2 py-1 border border-[#DADADA] rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#1F1F1F] focus-within:border-transparent min-h-[40px]">
          {/* Selected Filters Display */}
          {selectedFilters.map((filter) => (
            <FilterChip
              key={filter.id}
              filter={filter}
              onOperatorChange={(operator) => updateFilterOperator(filter.id, operator)}
              onRemove={() => removeFilter(filter.id)}
            />
          ))}
          
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            disabled={disabled}
            placeholder={selectedFilters.length === 0 ? placeholder : ""}
            className="flex-1 min-w-0 border-none outline-none bg-transparent text-sm disabled:bg-transparent disabled:cursor-not-allowed"
          />
          
          {/* Clear All Filters Icon */}
          {selectedFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Clear all filters"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown with Default Search Page or Search Results */}
      {isDropdownOpen && (
        <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg h-96 overflow-y-auto overflow-x-hidden max-w-full">
          {!query.trim() ? (
            // Side-by-Side Layout
            <div className="flex h-full">
              {/* Left Side - Category Filters */}
              <div className="w-1/3 border-r border-gray-200 flex-shrink-0 overflow-y-hidden">
                <div className="p-1 space-y-0">
                  <button
                    onMouseEnter={() => {
                      setActiveSubmenu('relationships');
                      setSelectedAttribute(null);
                    }}
                    className={`w-full text-left px-4 h-8 text-sm text-gray-700 hover:bg-gray-50 rounded-[10px] flex items-center justify-between transition-colors min-w-0 ${
                      activeSubmenu === 'relationships' ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="truncate flex-1">Relationships</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onMouseEnter={() => {
                      setActiveSubmenu('groups');
                      setSelectedAttribute(null);
                    }}
                    className={`w-full text-left px-4 h-8 text-sm text-gray-700 hover:bg-gray-50 rounded-[10px] flex items-center justify-between transition-colors min-w-0 ${
                      activeSubmenu === 'groups' ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="truncate flex-1">Groups</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onMouseEnter={() => {
                      setActiveSubmenu('attributes');
                      setSelectedAttribute(null);
                    }}
                    className={`w-full text-left px-4 h-8 text-sm text-gray-700 hover:bg-gray-50 rounded-[10px] flex items-center justify-between transition-colors min-w-0 ${
                      activeSubmenu === 'attributes' ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="truncate flex-1">Attributes</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onMouseEnter={() => {
                      setActiveSubmenu('people');
                      setSelectedAttribute(null);
                    }}
                    className={`w-full text-left px-4 h-8 text-sm text-gray-700 hover:bg-gray-50 rounded-[10px] flex items-center justify-between transition-colors min-w-0 ${
                      activeSubmenu === 'people' ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="truncate flex-1">People</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Side - Category Content */}
              <div className="w-2/3 overflow-y-auto overflow-x-hidden">
                {activeSubmenu === null ? (
                  // Default view - show a message
                  <div className="p-4 text-center text-gray-500">
                    Select a category to browse options
                  </div>
                ) : activeSubmenu === 'relationships' ? (
                  // Relationships Content
                  <div 
                    className="h-full flex flex-col"
                    onMouseEnter={() => {
                      const input = document.querySelector('input[placeholder="Search relationships..."]') as HTMLInputElement;
                      if (input) input.focus();
                    }}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {/* Search Input for Relationships */}
                    <div className="sticky top-0 z-10 p-2" style={{
                      background: 'rgba(255, 255, 255, 0.30)',
                      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 #FFF inset, 0 0 0.5px 0 rgba(0, 0, 0, 0.15)'
                    }}>
                      <input
                        type="text"
                        placeholder="Search relationships..."
                        value={relationshipSearchQuery}
                        onChange={(e) => setRelationshipSearchQuery(e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus={false}
                      />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-1 space-y-0">
                      {(() => {
                        const filteredRelationships = filterOptions.relationships.filter(rel => 
                          rel.label.toLowerCase().includes(relationshipSearchQuery.toLowerCase()) ||
                          (rel.description && rel.description.toLowerCase().includes(relationshipSearchQuery.toLowerCase())) ||
                          rel.targetPersonName.toLowerCase().includes(relationshipSearchQuery.toLowerCase())
                        );
                        
                        if (relationshipSearchQuery && filteredRelationships.length === 0) {
                          return (
                            <div className="px-4 py-4 text-center">
                              <div className="text-gray-700 font-medium mb-1">No results found</div>
                              <div className="text-gray-500 text-sm">It looks like your search is a bit too specific. Try adjusting or resetting your search to see more results.</div>
                            </div>
                          );
                        }
                        
                        return filteredRelationships.map((rel) => {
                          const isSelected = selectedFilters.some(f => 
                            f.category === 'relationships' && 
                            f.metadata?.originalOption && 
                            (f.metadata.originalOption as { id: string }).id === rel.id
                          );
                          
                          return (
                            <div key={rel.id} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                              <Checkbox.Root
                                id={`relationship-${rel.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleRelationshipChange(rel.id, checked === true)}
                                className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                              >
                                <Checkbox.Indicator>
                                  <CheckIcon className="w-3 h-3 text-white" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                              <label htmlFor={`relationship-${rel.id}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                <span className="block truncate">{rel.label}</span>
                              </label>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : activeSubmenu === 'groups' ? (
                  // Groups Content
                  <div 
                    className="h-full flex flex-col"
                    onMouseEnter={() => {
                      const input = document.querySelector('input[placeholder="Search groups..."]') as HTMLInputElement;
                      if (input) input.focus();
                    }}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {/* Search Input for Groups */}
                    <div className="sticky top-0 z-10 p-2" style={{
                      background: 'rgba(255, 255, 255, 0.30)',
                      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 #FFF inset, 0 0 0.5px 0 rgba(0, 0, 0, 0.15)'
                    }}>
                      <input
                        type="text"
                        placeholder="Search groups..."
                        value={groupSearchQuery}
                        onChange={(e) => setGroupSearchQuery(e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus={false}
                      />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-1 space-y-0">
                      {(() => {
                        const filteredGroups = filterOptions.groups.filter(group => 
                          group.label.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                          (group.description && group.description.toLowerCase().includes(groupSearchQuery.toLowerCase()))
                        );
                        
                        if (groupSearchQuery && filteredGroups.length === 0) {
                          return (
                            <div className="px-4 py-4 text-center">
                              <div className="text-gray-700 font-medium mb-1">No results found</div>
                              <div className="text-gray-500 text-sm">It looks like your search is a bit too specific. Try adjusting or resetting your search to see more results.</div>
                            </div>
                          );
                        }
                        
                        return filteredGroups.map((group) => {
                          const isSelected = selectedFilters.some(f => 
                            f.category === 'groups' && 
                            f.value === group.groupId
                          );
                          
                          return (
                            <div key={group.id} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                              <Checkbox.Root
                                id={`group-${group.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleGroupChange(group.groupId, checked === true)}
                                className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                              >
                                <Checkbox.Indicator>
                                  <CheckIcon className="w-3 h-3 text-white" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                              <label htmlFor={`group-${group.id}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                <span className="block truncate">{group.label}</span>
                              </label>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : activeSubmenu === 'attributes' ? (
                  // Attributes Content - Two Column Layout
                  <div className="flex h-full">
                    {/* First Column - Attribute List */}
                    <div 
                      className="w-1/2 border-r border-gray-200 overflow-y-auto flex-shrink-0"
                      onMouseEnter={() => {
                        const input = document.querySelector('input[placeholder="Search attributes..."]') as HTMLInputElement;
                        if (input) input.focus();
                      }}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      {/* Search Input for Attributes */}
                      <div className="sticky top-0 bg-white z-10 p-2">
                        <input
                          type="text"
                          placeholder="Search attributes..."
                          value={attributeSearchQuery}
                          onChange={(e) => setAttributeSearchQuery(e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus={false}
                        />
                      </div>
                      
                      <div className="p-1 space-y-0">
                        {(() => {
                          const filteredAttributes = filterOptions.attributes.filter(attr => 
                            attr.label.toLowerCase().includes(attributeSearchQuery.toLowerCase()) ||
                            (attr.description && attr.description.toLowerCase().includes(attributeSearchQuery.toLowerCase()))
                          );
                          
                          if (attributeSearchQuery && filteredAttributes.length === 0) {
                            return (
                              <div className="px-4 py-4 text-center">
                                <div className="text-gray-700 font-medium mb-1">No results found</div>
                                <div className="text-gray-400 text-sm">It looks like your search is a bit too specific. Try adjusting or resetting your search to see more results.</div>
                              </div>
                            );
                          }
                          
                          return filteredAttributes.map((attr) => (
                            <button
                              key={attr.id}
                              onMouseEnter={() => setSelectedAttribute(attr.id)}
                              className={`w-full text-left px-4 pr-1 h-8 text-sm text-gray-700 hover:bg-gray-50 rounded-[10px] transition-colors min-w-0 flex items-center justify-between ${
                                selectedAttribute === attr.id ? 'bg-gray-100' : ''
                              }`}
                            >
                              <span className="truncate flex-1">{attr.label}</span>
                              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Second Column - Attribute Values */}
                    <div 
                      className="w-1/2 flex-shrink-0"
                      onMouseEnter={() => {
                        const input = document.querySelector('input[placeholder="Search values..."]') as HTMLInputElement;
                        if (input) input.focus();
                      }}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      {selectedAttribute ? (
                        <div className="h-full flex flex-col">
                          {(() => {
                            const attr = filterOptions.attributes.find(a => a.id === selectedAttribute);
                            if (!attr) return null;
                            
                            return (
                              <div className="h-full flex flex-col">
                                {/* Search Input for Values */}
                                <div className="sticky top-0 z-10 p-2" style={{
                                  background: 'rgba(255, 255, 255, 0.30)',
                                  boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 #FFF inset, 0 0 0.5px 0 rgba(0, 0, 0, 0.15)'
                                }}>
                                  <input
                                    type="text"
                                    placeholder="Search values..."
                                    value={valueSearchQuery}
                                    onChange={(e) => setValueSearchQuery(e.target.value)}
                                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus={false}
                                  />
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-1 space-y-0">
                                  {attr.dataType === 'enum' && attr.possibleValues ? (
                                  // Enum attributes - show predefined values
                                  attr.possibleValues
                                    .filter(value => 
                                      value.toLowerCase().includes(valueSearchQuery.toLowerCase())
                                    )
                                    .map((value) => {
                                      const isSelected = selectedFilters.some(f => 
                                        f.category === 'attributes' && 
                                        f.value === `${attr.attributeKey}:${value}`
                                      );
                                      
                                      return (
                                        <div key={value} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                                          <Checkbox.Root
                                            id={`attribute-${attr.attributeKey}-${value}`}
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleAttributeValueChange(attr.attributeKey, value, checked === true)}
                                            className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                          >
                                            <Checkbox.Indicator>
                                              <CheckIcon className="w-3 h-3 text-white" />
                                            </Checkbox.Indicator>
                                          </Checkbox.Root>
                                          <label htmlFor={`attribute-${attr.attributeKey}-${value}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                            <span className="block truncate">{value}</span>
                                          </label>
                                        </div>
                                      );
                                    })
                                ) : attr.dataType === 'string' ? (
                                  // String attributes - show unique values from employee data
                                  (() => {
                                    const uniqueValues = [...new Set(employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean))];
                                    const filteredValues = uniqueValues
                                      .filter(value => 
                                        String(value).toLowerCase().includes(valueSearchQuery.toLowerCase())
                                      )
                                      .slice(0, 20);
                                    
                                    return filteredValues.length > 0 ? (
                                      filteredValues.map((value) => {
                                        const isSelected = selectedFilters.some(f => 
                                          f.category === 'attributes' && 
                                          f.value === `${attr.attributeKey}:${value}`
                                        );
                                        
                                        return (
                                          <div key={String(value)} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                                            <Checkbox.Root
                                              id={`attribute-${attr.attributeKey}-${value}`}
                                              checked={isSelected}
                                              onCheckedChange={(checked) => handleAttributeValueChange(attr.attributeKey, String(value), checked === true)}
                                              className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                            >
                                              <Checkbox.Indicator>
                                                <CheckIcon className="w-3 h-3 text-white" />
                                              </Checkbox.Indicator>
                                            </Checkbox.Root>
                                            <label htmlFor={`attribute-${attr.attributeKey}-${value}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                              <span className="block truncate">{String(value)}</span>
                                            </label>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="px-4 py-2 text-sm text-gray-500">
                                        {valueSearchQuery ? 'No values match your search' : 'No values available'}
                                      </div>
                                    );
                                  })()
                                ) : attr.dataType === 'number' ? (
                                  // Number attributes - show range or common values
                                  (() => {
                                    const values = employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean) as number[];
                                    if (values.length > 0) {
                                      const min = Math.min(...values);
                                      const max = Math.max(...values);
                                      const commonValues = [min, Math.round((min + max) / 2), max];
                                      const filteredValues = commonValues.filter(value => {
                                        const displayValue = attr.attributeKey === 'weeklyHours' ? `${value} hours` : 
                                                           attr.attributeKey === 'probationLength' ? `${value} months` : 
                                                           String(value);
                                        return displayValue.toLowerCase().includes(valueSearchQuery.toLowerCase());
                                      });
                                      
                                      return filteredValues.length > 0 ? (
                                        filteredValues.map((value) => {
                                          // Format display value based on attribute type
                                          let displayValue = String(value);
                                          if (attr.attributeKey === 'weeklyHours') {
                                            displayValue = `${value} hours`;
                                          } else if (attr.attributeKey === 'probationLength') {
                                            displayValue = `${value} months`;
                                          }
                                          
                                          const isSelected = selectedFilters.some(f => 
                                            f.category === 'attributes' && 
                                            f.value === `${attr.attributeKey}:${value}`
                                          );
                                          
                                          return (
                                            <div key={value} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                                              <Checkbox.Root
                                                id={`attribute-${attr.attributeKey}-${value}`}
                                                checked={isSelected}
                                                onCheckedChange={(checked) => handleAttributeValueChange(attr.attributeKey, value, checked === true)}
                                                className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                              >
                                                <Checkbox.Indicator>
                                                  <CheckIcon className="w-3 h-3 text-white" />
                                                </Checkbox.Indicator>
                                              </Checkbox.Root>
                                              <label htmlFor={`attribute-${attr.attributeKey}-${value}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                                <span className="block truncate">{displayValue}</span>
                                              </label>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                          {valueSearchQuery ? 'No values match your search' : 'No values available'}
                                        </div>
                                      );
                                    }
                                    return (
                                      <div className="px-4 py-2 text-sm text-gray-500">
                                        No values available
                                      </div>
                                    );
                                  })()
                                ) : attr.dataType === 'date' ? (
                                  // Date attributes - show full dates
                                  (() => {
                                    const dateValues = employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean) as string[];
                                    if (dateValues.length > 0) {
                                      // Get unique dates and format them
                                      const uniqueDates = [...new Set(dateValues)];
                                      const filteredDates = uniqueDates
                                        .filter(dateStr => {
                                          const date = new Date(dateStr);
                                          const formattedDate = date.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          });
                                          return formattedDate.toLowerCase().includes(valueSearchQuery.toLowerCase());
                                        })
                                        .slice(0, 20);
                                      
                                      return filteredDates.length > 0 ? (
                                        filteredDates.map((dateStr) => {
                                          const date = new Date(dateStr);
                                          const formattedDate = date.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          });
                                          
                                          const isSelected = selectedFilters.some(f => 
                                            f.category === 'attributes' && 
                                            f.value === `${attr.attributeKey}:${dateStr}`
                                          );
                                          
                                          return (
                                            <div key={dateStr} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                                              <Checkbox.Root
                                                id={`attribute-${attr.attributeKey}-${dateStr}`}
                                                checked={isSelected}
                                                onCheckedChange={(checked) => handleAttributeValueChange(attr.attributeKey, dateStr, checked === true)}
                                                className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                              >
                                                <Checkbox.Indicator>
                                                  <CheckIcon className="w-3 h-3 text-white" />
                                                </Checkbox.Indicator>
                                              </Checkbox.Root>
                                              <label htmlFor={`attribute-${attr.attributeKey}-${dateStr}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                                <span className="block truncate">{formattedDate}</span>
                                              </label>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                          {valueSearchQuery ? 'No values match your search' : 'No values available'}
                                        </div>
                                      );
                                    }
                                    return (
                                      <div className="px-4 py-0 text-sm text-gray-500">
                                        No values available
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <div className="px-4 py-2 text-sm text-gray-500">
                                    Unsupported data type
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      ) : (
                        <div className="p-4 text-left text-gray-500 text-sm">
                          Select an attribute to see its values
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeSubmenu === 'people' ? (
                  // People Content
                  <div 
                    className="h-full flex flex-col"
                    onMouseEnter={() => {
                      const input = document.querySelector('input[placeholder="Search people..."]') as HTMLInputElement;
                      if (input) input.focus();
                    }}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {/* Search Input for People */}
                    <div className="sticky top-0 z-10 p-2" style={{
                      background: 'rgba(255, 255, 255, 0.30)',
                      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 #FFF inset, 0 0 0.5px 0 rgba(0, 0, 0, 0.15)'
                    }}>
                      <input
                        type="text"
                        placeholder="Search people..."
                        value={peopleSearchQuery}
                        onChange={(e) => setPeopleSearchQuery(e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus={false}
                      />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-1 space-y-0">
                      {(() => {
                        const filteredPeople = filterOptions.people.filter(person => 
                          person.label.toLowerCase().includes(peopleSearchQuery.toLowerCase()) ||
                          (person.position && person.position.toLowerCase().includes(peopleSearchQuery.toLowerCase())) ||
                          (person.department && person.department.toLowerCase().includes(peopleSearchQuery.toLowerCase()))
                        );
                        
                        if (peopleSearchQuery && filteredPeople.length === 0) {
                          return (
                            <div className="px-4 py-4 text-center">
                              <div className="text-gray-700 font-medium mb-1">No results found</div>
                              <div className="text-gray-400 text-sm">It looks like your search is a bit too specific. Try adjusting or resetting your search to see more results.</div>
                            </div>
                          );
                        }
                        
                        return filteredPeople.map((person) => {
                          const isSelected = selectedFilters.some(f => 
                            f.category === 'people' && 
                            f.value === person.employeeId
                          );
                          
                          return (
                            <div key={person.id} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                              <Checkbox.Root
                                id={`person-${person.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => handlePersonChange(person.employeeId, checked === true)}
                                className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                              >
                                <Checkbox.Indicator>
                                  <CheckIcon className="w-3 h-3 text-white" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                              <label htmlFor={`person-${person.id}`} className="text-sm text-gray-700 cursor-pointer flex-1 truncate min-w-0 break-words">
                                <div className="flex flex-col">
                                  <span className="block truncate font-medium">{person.label}</span>
                                  <span className="block truncate text-xs text-gray-500">{person.position} • {person.department}</span>
                                </div>
                              </label>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            // Search Results
            <div>
              {displayOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => createFilterFromOption(option)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {option.description && (
                      <span className="text-sm text-gray-500">{option.description}</span>
                    )}
                    <span className="text-xs text-gray-400 capitalize">{option.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
