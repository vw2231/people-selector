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
  FilterOperator
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
  
  // Find all supervisors
  const supervisors = [...new Set(employees.map(emp => emp.supervisor))];
  
  supervisors.forEach(supervisor => {
    if (supervisor === 'CEO') return; // Skip CEO for now
    
    const supervisorEmployee = employees.find(emp => 
      `${emp.firstName} ${emp.lastName}` === supervisor ||
      emp.firstName === supervisor ||
      emp.lastName === supervisor
    );
    
    if (supervisorEmployee) {
      // Direct reports
      const directReports = employees.filter(emp => emp.supervisor === supervisor);
      if (directReports.length > 0) {
        options.push({
          id: `rel-direct-${supervisorEmployee.id}`,
          label: `Direct reports of ${supervisor}`,
          type: 'direct_report',
          targetPersonId: supervisorEmployee.id,
          targetPersonName: supervisor,
          description: `${directReports.length} direct reports`
        });
      }
      
      // Supervised by
      options.push({
        id: `rel-supervised-${supervisorEmployee.id}`,
        label: `Supervised by ${supervisor}`,
        type: 'supervisor',
        targetPersonId: supervisorEmployee.id,
        targetPersonName: supervisor,
        description: 'Filter by supervisor'
      });
      
      // Peers (same supervisor)
      const peers = employees.filter(emp => 
        emp.supervisor === supervisor && emp.id !== supervisorEmployee.id
      );
      if (peers.length > 0) {
        options.push({
          id: `rel-peers-${supervisorEmployee.id}`,
          label: `Peers of ${supervisor}`,
          type: 'peer',
          targetPersonId: supervisorEmployee.id,
          targetPersonName: supervisor,
          description: `${peers.length} peers with same supervisor`
        });
      }
    }
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
  
  // Department options
  departments.forEach(dept => {
    options.push({
      id: `dept-${dept.id}`,
      label: `Department: ${dept.name}`,
      type: 'department',
      groupId: dept.id,
      groupName: dept.name,
      memberCount: 0, // Will be calculated when used
      category: 'Department',
      description: dept.description
    });
  });
  
  // Team options
  teams.forEach(team => {
    options.push({
      id: `team-${team.id}`,
      label: `Team: ${team.name}`,
      type: 'team',
      groupId: team.id,
      groupName: team.name,
      memberCount: 0, // Will be calculated when used
      category: team.department,
      description: team.description
    });
  });
  
  // Special groups
  groups.forEach(group => {
    options.push({
      id: `group-${group.id}`,
      label: `Group: ${group.name}`,
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
      possibleValues: ['internal', 'external'],
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
export function getEmployeeValue(employee: Employee, attributeKey: keyof Employee): any {
  return employee[attributeKey];
}

// Evaluate a single filter against an employee
export function evaluateFilter(employee: Employee, filter: any): boolean {
  let value: any;
  
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
      return new Date(value) < new Date(filter.value);
    case 'after':
      return new Date(value) > new Date(filter.value);
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
function getRelationshipValue(employee: Employee, filter: any): boolean {
  // This would need to be implemented based on the specific relationship type
  // For now, return a placeholder
  return false;
}

// Helper function to get group values
function getGroupValue(employee: Employee, filter: any): boolean {
  if (filter.type === 'department') {
    return employee.department === filter.groupName;
  } else if (filter.type === 'team') {
    return employee.team === filter.groupName;
  } else if (filter.type === 'group') {
    return employee.groups.includes(filter.groupId);
  }
  return false;
}
