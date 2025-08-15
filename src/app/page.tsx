'use client';

import React, { useState } from 'react';
import { MultiselectTypeahead } from '@/components/MultiselectTypeahead';
import { employees, departments, teams, groups } from '@/data';
import type { FilterItem } from '@/components/MultiselectTypeahead';
import type { Employee } from '@/data';

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [approvalMode, setApprovalMode] = useState<'all' | 'any'>('all');

  // Handle filter changes
  const handleFiltersChange = (filters: FilterItem[]) => {
    setSelectedFilters(filters);
  };



  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-[62rem] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Approval Chain Selector */}
        
        
                <div className="bg-[#05084A]/[0.02] rounded-xl p-3 mb-8">
          <div className="mb-0">
            <p className="text-md font-semibold text-gray-900">
              Approval Chain
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Select the order and who needs to approve this request. Only one person in each step needs to approve.
          </p>
          
          <MultiselectTypeahead
            employees={employees}
            departments={departments}
            teams={teams}
            groups={groups}
            selectedFilters={selectedFilters}
            onFiltersChange={handleFiltersChange}
            placeholder="Search employees, departments, teams, or attributes..."
            maxSelections={20}
          />


        </div>

        {/* Employee List - Temporarily Hidden */}
        {/* 
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Employee Results ({filteredEmployees.length})
        </h2>
        
        <div className="bg-[#05084A]/[0.02] rounded-xl p-3">
          Employee results table temporarily hidden
        </div>
        */}
      </div>
    </div>
  );
}
