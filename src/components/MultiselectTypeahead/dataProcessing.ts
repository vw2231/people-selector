import type { 
  Employee, 
  Department, 
  Team, 
  Group,
  EmployeeFilterOptions,
  RelationshipOption,
  GroupOption,
  AttributeOption,
  PersonOption,
  FilterOperator,
  FilterItem
} from './types';

// Generate all filter options from employee data
export function generateFilterOptions(
  employees: Employee[], 
  departments: Department[], 
  teams: Team[], 
  groups: Group[]
): EmployeeFilterOptions {
  return {
    relationships: generateRelationshipOptions(employees),
    groups: generateGroupOptions(departments, teams, groups),
    attributes: generateAttributeOptions(employees),
    people: generatePersonOptions(employees)
  };
}

// Generate relationship-based filter options
function generateRelationshipOptions(employees: Employee[]): RelationshipOption[] {
  const options: RelationshipOption[] = [];
  
  // Supervisor relationship
  options.push({
    id: 'rel-supervisor',
    label: 'Supervisor',
    type: 'supervisor',
    targetPersonId: 'supervisor',
    targetPersonName: 'Supervisor',
    description: 'Filter by direct supervisor'
  });
  
  // Secondary Supervisor relationship
  options.push({
    id: 'rel-secondary-supervisor',
    label: 'Secondary Supervisor',
    type: 'secondary_supervisor',
    targetPersonId: 'secondary_supervisor',
    targetPersonName: 'Secondary Supervisor',
    description: 'Filter by secondary supervisor'
  });
  
  // Supervisor's Supervisor relationship
  options.push({
    id: 'rel-supervisors-supervisor',
    label: 'Supervisor\'s Supervisor',
    type: 'skip_level',
    targetPersonId: 'skip_level_supervisor',
    targetPersonName: 'Skip Level Supervisor',
    description: 'Filter by supervisor\'s supervisor'
  });
  
  // Team Lead relationship
  options.push({
    id: 'rel-team-lead',
    label: 'Team Lead',
    type: 'team_lead',
    targetPersonId: 'team_lead',
    targetPersonName: 'Team Lead',
    description: 'Filter by team lead'
  });
  
  // Department Lead relationship
  options.push({
    id: 'rel-department-lead',
    label: 'Department Lead',
    type: 'department_lead',
    targetPersonId: 'department_lead',
    targetPersonName: 'Department Lead',
    description: 'Filter by department lead'
  });
  
  return options;
}

// Generate group-based filter options
function generateGroupOptions(
  departments: Department[], 
  teams: Team[], 
  groups: Group[]
): GroupOption[] {
  const options: GroupOption[] = [];
  
  // Only include special groups, not departments or teams
  groups.forEach(group => {
    options.push({
      id: `group-${group.id}`,
      label: group.name,
      type: 'group',
      groupId: group.id,
      groupName: group.name,
      memberCount: group.members.length,
      category: group.category,
      description: group.description
    });
  });
  
  return options;
}

// Generate attribute-based filter options
function generateAttributeOptions(employees: Employee[]): AttributeOption[] {
  const options: AttributeOption[] = [
    {
      id: 'attr-gender',
      label: 'Gender',
      attributeKey: 'gender',
      dataType: 'enum',
      possibleValues: ['Diverse', 'Female', 'Male', 'Undefined'],
      description: 'Filter by gender identity'
    },
    {
      id: 'attr-employmentType',
      label: 'Employment Type',
      attributeKey: 'employmentType',
      dataType: 'enum',
      possibleValues: ['Internal', 'External'],
      description: 'Filter by employment relationship'
    },
    {
      id: 'attr-employmentStatus',
      label: 'Employment Status',
      attributeKey: 'employmentStatus',
      dataType: 'enum',
      possibleValues: ['Full time', 'Part time', 'Working student'],
      description: 'Filter by work schedule'
    },
    {
      id: 'attr-position',
      label: 'Position',
      attributeKey: 'position',
      dataType: 'string',
      description: 'Filter by job title'
    },
    {
      id: 'attr-weeklyHours',
      label: 'Weekly Hours',
      attributeKey: 'weeklyHours',
      dataType: 'number',
      description: 'Filter by weekly work hours'
    },
    {
      id: 'attr-workplace',
      label: 'Workplace',
      attributeKey: 'workplace',
      dataType: 'string',
      description: 'Filter by office location'
    },
    {
      id: 'attr-legalEntity',
      label: 'Legal Entity',
      attributeKey: 'legalEntity',
      dataType: 'string',
      description: 'Filter by company legal structure'
    },
    {
      id: 'attr-probationLength',
      label: 'Probation Length',
      attributeKey: 'probationLength',
      dataType: 'number',
      description: 'Filter by probation period in months'
    },
    {
      id: 'attr-costCenter',
      label: 'Cost Center',
      attributeKey: 'costCenter',
      dataType: 'string',
      description: 'Filter by financial cost center'
    },
    {
      id: 'attr-hireDate',
      label: 'Hire Date',
      attributeKey: 'hireDate',
      dataType: 'date',
      description: 'Filter by employment start date'
    },
    {
      id: 'attr-contractEndDate',
      label: 'Contract End Date',
      attributeKey: 'contractEndDate',
      dataType: 'date',
      description: 'Filter by contract end date'
    }
  ];
  
  return options;
}

