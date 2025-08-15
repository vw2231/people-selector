'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MultiselectTypeahead } from './MultiselectTypeahead';
import { employees, departments, teams, groups } from '@/data';
import type { FilterItem } from './MultiselectTypeahead';

interface ApprovalStepProps {
  stepNumber: number;
  title: string;
  selectedFilters: FilterItem[];
  exclusionFilters: FilterItem[];
  approvalMode: 'all' | 'any';
  onFiltersChange: (filters: FilterItem[]) => void;
  onExclusionFiltersChange: (filters: FilterItem[]) => void;
  onApprovalModeChange: (mode: 'all' | 'any') => void;
  isFirst?: boolean;
  isLast?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  canDrag?: boolean;
}

export const ApprovalStep: React.FC<ApprovalStepProps> = ({
  stepNumber,
  title,
  selectedFilters,
  exclusionFilters,
  approvalMode,
  onFiltersChange,
  onExclusionFiltersChange,
  onApprovalModeChange,
  isFirst = false,
  isLast = false,
  canDelete = false,
  onDelete,
  canDrag = true,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stepNumber, disabled: !canDrag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-gray-200 p-4 ${
        isFirst && isLast ? 'rounded-[10px]' : 
        isFirst ? 'rounded-t-[10px]' : 
        isLast ? 'rounded-b-[10px]' : 
        'rounded-none'
      }`}
    >
      {/* Drag Handle */}
      {canDrag && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 cursor-grab active:cursor-grabbing py-0.5 px-1 hover:bg-gray-100 rounded z-10"
        >
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="4" cy="6" r="1.5" />
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="20" cy="6" r="1.5" />
            <circle cx="4" cy="14" r="1.5" />
            <circle cx="12" cy="14" r="1.5" />
            <circle cx="20" cy="14" r="1.5" />
          </svg>
        </div>
      )}
      
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-md font-semibold text-gray-900">
              {title}
            </p>
          </div>
          
          {/* Approval Mode Selector and Delete Button */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <select
                value={approvalMode}
                onChange={(e) => onApprovalModeChange(e.target.value as 'all' | 'any')}
                className="px-3 py-1.5 text-sm text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 appearance-none pr-8 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <option value="any">Any can approve</option>
                <option value="all">All must approve</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                title="Delete approval step"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <MultiselectTypeahead
        employees={employees}
        departments={departments}
        teams={teams}
        groups={groups}
        selectedFilters={selectedFilters}
        onFiltersChange={onFiltersChange}
        placeholder="Select an approver by their relationship, attributes, & groups"
        maxSelections={20}
      />
      
      {/* Exception Selector */}
      <div className="mt-3">
        <div className="mb-2">
          <p className="text-sm font-semibold text-gray-700">
            Exclusions:
          </p>
        </div>
        
        <MultiselectTypeahead
          employees={employees}
          departments={departments}
          teams={teams}
          groups={groups}
          selectedFilters={exclusionFilters}
          onFiltersChange={onExclusionFiltersChange}
          placeholder="Exclude the following people..."
          maxSelections={20}
        />
      </div>
    </div>
  );
};
