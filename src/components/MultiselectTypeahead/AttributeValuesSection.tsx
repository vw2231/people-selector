'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Employee } from '../../data';
import { useState } from 'react';

interface AttributeValuesSectionProps {
  selectedAttribute: string | null;
  filterOptions: {
    attributes: Array<{
      id: string;
      attributeKey: string;
      dataType: 'enum' | 'string' | 'number' | 'date';
      possibleValues?: string[];
    }>;
  };
  valueSearchQuery: string;
  selectedFilters: Array<{
    category: string;
    value: string | number | Date | string[];
    operator: string;
  }>;
  employees: Employee[];
  onValueSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAttributeValueChange: (attributeKey: string, value: string | number, checked: boolean) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const AttributeValuesSection: React.FC<AttributeValuesSectionProps> = ({
  selectedAttribute,
  filterOptions,
  valueSearchQuery,
  selectedFilters,
  employees,
  onValueSearchChange,
  onAttributeValueChange,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isEditingNewValue, setIsEditingNewValue] = useState(false);
  const [newValueName, setNewValueName] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('contains');

  if (!selectedAttribute) {
    return (
      <div className="p-4 text-left text-gray-500 text-sm">
        Select an attribute to see its values
      </div>
    );
  }

  const attr = filterOptions.attributes.find((a) => a.id === selectedAttribute);
  if (!attr) return null;

  // Handle new value inline editing
  const startEditingNewValue = () => {
    setIsEditingNewValue(true);
    setNewValueName('');
    setSelectedOperator('contains');
  };

  const saveNewValue = () => {
    if (newValueName.trim()) {
      // TODO: Implement actual value creation logic
      console.log('Creating new value:', newValueName.trim(), 'with operator:', selectedOperator);
      
      // For now, just add it as a filter to demonstrate the functionality
      // TODO: Implement proper custom filter creation with operator selection
      onAttributeValueChange(attr.attributeKey, newValueName.trim(), true);
    }
    setIsEditingNewValue(false);
    setNewValueName('');
    setSelectedOperator('contains');
  };

  const cancelNewValue = () => {
    setIsEditingNewValue(false);
    setNewValueName('');
    setSelectedOperator('contains');
  };

  const renderEnumValues = () => {
    if (attr.dataType !== 'enum' || !attr.possibleValues) return null;
    
    return attr.possibleValues
      .filter((value: string) => 
        value.toLowerCase().includes(valueSearchQuery.toLowerCase())
      )
      .map((value: string) => {
        const isSelected = selectedFilters.some(f => {
          if (f.category !== 'attributes') return false;
          
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
              onCheckedChange={(checked) => onAttributeValueChange(attr.attributeKey, value, checked === true)}
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
  };

  const renderStringValues = () => {
    if (attr.dataType !== 'string') return null;
    
    const uniqueValues = [...new Set(employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean))];
    const sortedValues = uniqueValues.sort((a, b) => String(a).localeCompare(String(b)));
    const filteredValues = sortedValues
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
        if (f.category !== 'attributes') return false;
        
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
            onCheckedChange={(checked) => onAttributeValueChange(attr.attributeKey, String(value), checked === true)}
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
  };

  const renderNumberValues = () => {
    if (attr.dataType !== 'number') return null;
    
    const values = employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean) as number[];
    if (values.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-500">
          No values available
        </div>
      );
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const commonValues = [min, Math.round((min + max) / 2), max];
    const sortedValues = commonValues.sort((a, b) => a - b);
    const filteredValues = sortedValues.filter(value => {
      const displayValue = attr.attributeKey === 'weeklyHours' ? `${value} hours` : 
                         attr.attributeKey === 'probationLength' ? `${value} months` : 
                         String(value);
      return displayValue.toLowerCase().includes(valueSearchQuery.toLowerCase());
    });
    
    if (filteredValues.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-500">
          {valueSearchQuery ? 'No values match your search' : 'No values available'}
        </div>
      );
    }
    
    return filteredValues.map((value) => {
      let displayValue = String(value);
      if (attr.attributeKey === 'weeklyHours') {
        displayValue = `${value} hours`;
      } else if (attr.attributeKey === 'probationLength') {
        displayValue = `${value} months`;
      }
      
      const isSelected = selectedFilters.some(f => {
        if (f.category !== 'attributes') return false;
        
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
            onCheckedChange={(checked) => onAttributeValueChange(attr.attributeKey, value, checked === true)}
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
    });
  };

  const renderDateValues = () => {
    if (attr.dataType !== 'date') return null;
    
    const dateValues = employees.map(emp => emp[attr.attributeKey as keyof Employee]).filter(Boolean) as string[];
    if (dateValues.length === 0) {
      return (
        <div className="px-4 py-0 text-sm text-gray-500">
          No values available
        </div>
      );
    }
    
    const uniqueDates = [...new Set(dateValues)];
    const sortedDates = uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const filteredDates = sortedDates
      .filter(dateStr => {
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        return formattedDate.toLowerCase().includes(valueSearchQuery.toLowerCase());
      })
      .slice(0, 20);
    
    if (filteredDates.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-500">
          {valueSearchQuery ? 'No values match your search' : 'No values available'}
        </div>
      );
    }
    
    return filteredDates.map((dateStr) => {
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
      const isSelected = selectedFilters.some(f => {
        if (f.category !== 'attributes') return false;
        
        if (Array.isArray(f.value)) {
          // Check if the value exists in the array of values
          return f.value.some(v => v === `${attr.attributeKey}:${dateStr}`);
        } else {
          // Check if the single value matches
          return f.value === `${attr.attributeKey}:${dateStr}`;
        }
      });
      
      return (
        <div key={dateStr} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
          <Checkbox.Root
            id={`attribute-${attr.attributeKey}-${dateStr}`}
            checked={isSelected}
            onCheckedChange={(checked) => onAttributeValueChange(attr.attributeKey, dateStr, checked === true)}
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
    });
  };

  return (
    <div 
      className="h-full flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Search Input for Values */}
      <div className="sticky top-0 z-10 p-2" style={{
        background: 'rgba(255, 255, 255, 0.30)',
        boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 #FFF inset, 0 0 0.5px 0 rgba(0, 0, 0, 0.15)'
      }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search values..."
            value={valueSearchQuery}
            onChange={onValueSearchChange}
            className="w-full px-3 py-1 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            autoFocus={false}
            aria-label="Search attribute values"
          />
          {valueSearchQuery && (
            <button
              onClick={() => onValueSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
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
        {renderEnumValues()}
        {renderStringValues()}
        {renderNumberValues()}
        {renderDateValues()}
        {attr.dataType !== 'enum' && attr.dataType !== 'string' && attr.dataType !== 'number' && attr.dataType !== 'date' && (
          <div className="px-4 py-2 text-sm text-gray-500">
            Unsupported data type
          </div>
        )}
      </div>
      
      {/* Footer with New Value Button/Inline Edit */}
      <div className="sticky bottom-0 px-4 py-1 border-t border-gray-200 bg-white">
        {isEditingNewValue ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newValueName}
              onChange={(e) => setNewValueName(e.target.value)}
              placeholder="Enter custom value..."
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveNewValue();
                } else if (e.key === 'Escape') {
                  cancelNewValue();
                }
              }}
            />
            <button
              onClick={saveNewValue}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Save value"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={cancelNewValue}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Cancel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
            onClick={startEditingNewValue}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Custom filter
          </button>
        )}
      </div>
    </div>
  );
};
