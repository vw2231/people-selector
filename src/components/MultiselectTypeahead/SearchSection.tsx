import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@heroicons/react/24/outline';
import { SearchInput } from './SearchInput';
import { EmptyState } from './EmptyState';
import type { RelationshipOption, GroupOption, PersonOption, AttributeOption } from './types';

interface SearchSectionProps {
  title: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  items: any[];
  filterFunction: (item: any, query: string) => boolean;
  renderItem: (item: any, isSelected: boolean) => React.ReactNode;
  getItemId: (item: any) => string;
  isItemSelected: (item: any) => boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  footer?: React.ReactNode;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  title,
  searchQuery,
  onSearchChange,
  items,
  filterFunction,
  renderItem,
  getItemId,
  isItemSelected,
  onMouseEnter,
  onMouseLeave,
  footer
}) => {
  const filteredItems = items.filter(item => filterFunction(item, searchQuery));
  
  return (
    <div 
      className="h-full flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SearchInput
        placeholder={`Search ${title.toLowerCase()}...`}
        value={searchQuery}
        onChange={onSearchChange}
      />
      
      <div className="flex-1 overflow-y-auto p-1 space-y-0">
        {searchQuery && filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          filteredItems.map((item) => {
            const isSelected = isItemSelected(item);
            
            return (
              <div key={getItemId(item)} className="group flex items-center hover:bg-gray-50 rounded-[10px] px-4 pr-1 h-8 w-full">
                {renderItem(item, isSelected)}
              </div>
            );
          })
        )}
      </div>
      
      {/* Optional Footer */}
      {footer && (
        <div className="border-t border-gray-200 p-2">
          {footer}
        </div>
      )}
    </div>
  );
};
