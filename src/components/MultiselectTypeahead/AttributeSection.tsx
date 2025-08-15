import React from 'react';
import { SearchInput } from './SearchInput';
import { EmptyState } from './EmptyState';

interface AttributeSectionProps {
  attributes: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  selectedAttribute: string | null;
  attributeSearchQuery: string;
  onAttributeSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAttributeSelect: (attributeId: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const AttributeSection: React.FC<AttributeSectionProps> = ({
  attributes,
  selectedAttribute,
  attributeSearchQuery,
  onAttributeSearchChange,
  onAttributeSelect,
  onMouseEnter,
  onMouseLeave
}) => {
  const filteredAttributes = attributes.filter(attr => 
    attr.label.toLowerCase().includes(attributeSearchQuery.toLowerCase()) ||
    (attr.description && attr.description.toLowerCase().includes(attributeSearchQuery.toLowerCase()))
  );

  return (
    <div 
      className="h-full flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex-shrink-0">
        <SearchInput
          placeholder="Search attributes..."
          value={attributeSearchQuery}
          onChange={onAttributeSearchChange}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-1 space-y-0">
        {attributeSearchQuery && filteredAttributes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {filteredAttributes.map((attr) => (
              <button
                key={attr.id}
                onMouseEnter={() => onAttributeSelect(attr.id)}
                className={`w-full text-left px-4 pr-1 h-8 text-sm text-gray-700 hover:bg-gray-50 rounded-[10px] transition-colors min-w-0 flex items-center justify-between ${
                  selectedAttribute === attr.id ? 'bg-gray-100' : ''
                }`}
              >
                <span className="truncate flex-1">{attr.label}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
