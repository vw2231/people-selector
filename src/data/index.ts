import { employees, departments, teams, groups, legalEntities, costCenters, type Employee, type Department, type Team, type Group } from './employeeData';
export type { Employee, Department, Team, Group } from './employeeData';
export { employees, departments, teams, groups, legalEntities, costCenters } from './employeeData';

// Utility functions for data operations
export const getEmployeesByDepartment = (departmentName: string) => {
  return employees.filter(emp => emp.department === departmentName);
};

export const getEmployeesByTeam = (teamName: string) => {
  return employees.filter(emp => emp.team === teamName);
};

export const getEmployeesByLegalEntity = (legalEntity: string) => {
  return employees.filter(emp => emp.legalEntity === legalEntity);
};

export const getEmployeesByWorkplace = (workplace: string) => {
  return employees.filter(emp => emp.workplace === workplace);
};

export const getEmployeesByEmploymentType = (type: 'internal' | 'external') => {
  return employees.filter(emp => emp.employmentType === type);
};

export const getEmployeesByEmploymentStatus = (status: 'Full time' | 'Part time' | 'Working student') => {
  return employees.filter(emp => emp.employmentStatus === status);
};

export const getEmployeesByGender = (gender: 'Diverse' | 'Female' | 'Male' | 'Undefined') => {
  return employees.filter(emp => emp.gender === gender);
};

export const searchEmployees = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return employees.filter(emp => 
    emp.firstName.toLowerCase().includes(lowerQuery) ||
    emp.lastName.toLowerCase().includes(lowerQuery) ||
    emp.email.toLowerCase().includes(lowerQuery) ||
    emp.position.toLowerCase().includes(lowerQuery) ||
    emp.team.toLowerCase().includes(lowerQuery) ||
    emp.department.toLowerCase().includes(lowerQuery) ||
    emp.workplace.toLowerCase().includes(lowerQuery)
  );
};

export const getDepartmentStats = () => {
  return departments.map(dept => {
    const deptEmployees = getEmployeesByDepartment(dept.name);
    return {
      ...dept,
      employeeCount: deptEmployees.length,
      fullTimeCount: deptEmployees.filter(emp => emp.employmentStatus === 'Full time').length,
      partTimeCount: deptEmployees.filter(emp => emp.employmentStatus === 'Part time').length,
      workingStudentCount: deptEmployees.filter(emp => emp.employmentStatus === 'Working student').length,
      internalCount: deptEmployees.filter(emp => emp.employmentType === 'internal').length,
      externalCount: deptEmployees.filter(emp => emp.employmentType === 'external').length
    };
  });
};

export const getTeamStats = () => {
  return teams.map(team => {
    const teamEmployees = getEmployeesByTeam(team.name);
    return {
      ...team,
      employeeCount: teamEmployees.length,
      fullTimeCount: teamEmployees.filter(emp => emp.employmentStatus === 'Full time').length,
      partTimeCount: teamEmployees.filter(emp => emp.employmentStatus === 'Part time').length,
      workingStudentCount: teamEmployees.filter(emp => emp.employmentStatus === 'Working student').length,
      internalCount: teamEmployees.filter(emp => emp.employmentType === 'internal').length,
      externalCount: teamEmployees.filter(emp => emp.employmentType === 'external').length
    };
  });
};

// Group utility functions
export const getEmployeesByGroup = (groupId: string) => {
  const group = groups.find(g => g.id === groupId);
  if (!group) return [];
  return employees.filter(emp => group.members.includes(emp.id));
};

export const getGroupsByCategory = (category: Group['category']) => {
  return groups.filter(group => group.category === category);
};

export const getActiveGroups = () => {
  return groups.filter(group => group.isActive);
};

export const getGroupsByEmployee = (employeeId: string) => {
  return groups.filter(group => group.members.includes(employeeId));
};

export const getGroupStats = () => {
  return groups.map(group => {
    const groupEmployees = getEmployeesByGroup(group.id);
    return {
      ...group,
      employeeCount: groupEmployees.length,
      fullTimeCount: groupEmployees.filter(emp => emp.employmentStatus === 'Full time').length,
      partTimeCount: groupEmployees.filter(emp => emp.employmentStatus === 'Part time').length,
      workingStudentCount: groupEmployees.filter(emp => emp.employmentStatus === 'Working student').length,
      internalCount: groupEmployees.filter(emp => emp.employmentType === 'internal').length,
      externalCount: groupEmployees.filter(emp => emp.employmentType === 'external').length,
      departments: [...new Set(groupEmployees.map(emp => emp.department))],
      teams: [...new Set(groupEmployees.map(emp => emp.team))],
      workplaces: [...new Set(groupEmployees.map(emp => emp.workplace))]
    };
  });
};

export const searchGroups = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return groups.filter(group => 
    group.name.toLowerCase().includes(lowerQuery) ||
    group.description.toLowerCase().includes(lowerQuery) ||
    group.category.toLowerCase().includes(lowerQuery)
  );
};
