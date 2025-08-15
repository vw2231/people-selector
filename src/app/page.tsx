'use client';

import React, { useState } from 'react';
import { ApprovalProcess } from '@/components/ApprovalProcess';
import { employees, departments, teams, groups } from '@/data';
import type { FilterItem } from '@/components/MultiselectTypeahead';
import type { Employee } from '@/data';

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);
  const [exclusionFilters, setExclusionFilters] = useState<FilterItem[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [approvalMode, setApprovalMode] = useState<'all' | 'any'>('all');

  // Handle filter changes
  const handleFiltersChange = (filters: FilterItem[]) => {
    setSelectedFilters(filters);
  };

  // Handle exclusion filter changes
  const handleExclusionFiltersChange = (filters: FilterItem[]) => {
    setExclusionFilters(filters);
  };



  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <ApprovalProcess
        selectedFilters={selectedFilters}
        exclusionFilters={exclusionFilters}
        approvalMode={approvalMode}
        onFiltersChange={handleFiltersChange}
        onExclusionFiltersChange={handleExclusionFiltersChange}
        onApprovalModeChange={setApprovalMode}
      />
    </div>
  );
}
