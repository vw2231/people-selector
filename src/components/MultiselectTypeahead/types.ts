import type { Employee, Department, Team, Group } from '@/data';

// Re-export data types for convenience
export type { Employee, Department, Team, Group };

// Core filter types
export type FilterOperator = 
  | 'is' | 'is not'
  | 'contains' | 'does not contain'
  | 'greater than' | 'less than' | 'between'
  | 'before' | 'after';

export interface FilterItem {
  id: string;
  category: 'relationships' | 'groups' | 'attributes' | 'people';
  subject: string;
  operator: FilterOperator;
  value: string | number | Date;
  displayValue: string;
  availableOperators: FilterOperator[];
  metadata?: Record<string, any>; // Additional data for complex filters
}

// Filter option interfaces
export interface EmployeeFilterOptions {
  relationships: RelationshipOption[];
  groups: GroupOption[];
  attributes: AttributeOption[];
  people: PersonOption[];
}

export interface RelationshipOption {
  id: string;
  label: string;
  type: 'supervisor' | 'direct_report' | 'skip_level' | 'peer';
  targetPersonId: string;
  targetPersonName: string;
  description: string;
}

export interface GroupOption {
  id: string;
  label: string;
  type: 'group' | 'team' | 'department';
  groupId: string;
  groupName: string;
  memberCount: number;
  category?: string;
  description: string;
}

export interface AttributeOption {
  id: string;
  label: string;
  attributeKey: keyof Employee;
  dataType: 'string' | 'number' | 'date' | 'enum';
  possibleValues?: string[];
  description: string;
}

export interface PersonOption {
  id: string;
  label: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  team: string;
  email: string;
}

// Component props
export interface MultiselectTypeaheadProps {
  employees: Employee[];
  departments: Department[];
  teams: Team[];
  groups: Group[];
  selectedFilters: FilterItem[];
  onFiltersChange: (filters: FilterItem[]) => void;
  onEmployeeSelect?: (employees: Employee[]) => void;
  maxSelections?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Filter chip props
export interface FilterChipProps {
  filter: FilterItem;
  onOperatorChange: (filterId: string, newOperator: FilterOperator) => void;
  onRemove: (filterId: string) => void;
}

// Search and filter utilities
export interface SearchResult {
  category: 'relationships' | 'groups' | 'attributes' | 'people';
  options: (RelationshipOption | GroupOption | AttributeOption | PersonOption)[];
  score: number;
}

export interface FilterEvaluationResult {
  employee: Employee;
  passes: boolean;
  failedFilters: string[];
}