// Generate person-based filter options
function generatePersonOptions(employees: Employee[]): PersonOption[] {
  return employees.map(emp => ({
    id: `person-${emp.id}`,
    label: `${emp.firstName} ${emp.lastName} (${emp.position})`,
    employeeId: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    position: emp.position,
    department: emp.department,
    team: emp.team,
    email: emp.email
  }));
}

// Get available operators for a specific data type
export function getAvailableOperators(dataType: 'string' | 'number' | 'date' | 'enum'): FilterOperator[] {
  switch (dataType) {
    case 'string':
      return ['is', 'is not', 'contains', 'does not contain'];
    case 'number':
      return ['is', 'is not', 'greater than', 'less than', 'between'];
    case 'date':
      return ['is', 'is not', 'before', 'after', 'between'];
    case 'enum':
      return ['is', 'is not'];
    default:
      return ['is', 'is not'];
  }
}

// Get the value of an employee attribute
export function getEmployeeValue(employee: Employee, attributeKey: keyof Employee): unknown {
  return employee[attributeKey];
}

// Evaluate a single filter against an employee
export function evaluateFilter(employee: Employee, filter: FilterItem): boolean {
  let value: unknown;
  
  // Handle special cases for relationships and groups
  if (filter.category === 'relationships') {
    value = getRelationshipValue(employee, filter);
  } else if (filter.category === 'groups') {
    value = getGroupValue(employee, filter);
  } else {
    value = getEmployeeValue(employee, filter.subject as keyof Employee);
  }
  
  switch (filter.operator) {
    case 'is':
      return value === filter.value;
    case 'is not':
      return value !== filter.value;
    case 'contains':
      return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case 'does not contain':
      return !String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case 'greater than':
      return Number(value) > Number(filter.value);
    case 'less than':
      return Number(value) < Number(filter.value);
    case 'before':
      return new Date(String(value)) < new Date(String(filter.value));
    case 'after':
      return new Date(String(value)) > new Date(String(filter.value));
    case 'between':
      if (Array.isArray(filter.value) && filter.value.length === 2) {
        const numValue = Number(value);
        return numValue >= filter.value[0] && numValue <= filter.value[1];
      }
      return false;
    default:
      return true;
  }
}

// Helper function to get relationship values
function getRelationshipValue(employee: Employee, filter: FilterItem): boolean {
  const originalOption = filter.metadata?.originalOption as { type: string; targetPersonName?: string };
  if (!originalOption) return false;
  
  switch (originalOption.type) {
    case 'supervisor':
      return employee.supervisor === filter.displayValue;
    case 'secondary_supervisor':
      return employee.secondarySupervisor === filter.displayValue;
    case 'skip_level':
      // For skip-level supervisor, we would need to implement this based on the actual data structure
      // This is a placeholder - in practice you'd need to pass the employees array or implement differently
      return false; // Placeholder for now
    case 'team_lead':
      // Check if employee's team has a lead (this would need to be implemented based on your data structure)
      return false; // Placeholder for now
    case 'department_lead':
      // Check if employee's department has a lead (this would need to be implemented based on your data structure)
      return false; // Placeholder for now
    default:
      return false;
  }
}

// Helper function to get group values
function getGroupValue(employee: Employee, filter: FilterItem): boolean {
  const originalOption = filter.metadata?.originalOption as { type: string; groupName?: string; groupId?: string };
  if (!originalOption) return false;
  
  // Only handle groups now
  if (originalOption.type === 'group') {
    return employee.groups.includes(originalOption.groupId || '');
  }
  return false;
}
