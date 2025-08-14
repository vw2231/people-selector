'use client';

import React, { useState, useMemo } from 'react';
import { MultiselectTypeahead } from '@/components/MultiselectTypeahead';
import { employees, departments, teams, groups } from '@/data';
import type { FilterItem } from '@/components/MultiselectTypeahead';
import type { Employee } from '@/data';

export default function DemoPage() {
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

  // Handle filter changes
  const handleFiltersChange = (filters: FilterItem[]) => {
    setSelectedFilters(filters);
  };

  // Handle employee selection
  const handleEmployeeSelect = (employees: Employee[]) => {
    setFilteredEmployees(employees);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters([]);
    setFilteredEmployees(employees);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* Approval Chain Selector */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Approval Chain (040404 %89)
        </h2>
        
        <div className="bg-[#05084A]/[0.02] rounded-xl p-3 mb-8">
          <p className="text-sm text-gray-600 mb-4">
            Select the order and who needs to approve this request. Only one person in each step needs to approve. (696968)
          </p>
          
          <MultiselectTypeahead
            employees={employees}
            departments={departments}
            teams={teams}
            groups={groups}
            selectedFilters={selectedFilters}
            onFiltersChange={handleFiltersChange}
            onEmployeeSelect={handleEmployeeSelect}
            placeholder="Search employees, departments, teams, or attributes..."
            maxSelections={20}
          />

          {/* Clear Filters Button */}
          {selectedFilters.length > 0 && (
            <div className="mt-4">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Employee List */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Employee Results ({filteredEmployees.length})
        </h2>
        
        <div className="bg-[#05084A]/[0.02] rounded-xl p-3">
          
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No employees match the current filters
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workplace
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.slice(0, 50).map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.team}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.workplace}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.employmentStatus === 'Full time' 
                            ? 'bg-green-100 text-green-800'
                            : employee.employmentStatus === 'Part time'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {employee.employmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredEmployees.length > 50 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing first 50 results of {filteredEmployees.length} employees
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
