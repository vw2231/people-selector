# Employee Data Structure

This directory contains comprehensive mock data for a multinational EU-based tech company with 300 employees.

## Data Files

### `employeeData.ts`
Contains the core data structures and mock data:
- **Employee interface** with all required attributes
- **Department interface** for organizational structure
- **Team interface** for team-level organization
- **300 employees** with realistic data
- **7 departments** with leads and descriptions
- **22 teams** organized by department
- **3 legal entities** across different EU countries
- **15 cost centers** for financial tracking

### `index.ts`
Provides utility functions and easy access to all data:
- Export of all data structures
- Filtering functions by various criteria
- Search functionality
- Statistical analysis functions
- Group management utilities

## Employee Attributes

Each employee has the following attributes:

| Attribute | Type | Description | Values |
|-----------|------|-------------|---------|
| `id` | string | Unique employee identifier | EMP-001 to EMP-300 |
| `firstName` | string | Employee's first name | Various European names |
| `lastName` | string | Employee's last name | Various European surnames |
| `gender` | enum | Gender identity | Diverse, Female, Male, Undefined |
| `email` | string | Corporate email address | firstname.lastname@techcorp.eu |
| `employmentType` | enum | Employment relationship | internal, external |
| `employmentStatus` | enum | Work schedule | Full time, Part time, Working student |
| `position` | string | Job title | Various technical and business roles |
| `team` | string | Team assignment | One of 22 teams |
| `department` | string | Department assignment | One of 7 departments |
| `weeklyHours` | number | Standard weekly work hours | 16, 20, or 40 |
| `workplace` | string | Office location | 35+ European cities |
| `supervisor` | string | Direct manager | Team lead or department head |
| `secondarySupervisor` | string? | Secondary manager (optional) | Department head |
| `legalEntity` | string | Company legal structure | One of 3 entities |
| `hireDate` | string | Employment start date | 2020-2025 range |
| `probationLength` | number | Probation period in months | 3 or 6 months |
| `contractEndDate` | string? | Contract end date (optional) | For external employees |
| `costCenter` | string | Financial cost center | One of 15 cost centers |
| `groups` | string[] | Group memberships | Array of group IDs |

## Department Structure

The company is organized into 7 main departments:

1. **Engineering** - Software development and technical operations
2. **Product Management** - Product strategy and user experience
3. **Sales & Business Development** - Sales operations and partnerships
4. **Marketing & Communications** - Brand management and marketing
5. **Human Resources** - Talent acquisition and development
6. **Finance & Legal** - Financial planning and legal affairs
7. **Operations & IT** - IT infrastructure and business operations

## Team Structure

Each department contains multiple teams:

- **Engineering**: 5 teams (Frontend, Backend, DevOps, QA, Architecture)
- **Product Management**: 3 teams (Strategy, UX, Analytics)
- **Sales**: 3 teams (Enterprise, SMB, Partnerships)
- **Marketing**: 2 teams (Digital, Content)
- **HR**: 2 teams (Talent, L&D)
- **Finance**: 2 teams (Accounting, Legal)
- **Operations**: 2 teams (IT Support, Security)

## Groups Structure

The company uses a flexible grouping system that allows employees to belong to multiple groups across different categories:

### **Functional Groups**
- **HR Managers** - All HR managers and directors
- **Finance Leaders** - Finance and legal department leaders
- **Engineering Leaders** - All engineering team leads and architects
- **Product Leaders** - Product management team leads
- **Sales Leaders** - Sales team leads and managers

### **Geographic Groups**
- **Germany Team** - Employees based in German offices
- **France Team** - Employees based in French offices
- **Netherlands Team** - Employees based in Dutch offices
- **Nordic Team** - Employees from Nordic countries
- **Southern Europe Team** - Employees from Southern European countries

### **Leadership Groups**
- **Executive Leadership** - C-level executives and VPs
- **People Managers** - All employees who manage other people
- **Technical Leaders** - Technical architects and senior engineers

### **Project Groups**
- **Digital Transformation** - Core team for digital transformation initiatives
- **Compliance 2024** - Team working on regulatory compliance updates
- **Employee Experience** - Cross-functional team improving employee experience

### **Special Interest Groups**
- **Diversity & Equity** - Employee resource group for diversity and inclusion
- **Sustainability Champions** - Employees passionate about environmental sustainability
- **Learning & Development** - Employees focused on continuous learning
- **Remote Work Advocates** - Team promoting remote work practices

## Legal Entities

1. **TechCorp Europe GmbH** (Germany) - Main headquarters
2. **TechCorp Solutions SARL** (France) - French operations
3. **TechCorp Innovation BV** (Netherlands) - Dutch operations

## Utility Functions

### Filtering Functions
- `getEmployeesByDepartment(departmentName)` - Filter by department
- `getEmployeesByTeam(teamName)` - Filter by team
- `getEmployeesByLegalEntity(legalEntity)` - Filter by legal entity
- `getEmployeesByWorkplace(workplace)` - Filter by office location
- `getEmployeesByEmploymentType(type)` - Filter by employment type
- `getEmployeesByEmploymentStatus(status)` - Filter by work schedule
- `getEmployeesByGender(gender)` - Filter by gender

### Search Functions
- `searchEmployees(query)` - Search across multiple fields

### Statistical Functions
- `getDepartmentStats()` - Department-level statistics
- `getTeamStats()` - Team-level statistics
- `getGroupStats()` - Group-level statistics with cross-department insights

## Usage Example

```typescript
import { employees, groups, getEmployeesByDepartment, getEmployeesByGroup, searchEmployees } from '@/data';

// Get all engineering employees
const engineeringEmployees = getEmployeesByDepartment('Engineering');

// Get all employees in a specific group
const hrManagers = getEmployeesByGroup('FUNC-HR-MANAGERS');

// Search for employees by name or position
const searchResults = searchEmployees('developer');

// Get groups by category
const functionalGroups = getGroupsByCategory('Functional');

// Access individual employee data
const firstEmployee = employees[0];
console.log(firstEmployee.firstName, firstEmployee.position, firstEmployee.groups);

// Check which groups an employee belongs to
const employeeGroups = getGroupsByEmployee('EMP-001');
```

## Data Distribution

The mock data includes:
- **Gender diversity**: Balanced representation across all categories
- **Employment types**: 90% internal, 10% external
- **Work schedules**: 80% full-time, 15% part-time, 5% working students
- **Geographic distribution**: 35+ European cities across 20+ countries
- **Hierarchical structure**: Clear reporting relationships
- **Realistic data**: Varied hire dates, probation periods, and contract terms
- **Group memberships**: Employees belong to 1-3 groups on average, enabling cross-functional collaboration
