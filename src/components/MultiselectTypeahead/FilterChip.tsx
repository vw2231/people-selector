'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { FilterChipProps, FilterOperator } from './types';

export function FilterChip({ filter, onOperatorChange, onRemove }: FilterChipProps) {
  console.log('FilterChip rendering with filter:', filter);
  const [isOperatorOpen, setIsOperatorOpen] = useState(false);
  const operatorRef = useRef<HTMLDivElement>(null);

  // Close operator dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (operatorRef.current && !operatorRef.current.contains(event.target as Node)) {
        setIsOperatorOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOperatorChange = (newOperator: FilterOperator) => {
    console.log('Operator changing from', filter.operator, 'to', newOperator);
    console.log('Filter before change:', filter);
    console.log('Calling onOperatorChange with:', filter.id, newOperator);
    onOperatorChange(filter.id, newOperator);
    setIsOperatorOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: 'toggle' | 'change' | 'remove') => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (action === 'toggle') setIsOperatorOpen(!isOperatorOpen);
        if (action === 'remove') onRemove(filter.id);
        break;
      case 'Escape':
        setIsOperatorOpen(false);
        break;
    }
  };

  // Simplified chip styling for relationships, groups, and people
  if (filter.category === 'relationships' || filter.category === 'groups' || filter.category === 'people') {
    return (
      <div className="inline-flex items-center bg-[#F0F0F0] rounded-[4px] m-0.5">
        <span className="px-2 py-0.5 text-sm text-gray-700">
          {filter.subject}
        </span>
        <button
          type="button"
          className="pl-0.5 pr-2 py-0.5 text-[#646464] hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-r-[4px]"
          onClick={() => onRemove(filter.id)}
          onKeyDown={(e) => handleKeyDown(e, 'remove')}
          aria-label={`Remove filter: ${filter.subject}`}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Attribute filter chip with three-section design
  if (filter.category === 'attributes') {
    return (
      <div className="inline-flex items-center bg-[#F0F0F0] rounded-[4px] m-0.5">
        {/* Attribute Name */}
        <div className="px-2 py-0.5 text-sm text-gray-700 border-r border-gray-300">
          {filter.subject}
        </div>
        
        {/* Operator */}
        <div className="relative border-r border-gray-300" ref={operatorRef}>
          <button
            type="button"
            className="px-2 py-0.5 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-[2px]"
            onClick={() => setIsOperatorOpen(!isOperatorOpen)}
            onKeyDown={(e) => handleKeyDown(e, 'toggle')}
            aria-label={`${filter.subject} ${filter.operator} ${filter.displayValue}, press to change operator`}
            aria-expanded={isOperatorOpen}
            aria-haspopup="listbox"
          >
            {filter.operator}
            <ChevronDownIcon className="inline-block w-3 h-3 ml-1" />
          </button>
          
          {/* Operator Dropdown */}
          {isOperatorOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg min-w-32">
              <ul role="listbox" className="py-1">
                {filter.availableOperators.map((operator) => (
                  <li key={operator}>
                    <button
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                        operator === filter.operator ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                      onClick={() => handleOperatorChange(operator)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOperatorChange(operator);
                        }
                      }}
                      role="option"
                      aria-selected={operator === filter.operator}
                    >
                      {operator}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Value */}
                <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="px-2 py-0.5 text-sm text-gray-700">
                {filter.displayValue}
              </div>
            </Tooltip.Trigger>
            {Array.isArray(filter.value) && filter.value.length > 1 && (
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg z-50 max-w-xs"
                  sideOffset={5}
                >
                  <div className="text-center text-gray-200">
                    {filter.value.map((val, index) => {
                      // Extract the actual value without the attribute prefix
                      const actualValue = val.includes(':') ? val.split(':').slice(1).join(':') : val;
                      
                      return (
                        <span key={index}>
                          {(() => {
                            // Format the value based on attribute type
                            if (filter.subject.toLowerCase().includes('probation')) {
                              return `${actualValue} months`;
                            } else if (filter.subject.toLowerCase().includes('weekly')) {
                              return `${actualValue} hours`;
                            } else if ((filter.metadata?.originalOption as { dataType?: string })?.dataType === 'date') {
                              const date = new Date(actualValue);
                              return date.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              });
                            }
                            return actualValue;
                          })()}
                          {index < (filter.value as string[]).length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </div>
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
        
        {/* Remove Button */}
        <button
          type="button"
          className="pl-0.5 pr-2 py-0.5 text-[#646464] hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-r-[4px]"
          onClick={() => onRemove(filter.id)}
          onKeyDown={(e) => handleKeyDown(e, 'remove')}
          aria-label={`Remove filter: ${filter.subject} ${filter.operator} ${filter.displayValue}`}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Regular filter chip for other non-relationship filters
  return (
    <div className="filter-chip inline-flex items-center bg-blue-100 rounded-md m-0.5 shadow-sm">
      {/* Subject */}
      <div className="filter-subject px-2 py-1 font-medium bg-blue-200 rounded-l-md text-blue-900 text-sm">
        {filter.subject}
      </div>
      
      {/* Operator */}
      <div className="filter-operator relative" ref={operatorRef}>
        <button
          type="button"
          className="px-2 py-1 bg-blue-300 border-l border-r border-blue-500 cursor-pointer text-blue-900 text-sm font-medium hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={() => setIsOperatorOpen(!isOperatorOpen)}
          onKeyDown={(e) => handleKeyDown(e, 'toggle')}
          aria-label={`${filter.subject} ${filter.operator} ${filter.displayValue}, press to change operator`}
          aria-expanded={isOperatorOpen}
          aria-haspopup="listbox"
        >
          {filter.operator}
          <ChevronDownIcon className="inline-block w-3 h-3 ml-1" />
        </button>
        
        {/* Operator Dropdown */}
        {isOperatorOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg min-w-32">
            <ul role="listbox" className="py-1">
              {filter.availableOperators.map((operator) => (
                <li key={operator}>
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                      operator === filter.operator ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}
                    onClick={() => handleOperatorChange(operator)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOperatorChange(operator);
                      }
                    }}
                    role="option"
                    aria-selected={operator === filter.operator}
                  >
                    {operator}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Value */}
      <div className="filter-value px-2 py-1 bg-blue-100 text-blue-900 text-sm">
        {filter.displayValue}
      </div>
      
      {/* Remove Button */}
      <button
        type="button"
        className="filter-remove px-2 py-1 bg-red-500 text-white rounded-r-md cursor-pointer hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        onClick={() => onRemove(filter.id)}
        onKeyDown={(e) => handleKeyDown(e, 'remove')}
        aria-label={`Remove filter: ${filter.subject} ${filter.operator} ${filter.displayValue}`}
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </div>
  );
}
