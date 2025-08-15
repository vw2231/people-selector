'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Switch from '@radix-ui/react-switch';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ApprovalStep } from './ApprovalStep';
import { MultiselectTypeahead } from './MultiselectTypeahead';
import { employees, departments, teams, groups } from '@/data';
import type { FilterItem } from './MultiselectTypeahead';

interface ApprovalProcessProps {
  selectedFilters: FilterItem[];
  exclusionFilters: FilterItem[];
  approvalMode: 'all' | 'any';
  onFiltersChange: (filters: FilterItem[]) => void;
  onExclusionFiltersChange: (filters: FilterItem[]) => void;
  onApprovalModeChange: (mode: 'all' | 'any') => void;
}

export const ApprovalProcess: React.FC<ApprovalProcessProps> = ({
  selectedFilters,
  exclusionFilters,
  approvalMode,
  onFiltersChange,
  onExclusionFiltersChange,
  onApprovalModeChange,
}) => {
  const [requireApproval, setRequireApproval] = useState(true);
  const [delegateIfAbsent, setDelegateIfAbsent] = useState(true);
  const [absentDays, setAbsentDays] = useState(5);
  const [delegateTo, setDelegateTo] = useState('Supervisor\'s supervisor');
  const [approvalSteps, setApprovalSteps] = useState([1]);
  const [stepFilters, setStepFilters] = useState<{[key: number]: {selected: FilterItem[], excluded: FilterItem[], mode: 'all' | 'any'}}>({
    1: { selected: [], excluded: [], mode: 'any' }
  });

  const addApprovalStep = () => {
    const newStepNumber = Math.max(...approvalSteps) + 1;
    setApprovalSteps(prev => [...prev, newStepNumber]);
    setStepFilters(prev => ({
      ...prev,
      [newStepNumber]: { selected: [], excluded: [], mode: 'any' }
    }));
  };

  const deleteApprovalStep = (stepNumber: number) => {
    setApprovalSteps(prev => prev.filter(step => step !== stepNumber));
    setStepFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[stepNumber];
      return newFilters;
    });
  };

  const updateStepFilters = (stepNumber: number, type: 'selected' | 'excluded', filters: FilterItem[]) => {
    setStepFilters(prev => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        [type]: filters
      }
    }));
  };

  const updateStepMode = (stepNumber: number, mode: 'all' | 'any') => {
    setStepFilters(prev => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        mode
      }
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setApprovalSteps((items) => {
        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getOrdinalSuffix = (num: number) => {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="max-w-[62rem] w-full px-4 sm:px-6 lg:px-8 self-start mt-32 mb-6">
      {/* Page Title and Description */}
      <div className="text-left mb-6 pl-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          Approval process
        </h3>
        <p className="text-base font-normal text-gray-500">
          Determine if time off requests require approval or are automatically approved
        </p>
      </div>

      {/* Main Container - Custom Background */}
      <div className="bg-[#05084A] bg-opacity-[0.02] rounded-2xl p-6 h-auto">
        {/* Section 1: Require Approval for Time Off */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Require approval for time off requests
              </h2>
              <p className="text-sm text-[#020713] text-opacity-45">
                Time off requests must be approved before being granted. You&apos;ll configure who approves these requests.
              </p>
            </div>
            
            {/* Radix UI Switch */}
            <div className="flex items-center ml-4">
              <Switch.Root
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
                className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors duration-200 ease-in-out cursor-pointer"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out translate-x-0.5 data-[state=checked]:translate-x-5" />
              </Switch.Root>
            </div>
          </div>
        </div>

        {/* Section 2: Approval Chain */}
        <AnimatePresence>
          {requireApproval && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24, marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="border-t border-gray-300 pt-6"
            >
              
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={approvalSteps}
                strategy={verticalListSortingStrategy}
              >
                {approvalSteps.map((stepNumber, index) => (
                  <div key={stepNumber} className={index > 0 ? '-mt-px' : ''}>
                    <ApprovalStep
                      stepNumber={stepNumber}
                                        title={
                    approvalSteps.length === 1 ? "Approver" :
                    index === 0 ? "First approver" : 
                    `${index + 1}${getOrdinalSuffix(index + 1)} approver`
                  }
                      selectedFilters={stepFilters[stepNumber]?.selected || []}
                      exclusionFilters={stepFilters[stepNumber]?.excluded || []}
                      approvalMode={stepFilters[stepNumber]?.mode || 'any'}
                      onFiltersChange={(filters) => updateStepFilters(stepNumber, 'selected', filters)}
                      onExclusionFiltersChange={(filters) => updateStepFilters(stepNumber, 'excluded', filters)}
                      onApprovalModeChange={(mode) => updateStepMode(stepNumber, mode)}
                      isFirst={index === 0}
                      isLast={index === approvalSteps.length - 1}
                                        canDelete={approvalSteps.length > 1}
                  onDelete={() => deleteApprovalStep(stepNumber)}
                  canDrag={approvalSteps.length > 1}
                    />
                  </div>
                ))}
              </SortableContext>
            </DndContext>
            
            <button
              onClick={addApprovalStep}
              className="mt-4 text-left text-sm text-gray-600 hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              + Add approval step
            </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 3: Delegate Request if Approver is Absent */}
        <AnimatePresence>
          {requireApproval && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900 mb-1 flex-1">
                  Delegate request if approver is absent
                </h2>
                
                {/* Radix UI Switch */}
                <div className="flex items-center ml-4">
                  <Switch.Root
                    checked={delegateIfAbsent}
                    onCheckedChange={setDelegateIfAbsent}
                    className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors duration-200 ease-in-out cursor-pointer"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
              </div>
              
              <AnimatePresence>
                {delegateIfAbsent && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="bg-white rounded-[10px] p-4 border border-gray-200"
                  >
                    <div className="space-y-4">
                      {/* Absent Days Input */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          If an approver is absent for this many days:
                        </span>
                        <input
                          type="number"
                          value={absentDays}
                          onChange={(e) => setAbsentDays(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          min="1"
                          max="30"
                        />
                      </div>
                      
                      {/* Delegate To Input */}
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-gray-700 mt-2">
                          Then delegate the request to this person:
                        </span>
                        <div className="w-80">
                          <MultiselectTypeahead
                            employees={employees}
                            departments={departments}
                            teams={teams}
                            groups={groups}
                            selectedFilters={[]}
                            onFiltersChange={() => {}}
                            placeholder="Select delegate..."
                            maxSelections={1}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
