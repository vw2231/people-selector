'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@heroicons/react/24/outline';
import * as Tooltip from '@radix-ui/react-tooltip';
import { FilterChip } from './FilterChip';
import { SearchSection } from './SearchSection';
import { AttributeSection } from './AttributeSection';
import { AttributeValuesSection } from './AttributeValuesSection';
import { generateFilterOptions, getAvailableOperators } from './dataProcessing';
import type { 
  FilterItem, 
  FilterOperator,
  Employee,
  Department,
  Team,
  Group,
  RelationshipOption,
  GroupOption,
  PersonOption,
  AttributeOption
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
  // Generate consistent colors for avatars based on name
  const getAvatarColors = useCallback((name: string) => {
    // Predefined color combinations (light/dark pairs)
    const colorPairs = [
      { bg: 'bg-blue-100', text: 'text-blue-700' },
      { bg: 'bg-green-100', text: 'text-green-700' },
      { bg: 'bg-purple-100', text: 'text-purple-700' },
      { bg: 'bg-pink-100', text: 'text-pink-700' },
      { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      { bg: 'bg-red-100', text: 'text-red-700' },
      { bg: 'bg-teal-100', text: 'text-teal-700' },
      { bg: 'bg-orange-100', text: 'text-orange-700' },
      { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      { bg: 'bg-violet-100', text: 'text-violet-700' },
      { bg: 'bg-rose-100', text: 'text-rose-700' },
      { bg: 'bg-sky-100', text: 'text-sky-700' },
      { bg: 'bg-lime-100', text: 'text-lime-700' },
      { bg: 'bg-amber-100', text: 'text-amber-700' }
    ];
    
    // Use the name to consistently generate the same color for the same person
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorPairs.length;
    return colorPairs[index];
  }, []);
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
          subject: person.label,
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
    const attr = filterOptions.attributes.find(a => a.attributeKey === attributeKey);
    if (!attr) return;

    if (checked) {
      // Check if there's already a filter for this attribute
      const existingFilter = selectedFilters.find(f => 
        f.category === 'attributes' && 
        f.subject === attr.label
      );

      if (existingFilter) {
        // Update existing filter to include the new value
        let currentValues: string[];
        if (Array.isArray(existingFilter.value)) {
          // If it's already an array, the values should already have the prefix
          // Extract the actual values (remove the prefix)
          currentValues = existingFilter.value.map(v => {
            if (v.startsWith(`${attributeKey}:`)) {
              return v.substring(attributeKey.length + 1);
            }
            // If the value doesn't have the prefix, it might be a legacy value
            return v;
          });
        } else {
          // Extract the actual value from the filter (remove the attributeKey: prefix)
          const filterValue = String(existingFilter.value);
          if (filterValue.startsWith(`${attributeKey}:`)) {
            currentValues = [filterValue.substring(attributeKey.length + 1)];
          } else {
            currentValues = [filterValue];
          }
        }
        
        // Check if the value is already in the current values to avoid duplicates
        if (currentValues.includes(String(value))) {
          return; // Value already exists, no need to update
        }
        
        const newValues = [...currentValues, String(value)];
        const isMultiple = newValues.length > 1;
        
        // Update the existing filter
        const updatedFilter: FilterItem = {
          ...existingFilter,
          // Change operator based on number of values: 'is' for single, 'is one of' for multiple
          operator: isMultiple ? 'is one of' : 'is',
          value: isMultiple ? newValues.map(v => `${attributeKey}:${v}`) : `${attributeKey}:${value}`,
          displayValue: isMultiple 
            ? `${newValues.length} ${attr.label.toLowerCase()}${newValues.length > 1 && !attr.label.toLowerCase().endsWith('s') ? 's' : ''}`
            : (() => {
                if (attributeKey === 'probationLength') {
                  return `${value} months`;
                } else if (attributeKey === 'weeklyHours') {
                  return `${value} hours`;
                } else if (attr.dataType === 'date') {
                  const date = new Date(String(value));
                  return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });
                }
                return String(value);
              })(),
          availableOperators: isMultiple 
            ? ['is one of', 'is all of', 'is not']
            : getAvailableOperators(attr.dataType)
        };
        
        const updatedFilters = selectedFilters.map(f => 
          f.id === existingFilter.id ? updatedFilter : f
        );
        onFiltersChange(updatedFilters);
      } else {
        // Create new filter
        const availableOperators = getAvailableOperators(attr.dataType);
        const newFilter: FilterItem = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'attributes',
          subject: attr.label,
          operator: 'is',
          value: `${attributeKey}:${value}`,
          displayValue: (() => {
            if (attributeKey === 'probationLength') {
              return `${value} months`;
            } else if (attributeKey === 'weeklyHours') {
              return `${value} hours`;
            } else if (attr.dataType === 'date') {
              const date = new Date(String(value));
              return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
            }
            return String(value);
          })(),
          availableOperators,
          metadata: { originalOption: { ...attr, selectedValue: value } }
        };
        const updatedFilters = [...selectedFilters, newFilter];
        onFiltersChange(updatedFilters);
      }
    } else {
      // Remove value from attribute filter
      const existingFilter = selectedFilters.find(f => 
        f.category === 'attributes' && 
        f.subject === attr.label
      );

      if (existingFilter) {
        if (Array.isArray(existingFilter.value)) {
          // Remove value from multiple values
          const newValues = existingFilter.value.filter(v => v !== `${attributeKey}:${value}`);
          
          if (newValues.length === 0) {
            // Remove the entire filter if no values left
            const updatedFilters = selectedFilters.filter(f => f.id !== existingFilter.id);
            onFiltersChange(updatedFilters);
          } else if (newValues.length === 1) {
            // Convert back to single value filter
            // Ensure newValues[0] doesn't already have the prefix
            const singleValue = newValues[0].startsWith(`${attributeKey}:`) 
              ? newValues[0].substring(attributeKey.length + 1) 
              : newValues[0];
              
            const updatedFilter: FilterItem = {
              ...existingFilter,
              // Change back to 'is' when we have only one value
              operator: 'is',
              value: `${attributeKey}:${singleValue}`,
              displayValue: (() => {
                if (attributeKey === 'probationLength') {
                  return `${singleValue} months`;
                } else if (attributeKey === 'weeklyHours') {
                  return `${singleValue} hours`;
                } else if (attr.dataType === 'date') {
                  const date = new Date(String(singleValue));
                  return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });
                }
                return String(singleValue);
              })(),
              availableOperators: getAvailableOperators(attr.dataType)
            };
            
            const updatedFilters = selectedFilters.map(f => 
              f.id === existingFilter.id ? updatedFilter : f
            );
            onFiltersChange(updatedFilters);
          } else {
            // Update multiple values filter
            // Ensure all values have the correct prefix format
            const formattedValues = newValues.map(v => 
              v.startsWith(`${attributeKey}:`) ? v : `${attributeKey}:${v}`
            );
            
            const updatedFilter: FilterItem = {
              ...existingFilter,
              value: formattedValues,
              displayValue: `${newValues.length} ${attr.label.toLowerCase()}${newValues.length > 1 && !attr.label.toLowerCase().endsWith('s') ? 's' : ''}`
            };
            
            const updatedFilters = selectedFilters.map(f => 
              f.id === existingFilter.id ? updatedFilter : f
            );
            onFiltersChange(updatedFilters);
          }
        } else {
          // Check if this single value filter matches the value being unchecked
          const filterValue = String(existingFilter.value);
          const expectedValue = `${attributeKey}:${value}`;
          
          if (filterValue === expectedValue) {
            // Remove single value filter when the unchecked value matches
            const updatedFilters = selectedFilters.filter(f => f.id !== existingFilter.id);
            onFiltersChange(updatedFilters);
          }
        }
      }
    }
  }, [filterOptions.attributes, selectedFilters, onFiltersChange]);

  // Helper functions for SearchSection components
  const renderRelationshipItem = useCallback((rel: RelationshipOption, isSelected: boolean) => (
    <>
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
    </>
  ), [handleRelationshipChange]);

  const renderGroupItem = useCallback((group: GroupOption, isSelected: boolean) => (
    <>
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
      
      {/* Member Count with Tooltip */}
      <div className="ml-2 flex-shrink-0">
        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-500">{group.memberCount}</span>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg z-50 max-w-xs"
                sideOffset={5}
              >
                <div className="text-xs">
                  <div className="text-left mb-2 font-medium">
                    {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                  </div>
                  <div className="text-left space-y-1 max-h-32 overflow-y-auto">
                    {(() => {
                      const groupEmployees = employees.filter(emp => 
                        groups.find(g => g.id === group.groupId)?.members.includes(emp.id)
                      );
                      return groupEmployees.map(emp => (
                        <div key={emp.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0"></div>
                          <span className="truncate">{emp.firstName} {emp.lastName}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </>
  ), [handleGroupChange, employees, groups]);

  const renderPersonItem = useCallback((person: PersonOption, isSelected: boolean) => (
    <>
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
      
      {/* Avatar */}
      {(() => {
        const colors = getAvatarColors(person.label);
        return (
          <div className={`mr-3 w-10 h-10 rounded-full ${colors.bg} flex-shrink-0 flex items-center justify-center`}>
            <span className={`text-sm font-medium ${colors.text}`}>
              {person.label.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </span>
          </div>
        );
      })()}
      
      <label htmlFor={`person-${person.id}`} className="flex-1 cursor-pointer min-w-0">
        <div className="flex flex-col">
          <span className="block truncate text-[14px] font-medium text-gray-900 leading-tight">{person.label}</span>
          <span className="block truncate text-[14px] text-gray-500 leading-tight">{person.position}</span>
        </div>
      </label>
    </>
  ), [handlePersonChange]);

  // Filter functions for SearchSection components
  const filterRelationships = useCallback((rel: RelationshipOption, query: string) => 
    rel.label.toLowerCase().includes(query.toLowerCase()) ||
    (rel.description && rel.description.toLowerCase().includes(query.toLowerCase())) ||
    rel.targetPersonName.toLowerCase().includes(query.toLowerCase()),
    []
  );

  const filterGroups = useCallback((group: GroupOption, query: string) => 
    group.label.toLowerCase().includes(query.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(query.toLowerCase())),
    []
  );

  const filterPeople = useCallback((person: PersonOption, query: string) => 
    person.label.toLowerCase().includes(query.toLowerCase()) ||
    (person.position && person.position.toLowerCase().includes(query.toLowerCase())) ||
    (person.department && person.department.toLowerCase().includes(query.toLowerCase())),
    []
  );

  // Helper functions for getting IDs and checking selection
  const getRelationshipId = useCallback((rel: RelationshipOption) => rel.id, []);
  const getGroupId = useCallback((group: GroupOption) => group.id, []);
  const getPersonId = useCallback((person: PersonOption) => person.id, []);

  const isRelationshipSelected = useCallback((rel: RelationshipOption) => 
    selectedFilters.some(f => 
      f.category === 'relationships' && 
      f.metadata?.originalOption && 
      (f.metadata.originalOption as { id: string }).id === rel.id
    ),
    [selectedFilters]
  );

  const isGroupSelected = useCallback((group: GroupOption) => 
    selectedFilters.some(f => 
      f.category === 'groups' && 
      f.value === group.groupId
    ),
    [selectedFilters]
  );

  const isPersonSelected = useCallback((person: PersonOption) => 
    selectedFilters.some(f => 
      f.category === 'people' && 
      f.value === person.employeeId
    ),
    [selectedFilters]
  );

  // Render function for attribute values
  const renderAttributeValues = useCallback((attr: AttributeOption) => {
    if (attr.dataType === 'enum' && attr.possibleValues) {
      // Enum attributes - show predefined values
      return attr.possibleValues
        .filter((value: string) => 
          value.toLowerCase().includes(valueSearchQuery.toLowerCase())
        )
        .map((value: string) => {
          const isSelected = selectedFilters.some(f => {
            if (f.category !== 'attributes' || f.subject !== attr.label) return false;
            
            if (Array.isArray(f.value)) {
              // Check if the value exists in the array of values
              return f.value.some(v => v === `${attr.attributeKey}:${value}`);
            } else {
              // Check if the single value matches
              return f.value === `${attr.attributeKey}:${value}`;
            }
          });
          
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
        });
    } else if (attr.dataType === 'string') {
      // String attributes - show unique values from employee data
      const uniqueValues = [...new Set(employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean))];
      const filteredValues = uniqueValues
        .filter(value => 
          String(value).toLowerCase().includes(valueSearchQuery.toLowerCase())
        )
        .slice(0, 20);
      
      if (filteredValues.length === 0) {
        return (
          <div className="px-4 py-2 text-sm text-gray-500">
            {valueSearchQuery ? 'No values match your search' : 'No values available'}
          </div>
        );
      }
      
      return filteredValues.map((value) => {
        const isSelected = selectedFilters.some(f => {
          if (f.category !== 'attributes' || f.subject !== attr.label) return false;
          
          if (Array.isArray(f.value)) {
            // Check if the value exists in the array of values
            return f.value.some(v => v === `${attr.attributeKey}:${value}`);
          } else {
            // Check if the single value matches
            return f.value === `${attr.attributeKey}:${value}`;
          }
        });
        
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
      });
    } else {
      return (
        <div className="px-4 py-2 text-sm text-gray-500">
          Unsupported data type
        </div>
      );
    }
  }, [valueSearchQuery, selectedFilters, handleAttributeValueChange, employees]);

  // Update filter operator
  const updateFilterOperator = useCallback((filterId: string, newOperator: string) => {
    console.log('updateFilterOperator called with:', filterId, newOperator);
    console.log('selectedFilters before update:', selectedFilters);
    
    const updatedFilters = selectedFilters.map(filter => {
      if (filter.id === filterId) {
        console.log('Updating filter:', filter);
        const updatedFilter = { ...filter, operator: newOperator as FilterItem['operator'] };
        console.log('Updated filter:', updatedFilter);
        return updatedFilter;
      }
      return filter;
    });
    
    console.log('Updated filters:', updatedFilters);
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
        description: person.department,
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
          availableOperators: getAvailableOperators((option.originalOption as { dataType: 'string' | 'number' | 'date' | 'enum' }).dataType),
          metadata: { originalOption: option.originalOption }
        };
        break;
        
      case 'person':
        newFilter = {
          id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          category: 'people',
          subject: option.label,
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
        <div className="flex items-center gap-1 px-2 py-1 border border-[#DADADA] rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#1F1F1F] focus-within:border-transparent min-h-[40px]">
          {/* Left side: Chips and Input */}
          <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
            {/* Selected Filters Display */}
            {selectedFilters.map((filter) => (
              <FilterChip
                key={filter.id}
                filter={filter}
                onOperatorChange={updateFilterOperator}
                onRemove={() => removeFilter(filter.id)}
              />
            ))}
            
            <div className="flex-1 min-w-0 relative">
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
                className="w-full min-w-0 border-none outline-none bg-transparent text-sm disabled:bg-transparent disabled:cursor-not-allowed pr-6"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Right side: Clear All Filters Icon - Always positioned on the right */}
          {selectedFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors self-center"
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
                  <SearchSection
                    title="relationships"
                    searchQuery={relationshipSearchQuery}
                    onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelationshipSearchQuery(e.target.value)}
                    items={filterOptions.relationships}
                    filterFunction={filterRelationships}
                    renderItem={renderRelationshipItem}
                    getItemId={getRelationshipId}
                    isItemSelected={isRelationshipSelected}
                    onMouseEnter={() => {
                      const input = document.querySelector('input[placeholder="Search relationships..."]') as HTMLInputElement;
                      if (input) input.focus();
                    }}
                    onMouseLeave={() => setActiveSubmenu(null)}
                    footer={undefined}
                  />
                ) : activeSubmenu === 'groups' ? (
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
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search groups..."
                          value={groupSearchQuery}
                          onChange={(e) => setGroupSearchQuery(e.target.value)}
                          className="w-full px-3 py-1 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus={false}
                        />
                        {groupSearchQuery && (
                          <button
                            onClick={() => setGroupSearchQuery('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            title="Clear search"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Groups List */}
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
                              <div className="text-gray-400 text-sm">Try adjusting your search terms</div>
                            </div>
                          );
                        }
                        
                        return filteredGroups.map((group) => {
                          const isSelected = isGroupSelected(group);
                          
                          return (
                            <div key={getGroupId(group)} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                              {renderGroupItem(group, isSelected)}
                            </div>
                          );
                        });
                      })()}
                    </div>
                    
                    {/* Footer with New Group Button */}
                    <div className="sticky bottom-0 px-4 py-1 border-t border-gray-200 bg-white">
                      <button
                        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                        onClick={() => {
                          // TODO: Implement new group functionality
                          console.log('New group clicked');
                        }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New group
                      </button>
                    </div>
                  </div>
                                ) : activeSubmenu === 'attributes' ? (
                  <div 
                    className="flex h-full"
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <div className="w-1/2 border-r border-gray-200 flex-shrink-0">
                      <AttributeSection
                        attributes={filterOptions.attributes}
                        selectedAttribute={selectedAttribute}
                        attributeSearchQuery={attributeSearchQuery}
                        onAttributeSearchChange={(e) => setAttributeSearchQuery(e.target.value)}
                        onAttributeSelect={setSelectedAttribute}
                        onMouseEnter={() => {
                          // Small delay to prevent accidental focus when quickly moving between columns
                          setTimeout(() => {
                            const input = document.querySelector('input[placeholder="Search attributes..."]') as HTMLInputElement;
                            if (input) input.focus();
                          }, 100);
                        }}
                        onMouseLeave={() => {
                          // Don't clear activeSubmenu when moving between attribute columns
                        }}
                      />
                    </div>

                    <div className="w-1/2 flex-shrink-0">
                      <AttributeValuesSection
                        selectedAttribute={selectedAttribute}
                        filterOptions={filterOptions}
                        valueSearchQuery={valueSearchQuery}
                        selectedFilters={selectedFilters}
                        employees={employees}
                        onValueSearchChange={(e) => setValueSearchQuery(e.target.value)}
                        onAttributeValueChange={handleAttributeValueChange}
                        onMouseEnter={() => {
                          // Small delay to prevent accidental focus when quickly moving between columns
                          setTimeout(() => {
                            const input = document.querySelector('input[placeholder="Search values..."]') as HTMLInputElement;
                            if (input) input.focus();
                          }, 100);
                        }}
                        onMouseLeave={() => {
                          // Don't clear activeSubmenu when moving between attribute columns
                        }}
                      />
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
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search people..."
                          value={peopleSearchQuery}
                          onChange={(e) => setPeopleSearchQuery(e.target.value)}
                          className="w-full px-3 py-1 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus={false}
                        />
                        {peopleSearchQuery && (
                          <button
                            onClick={() => setPeopleSearchQuery('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            title="Clear search"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
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
                            <div key={person.id} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-14 w-full">
                              <Checkbox.Root
                                id={`person-${person.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => handlePersonChange(person.employeeId, checked === true)}
                                className={`mr-2 w-4 h-4 bg-white border border-[#DADADA] rounded-[4px] flex-shrink-0 flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state:checked]:border-blue-500 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                              >
                                <Checkbox.Indicator>
                                  <CheckIcon className="w-3 h-3 text-white" />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                              
                              {/* Avatar */}
                              {(() => {
                                const colors = getAvatarColors(person.label);
                                return (
                                  <div className={`mr-3 w-10 h-10 rounded-full ${colors.bg} flex-shrink-0 flex items-center justify-center`}>
                                    <span className={`text-sm font-medium ${colors.text}`}>
                                      {person.label.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </span>
                                  </div>
                                );
                              })()}
                              
                              <label htmlFor={`person-${person.id}`} className="flex-1 cursor-pointer min-w-0">
                                <div className="flex flex-col">
                                  <span className="block truncate text-[14px] font-medium text-gray-900 leading-tight">{person.label}</span>
                                  <span className="block truncate text-[14px] text-gray-500 leading-tight">{person.position}</span>
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
