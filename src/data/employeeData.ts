export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Diverse' | 'Female' | 'Male' | 'Undefined';
  email: string;
  employmentType: 'internal' | 'external';
  employmentStatus: 'Full time' | 'Part time' | 'Working student';
  position: string;
  team: string;
  department: string;
  weeklyHours: number;
  workplace: string;
  supervisor: string;
  secondarySupervisor?: string;
  legalEntity: string;
  hireDate: string;
  probationLength: number; // in months
  contractEndDate?: string;
  costCenter: string;
  groups: string[]; // Array of group IDs the employee belongs to
}

export interface Department {
  id: string;
  name: string;
  lead: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  lead: string;
  department: string;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: 'Functional' | 'Geographic' | 'Leadership' | 'Project' | 'Special Interest';
  members: string[]; // Array of employee IDs
  createdDate: string;
  isActive: boolean;
}

// Department structure
export const departments: Department[] = [
  {
    id: 'ENG',
    name: 'Engineering',
    lead: 'Dr. Sarah Müller',
    description: 'Software development, architecture, and technical operations'
  },
  {
    id: 'PROD',
    name: 'Product Management',
    lead: 'Marco Rossi',
    description: 'Product strategy, roadmap, and user experience'
  },
  {
    id: 'SALES',
    name: 'Sales & Business Development',
    lead: 'Anna Kowalska',
    description: 'Sales operations, partnerships, and market expansion'
  },
  {
    id: 'MKTG',
    name: 'Marketing & Communications',
    lead: 'Pierre Dubois',
    description: 'Brand management, digital marketing, and PR'
  },
  {
    id: 'HR',
    name: 'Human Resources',
    lead: 'Elena Vasquez',
    description: 'Talent acquisition, development, and employee relations'
  },
  {
    id: 'FIN',
    name: 'Finance & Legal',
    lead: 'Hans Weber',
    description: 'Financial planning, compliance, and legal affairs'
  },
  {
    id: 'OPS',
    name: 'Operations & IT',
    lead: 'Claire Martin',
    description: 'IT infrastructure, security, and business operations'
  }
];

// Team structure
export const teams: Team[] = [
  // Engineering teams
  {
    id: 'ENG-FE',
    name: 'Frontend Development',
    lead: 'Lisa Andersson',
    department: 'Engineering',
    description: 'React, Vue, and mobile app development'
  },
  {
    id: 'ENG-BE',
    name: 'Backend Development',
    lead: 'Carlos Rodriguez',
    department: 'Engineering',
    description: 'API development, microservices, and databases'
  },
  {
    id: 'ENG-DEVOPS',
    name: 'DevOps & Infrastructure',
    lead: 'Mikhail Petrov',
    department: 'Engineering',
    description: 'CI/CD, cloud infrastructure, and monitoring'
  },
  {
    id: 'ENG-QA',
    name: 'Quality Assurance',
    lead: 'Sofia Papadopoulos',
    department: 'Engineering',
    description: 'Testing, automation, and quality processes'
  },
  {
    id: 'ENG-ARCH',
    name: 'Software Architecture',
    lead: 'Dr. Sarah Müller',
    department: 'Engineering',
    description: 'System design, technical strategy, and standards'
  },
  
  // Product teams
  {
    id: 'PROD-STRAT',
    name: 'Product Strategy',
    lead: 'Marco Rossi',
    department: 'Product Management',
    description: 'Product vision, roadmap, and market analysis'
  },
  {
    id: 'PROD-UX',
    name: 'User Experience',
    lead: 'Emma Thompson',
    department: 'Product Management',
    description: 'UX research, design, and usability testing'
  },
  {
    id: 'PROD-ANALYTICS',
    name: 'Product Analytics',
    lead: 'Felix Schmidt',
    department: 'Product Management',
    description: 'Data analysis, metrics, and insights'
  },
  
  // Sales teams
  {
    id: 'SALES-ENTERPRISE',
    name: 'Enterprise Sales',
    lead: 'Anna Kowalska',
    department: 'Sales & Business Development',
    description: 'Large enterprise client acquisition and management'
  },
  {
    id: 'SALES-SMB',
    name: 'SMB Sales',
    lead: 'Thomas Berg',
    department: 'Sales & Business Development',
    description: 'Small and medium business sales'
  },
  {
    id: 'SALES-PARTNERS',
    name: 'Partnerships',
    lead: 'Maria Santos',
    department: 'Sales & Business Development',
    description: 'Strategic partnerships and channel development'
  },
  
  // Marketing teams
  {
    id: 'MKTG-DIGITAL',
    name: 'Digital Marketing',
    lead: 'Pierre Dubois',
    department: 'Marketing & Communications',
    description: 'Online advertising, SEO, and social media'
  },
  {
    id: 'MKTG-CONTENT',
    name: 'Content & Creative',
    lead: 'Isabella Costa',
    department: 'Marketing & Communications',
    description: 'Content creation, branding, and creative assets'
  },
  
  // HR teams
  {
    id: 'HR-TALENT',
    name: 'Talent Acquisition',
    lead: 'Elena Vasquez',
    department: 'Human Resources',
    description: 'Recruitment, hiring, and employer branding'
  },
  {
    id: 'HR-DEV',
    name: 'Learning & Development',
    lead: 'Jan Novak',
    department: 'Human Resources',
    description: 'Training, career development, and performance management'
  },
  
  // Finance teams
  {
    id: 'FIN-ACCOUNTING',
    name: 'Accounting & Controlling',
    lead: 'Hans Weber',
    department: 'Finance & Legal',
    description: 'Financial reporting, budgeting, and cost control'
  },
  {
    id: 'FIN-LEGAL',
    name: 'Legal & Compliance',
    lead: 'Dr. Julia Nowak',
    department: 'Finance & Legal',
    description: 'Legal affairs, compliance, and risk management'
  },
  
  // Operations teams
  {
    id: 'OPS-IT',
    name: 'IT Support',
    lead: 'Claire Martin',
    department: 'Operations & IT',
    description: 'Help desk, IT infrastructure, and user support'
  },
  {
    id: 'OPS-SECURITY',
    name: 'Information Security',
    lead: 'Alex Chen',
    department: 'Operations & IT',
    description: 'Cybersecurity, data protection, and access control'
  }
];

// Groups structure - flexible organizational groupings
export const groups: Group[] = [
  // Functional Groups
  {
    id: 'FUNC-HR-MANAGERS',
    name: 'HR Managers',
    description: 'All HR managers and directors across the organization',
    category: 'Functional',
    members: ['EMP-017', 'EMP-012'], // Elena Vasquez, Jan Novak
    createdDate: '2022-01-15',
    isActive: true
  },
  {
    id: 'FUNC-FINANCE-LEADS',
    name: 'Finance Leaders',
    description: 'Finance and legal department leaders',
    category: 'Functional',
    members: ['EMP-018', 'EMP-013'], // Hans Weber, Dr. Julia Nowak
    createdDate: '2022-02-01',
    isActive: true
  },
  {
    id: 'FUNC-ENGINEERING-LEADS',
    name: 'Engineering Leaders',
    description: 'All engineering team leads and architects',
    category: 'Functional',
    members: ['EMP-001', 'EMP-004', 'EMP-005', 'EMP-006'], // Dr. Sarah Müller, Lisa Andersson, Carlos Rodriguez, Mikhail Petrov
    createdDate: '2022-01-10',
    isActive: true
  },
  {
    id: 'FUNC-PRODUCT-LEADS',
    name: 'Product Leaders',
    description: 'Product management team leads',
    category: 'Functional',
    members: ['EMP-002', 'EMP-007', 'EMP-008'], // Marco Rossi, Emma Thompson, Felix Schmidt
    createdDate: '2022-01-20',
    isActive: true
  },
  {
    id: 'FUNC-SALES-LEADS',
    name: 'Sales Leaders',
    description: 'Sales team leads and managers',
    category: 'Functional',
    members: ['EMP-003', 'EMP-009', 'EMP-010'], // Anna Kowalska, Thomas Berg, Maria Santos
    createdDate: '2022-01-25',
    isActive: true
  },
  
  // Geographic Groups
  {
    id: 'GEO-GERMANY',
    name: 'Germany Team',
    description: 'All employees based in German offices',
    category: 'Geographic',
    members: ['EMP-001', 'EMP-006', 'EMP-008', 'EMP-018'], // Dr. Sarah Müller, Mikhail Petrov, Felix Schmidt, Hans Weber
    createdDate: '2021-06-01',
    isActive: true
  },
  {
    id: 'GEO-FRANCE',
    name: 'France Team',
    description: 'All employees based in French offices',
    category: 'Geographic',
    members: ['EMP-019', 'EMP-020'], // Claire Martin, Pierre Dubois
    createdDate: '2021-06-01',
    isActive: true
  },
  {
    id: 'GEO-NETHERLANDS',
    name: 'Netherlands Team',
    description: 'All employees based in Dutch offices',
    category: 'Geographic',
    members: ['EMP-014'], // Alex Chen
    createdDate: '2021-06-01',
    isActive: true
  },
  {
    id: 'GEO-NORDIC',
    name: 'Nordic Team',
    description: 'Employees from Nordic countries',
    category: 'Geographic',
    members: ['EMP-004', 'EMP-009', 'EMP-016'], // Lisa Andersson, Thomas Berg, Lars Nielsen
    createdDate: '2021-08-01',
    isActive: true
  },
  {
    id: 'GEO-SOUTHERN-EUROPE',
    name: 'Southern Europe Team',
    description: 'Employees from Southern European countries',
    category: 'Geographic',
    members: ['EMP-002', 'EMP-005', 'EMP-011', 'EMP-015', 'EMP-017'], // Marco Rossi, Carlos Rodriguez, Isabella Costa, Sofia Papadopoulos, Elena Vasquez
    createdDate: '2021-08-01',
    isActive: true
  },
  
  // Leadership Groups
  {
    id: 'LEAD-EXECUTIVE',
    name: 'Executive Leadership',
    description: 'C-level executives and VPs',
    category: 'Leadership',
    members: ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-017', 'EMP-018', 'EMP-019', 'EMP-020'], // All VPs and C-level
    createdDate: '2020-01-01',
    isActive: true
  },
  {
    id: 'LEAD-MANAGERS',
    name: 'People Managers',
    description: 'All employees who manage other people',
    category: 'Leadership',
    members: ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005', 'EMP-006', 'EMP-007', 'EMP-008', 'EMP-009', 'EMP-010', 'EMP-011', 'EMP-012', 'EMP-013', 'EMP-014', 'EMP-017', 'EMP-018', 'EMP-019', 'EMP-020'],
    createdDate: '2021-01-01',
    isActive: true
  },
  {
    id: 'LEAD-TECHNICAL',
    name: 'Technical Leaders',
    description: 'Technical architects and senior engineers',
    category: 'Leadership',
    members: ['EMP-001', 'EMP-004', 'EMP-005', 'EMP-006', 'EMP-015'], // Engineering leads and senior developers
    createdDate: '2021-03-01',
    isActive: true
  },
  
  // Project Groups
  {
    id: 'PROJ-DIGITAL-TRANSFORMATION',
    name: 'Digital Transformation',
    description: 'Core team working on digital transformation initiatives',
    category: 'Project',
    members: ['EMP-001', 'EMP-002', 'EMP-019', 'EMP-020'], // Engineering, Product, CTO, CMO
    createdDate: '2022-03-01',
    isActive: true
  },
  {
    id: 'PROJ-COMPLIANCE-2024',
    name: 'Compliance 2024',
    description: 'Team working on regulatory compliance updates',
    category: 'Project',
    members: ['EMP-013', 'EMP-018', 'EMP-014'], // Legal, Finance, Security
    createdDate: '2023-01-01',
    isActive: true
  },
  {
    id: 'PROJ-EMPLOYEE-EXPERIENCE',
    name: 'Employee Experience',
    description: 'Cross-functional team improving employee experience',
    category: 'Project',
    members: ['EMP-017', 'EMP-012', 'EMP-020', 'EMP-007'], // HR, L&D, Marketing, UX
    createdDate: '2022-09-01',
    isActive: true
  },
  
  // Special Interest Groups
  {
    id: 'SIG-DIVERSITY-EQUITY',
    name: 'Diversity & Equity',
    description: 'Employee resource group for diversity and inclusion',
    category: 'Special Interest',
    members: ['EMP-017', 'EMP-012', 'EMP-007', 'EMP-011'], // HR leaders, UX, Content
    createdDate: '2021-12-01',
    isActive: true
  },
  {
    id: 'SIG-SUSTAINABILITY',
    name: 'Sustainability Champions',
    description: 'Employees passionate about environmental sustainability',
    category: 'Special Interest',
    members: ['EMP-002', 'EMP-019', 'EMP-014'], // Product, CTO, Security
    createdDate: '2022-04-01',
    isActive: true
  },
  {
    id: 'SIG-LEARNING',
    name: 'Learning & Development',
    description: 'Employees focused on continuous learning and development',
    category: 'Special Interest',
    members: ['EMP-012', 'EMP-007', 'EMP-008', 'EMP-015'], // L&D lead, UX, Analytics, Senior Developer
    createdDate: '2022-01-01',
    isActive: true
  },
  {
    id: 'SIG-REMOTE-WORK',
    name: 'Remote Work Advocates',
    description: 'Team promoting and improving remote work practices',
    category: 'Special Interest',
    members: ['EMP-006', 'EMP-014', 'EMP-020'], // DevOps, Security, Marketing
    createdDate: '2021-11-01',
    isActive: true
  }
];

// Legal entities
export const legalEntities = [
  'TechCorp Europe GmbH (Germany)',
  'TechCorp Solutions SARL (France)',
  'TechCorp Innovation BV (Netherlands)'
];

// Cost centers
export const costCenters = [
  'CC-ENG-001', 'CC-ENG-002', 'CC-ENG-003',
  'CC-PROD-001', 'CC-PROD-002',
  'CC-SALES-001', 'CC-SALES-002', 'CC-SALES-003',
  'CC-MKTG-001', 'CC-MKTG-002',
  'CC-HR-001', 'CC-HR-002',
  'CC-FIN-001', 'CC-FIN-002',
  'CC-OPS-001', 'CC-OPS-002'
];

// Generate 300 employees with realistic data
export const employees: Employee[] = [
  // Executive Leadership
  {
    id: 'EMP-001',
    firstName: 'Dr. Sarah',
    lastName: 'Müller',
    gender: 'Female',
    email: 'sarah.mueller@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'VP of Engineering',
    team: 'Software Architecture',
    department: 'Engineering',
    weeklyHours: 40,
    workplace: 'Berlin, Germany',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2020-03-15',
    probationLength: 6,
    costCenter: 'CC-ENG-001',
    groups: ['ENG-ARCH', 'ENG-DEVOPS', 'ENG-QA']
  },
  {
    id: 'EMP-002',
    firstName: 'Marco',
    lastName: 'Rossi',
    gender: 'Male',
    email: 'marco.rossi@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'VP of Product',
    team: 'Product Strategy',
    department: 'Product Management',
    weeklyHours: 40,
    workplace: 'Milan, Italy',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2019-11-08',
    probationLength: 6,
    costCenter: 'CC-PROD-001',
    groups: ['PROD-STRAT', 'PROD-UX', 'PROD-ANALYTICS']
  },
  {
    id: 'EMP-003',
    firstName: 'Anna',
    lastName: 'Kowalska',
    gender: 'Female',
    email: 'anna.kowalska@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'VP of Sales',
    team: 'Enterprise Sales',
    department: 'Sales & Business Development',
    weeklyHours: 40,
    workplace: 'Warsaw, Poland',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-01-20',
    probationLength: 6,
    costCenter: 'CC-SALES-001',
    groups: ['SALES-ENTERPRISE', 'SALES-SMB', 'SALES-PARTNERS']
  },
  
  // Engineering Team Leads
  {
    id: 'EMP-004',
    firstName: 'Lisa',
    lastName: 'Andersson',
    gender: 'Female',
    email: 'lisa.andersson@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Frontend Team Lead',
    team: 'Frontend Development',
    department: 'Engineering',
    weeklyHours: 40,
    workplace: 'Stockholm, Sweden',
    supervisor: 'Dr. Sarah Müller',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-06-10',
    probationLength: 3,
    costCenter: 'CC-ENG-002',
    groups: ['ENG-FE']
  },
  {
    id: 'EMP-005',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    gender: 'Male',
    email: 'carlos.rodriguez@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Backend Team Lead',
    team: 'Backend Development',
    department: 'Engineering',
    weeklyHours: 40,
    workplace: 'Madrid, Spain',
    supervisor: 'Dr. Sarah Müller',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-08-15',
    probationLength: 3,
    costCenter: 'CC-ENG-002',
    groups: ['ENG-BE']
  },
  {
    id: 'EMP-006',
    firstName: 'Mikhail',
    lastName: 'Petrov',
    gender: 'Male',
    email: 'mikhail.petrov@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'DevOps Team Lead',
    team: 'DevOps & Infrastructure',
    department: 'Engineering',
    weeklyHours: 40,
    workplace: 'Berlin, Germany',
    supervisor: 'Dr. Sarah Müller',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2022-01-10',
    probationLength: 3,
    costCenter: 'CC-ENG-003',
    groups: ['ENG-DEVOPS']
  },
  
  // Product Team Leads
  {
    id: 'EMP-007',
    firstName: 'Emma',
    lastName: 'Thompson',
    gender: 'Female',
    email: 'emma.thompson@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'UX Team Lead',
    team: 'User Experience',
    department: 'Product Management',
    weeklyHours: 40,
    workplace: 'London, UK',
    supervisor: 'Marco Rossi',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-09-20',
    probationLength: 3,
    costCenter: 'CC-PROD-002',
    groups: ['PROD-UX']
  },
  {
    id: 'EMP-008',
    firstName: 'Felix',
    lastName: 'Schmidt',
    gender: 'Male',
    email: 'felix.schmidt@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Analytics Team Lead',
    team: 'Product Analytics',
    department: 'Product Management',
    weeklyHours: 40,
    workplace: 'Munich, Germany',
    supervisor: 'Marco Rossi',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2022-03-01',
    probationLength: 3,
    costCenter: 'CC-PROD-002',
    groups: ['PROD-ANALYTICS']
  },
  
  // Sales Team Leads
  {
    id: 'EMP-009',
    firstName: 'Thomas',
    lastName: 'Berg',
    gender: 'Male',
    email: 'thomas.berg@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'SMB Sales Team Lead',
    team: 'SMB Sales',
    department: 'Sales & Business Development',
    weeklyHours: 40,
    workplace: 'Oslo, Norway',
    supervisor: 'Anna Kowalska',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-07-12',
    probationLength: 3,
    costCenter: 'CC-SALES-002',
    groups: ['SALES-SMB']
  },
  {
    id: 'EMP-010',
    firstName: 'Maria',
    lastName: 'Santos',
    gender: 'Female',
    email: 'maria.santos@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Partnerships Team Lead',
    team: 'Partnerships',
    department: 'Sales & Business Development',
    weeklyHours: 40,
    workplace: 'Lisbon, Portugal',
    supervisor: 'Anna Kowalska',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2022-02-15',
    probationLength: 3,
    costCenter: 'CC-SALES-003',
    groups: ['SALES-PARTNERS']
  },
  
  // Marketing Team Leads
  {
    id: 'EMP-011',
    firstName: 'Isabella',
    lastName: 'Costa',
    gender: 'Female',
    email: 'isabella.costa@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Content Team Lead',
    team: 'Content & Creative',
    department: 'Marketing & Communications',
    weeklyHours: 40,
    workplace: 'Rome, Italy',
    supervisor: 'Pierre Dubois',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-11-08',
    probationLength: 3,
    costCenter: 'CC-MKTG-002',
    groups: ['MKTG-CONTENT']
  },
  
  // HR Team Leads
  {
    id: 'EMP-012',
    firstName: 'Jan',
    lastName: 'Novak',
    gender: 'Male',
    email: 'jan.novak@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'L&D Team Lead',
    team: 'Learning & Development',
    department: 'Human Resources',
    weeklyHours: 40,
    workplace: 'Prague, Czech Republic',
    supervisor: 'Elena Vasquez',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2022-04-20',
    probationLength: 3,
    costCenter: 'CC-HR-002',
    groups: ['HR-DEV']
  },
  
  // Finance Team Leads
  {
    id: 'EMP-013',
    firstName: 'Dr. Julia',
    lastName: 'Nowak',
    gender: 'Female',
    email: 'julia.nowak@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Legal Team Lead',
    team: 'Legal & Compliance',
    department: 'Finance & Legal',
    weeklyHours: 40,
    workplace: 'Warsaw, Poland',
    supervisor: 'Hans Weber',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2021-12-01',
    probationLength: 6,
    costCenter: 'CC-FIN-002',
    groups: ['FIN-LEGAL']
  },
  
  // Operations Team Leads
  {
    id: 'EMP-014',
    firstName: 'Alex',
    lastName: 'Chen',
    gender: 'Male',
    email: 'alex.chen@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Security Team Lead',
    team: 'Information Security',
    department: 'Operations & IT',
    weeklyHours: 40,
    workplace: 'Amsterdam, Netherlands',
    supervisor: 'Claire Martin',
    legalEntity: 'TechCorp Innovation BV (Netherlands)',
    hireDate: '2022-05-10',
    probationLength: 3,
    costCenter: 'CC-OPS-002',
    groups: ['OPS-SECURITY']
  },
  
  // Frontend Developers
  {
    id: 'EMP-015',
    firstName: 'Sofia',
    lastName: 'Papadopoulos',
    gender: 'Female',
    email: 'sofia.papadopoulos@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Senior Frontend Developer',
    team: 'Frontend Development',
    department: 'Engineering',
    weeklyHours: 40,
    workplace: 'Athens, Greece',
    supervisor: 'Lisa Andersson',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2022-06-15',
    probationLength: 3,
    costCenter: 'CC-ENG-002',
    groups: ['ENG-FE']
  },
  {
    id: 'EMP-016',
    firstName: 'Lars',
    lastName: 'Nielsen',
    gender: 'Male',
    email: 'lars.nielsen@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'Frontend Developer',
    team: 'Frontend Development',
    department: 'Engineering',
    weeklyHours: 40,
    workplace: 'Copenhagen, Denmark',
    supervisor: 'Lisa Andersson',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2022-08-20',
    probationLength: 3,
    costCenter: 'CC-ENG-002',
    groups: ['ENG-FE']
  },
  {
    id: 'EMP-017',
    firstName: 'Elena',
    lastName: 'Vasquez',
    gender: 'Female',
    email: 'elena.vasquez@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'HR Director',
    team: 'Talent Acquisition',
    department: 'Human Resources',
    weeklyHours: 40,
    workplace: 'Barcelona, Spain',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2020-09-15',
    probationLength: 6,
    costCenter: 'CC-HR-001',
    groups: ['HR-TALENT']
  },
  {
    id: 'EMP-018',
    firstName: 'Hans',
    lastName: 'Weber',
    gender: 'Male',
    email: 'hans.weber@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'CFO',
    team: 'Accounting & Controlling',
    department: 'Finance & Legal',
    weeklyHours: 40,
    workplace: 'Frankfurt, Germany',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Europe GmbH (Germany)',
    hireDate: '2019-06-01',
    probationLength: 6,
    costCenter: 'CC-FIN-001',
    groups: ['FIN-ACCOUNTING']
  },
  {
    id: 'EMP-019',
    firstName: 'Claire',
    lastName: 'Martin',
    gender: 'Female',
    email: 'claire.martin@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'CTO',
    team: 'IT Support',
    department: 'Operations & IT',
    weeklyHours: 40,
    workplace: 'Paris, France',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Solutions SARL (France)',
    hireDate: '2020-01-10',
    probationLength: 6,
    costCenter: 'CC-OPS-001',
    groups: ['OPS-IT']
  },
  {
    id: 'EMP-020',
    firstName: 'Pierre',
    lastName: 'Dubois',
    gender: 'Male',
    email: 'pierre.dubois@techcorp.eu',
    employmentType: 'internal',
    employmentStatus: 'Full time',
    position: 'CMO',
    team: 'Digital Marketing',
    department: 'Marketing & Communications',
    weeklyHours: 40,
    workplace: 'Lyon, France',
    supervisor: 'CEO',
    legalEntity: 'TechCorp Solutions SARL (France)',
    hireDate: '2020-04-20',
    probationLength: 6,
    costCenter: 'CC-MKTG-001',
    groups: ['MKTG-DIGITAL']
  }
];

// Generate remaining 280 employees with varied data
const firstNames = [
  'Alexander', 'Emma', 'Lucas', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Isabella',
  'Mason', 'Sophia', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Elijah', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail', 'Sebastian', 'Emily',
  'Jack', 'Elizabeth', 'Owen', 'Sofia', 'Daniel', 'Avery', 'Jackson', 'Ella',
  'Samuel', 'Madison', 'Aiden', 'Scarlett', 'Matthew', 'Victoria', 'David', 'Luna',
  'Joseph', 'Grace', 'Carter', 'Chloe', 'Christopher', 'Penelope', 'Andrew', 'Layla',
  'Joshua', 'Riley', 'Dylan', 'Zoey', 'Nathan', 'Nora', 'Isaac', 'Lily', 'Ryan', 'Hannah'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker'
];

const positions = [
  'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'Senior Product Manager',
  'Sales Representative', 'Senior Sales Representative', 'Marketing Specialist', 'Marketing Manager',
  'HR Specialist', 'HR Manager', 'Financial Analyst', 'Accountant', 'IT Support Specialist',
  'DevOps Engineer', 'QA Engineer', 'UX Designer', 'UI Designer', 'Data Analyst',
  'Business Analyst', 'Project Manager', 'Scrum Master', 'Technical Writer', 'Legal Counsel',
  'Compliance Officer', 'Security Engineer', 'Network Engineer', 'System Administrator'
];

const workplaces = [
  'Berlin, Germany', 'Munich, Germany', 'Frankfurt, Germany', 'Hamburg, Germany',
  'Paris, France', 'Lyon, France', 'Marseille, France', 'Toulouse, France',
  'Amsterdam, Netherlands', 'Rotterdam, Netherlands', 'The Hague, Netherlands',
  'London, UK', 'Manchester, UK', 'Birmingham, UK', 'Edinburgh, UK',
  'Madrid, Spain', 'Barcelona, Spain', 'Valencia, Spain', 'Seville, Spain',
  'Rome, Italy', 'Milan, Italy', 'Naples, Italy', 'Turin, Italy',
  'Warsaw, Poland', 'Krakow, Poland', 'Wroclaw, Poland', 'Poznan, Poland',
  'Stockholm, Sweden', 'Gothenburg, Sweden', 'Malmö, Sweden',
  'Copenhagen, Denmark', 'Oslo, Norway', 'Helsinki, Finland',
  'Prague, Czech Republic', 'Budapest, Hungary', 'Vienna, Austria'
];

// Generate remaining employees
for (let i = 21; i <= 300; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const gender = ['Diverse', 'Female', 'Male', 'Undefined'][Math.floor(Math.random() * 4)] as Employee['gender'];
  const employmentType = Math.random() > 0.1 ? 'internal' : 'external';
  const employmentStatus = Math.random() > 0.2 ? 'Full time' : (Math.random() > 0.5 ? 'Part time' : 'Working student');
  const position = positions[Math.floor(Math.random() * positions.length)];
  const team = teams[Math.floor(Math.random() * teams.length)];
  const weeklyHours = employmentStatus === 'Full time' ? 40 : (employmentStatus === 'Part time' ? 20 : 16);
  const workplace = workplaces[Math.floor(Math.random() * workplaces.length)];
  const legalEntity = legalEntities[Math.floor(Math.random() * legalEntities.length)];
  const hireDate = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
  const probationLength = Math.random() > 0.3 ? 3 : 6;
  const contractEndDate = employmentType === 'external' ? new Date(2025 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : undefined;
  const costCenter = costCenters[Math.floor(Math.random() * costCenters.length)];
  
  // Determine supervisor based on team
  let supervisor = '';
  if (team.department === 'Engineering') {
    supervisor = team.name === 'Software Architecture' ? 'Dr. Sarah Müller' : team.lead;
  } else if (team.department === 'Product Management') {
    supervisor = team.name === 'Product Strategy' ? 'Marco Rossi' : team.lead;
  } else if (team.department === 'Sales & Business Development') {
    supervisor = team.name === 'Enterprise Sales' ? 'Anna Kowalska' : team.lead;
  } else if (team.department === 'Marketing & Communications') {
    supervisor = team.name === 'Digital Marketing' ? 'Pierre Dubois' : team.lead;
  } else if (team.department === 'Human Resources') {
    supervisor = team.name === 'Talent Acquisition' ? 'Elena Vasquez' : team.lead;
  } else if (team.department === 'Finance & Legal') {
    supervisor = team.name === 'Accounting & Controlling' ? 'Hans Weber' : team.lead;
  } else if (team.department === 'Operations & IT') {
    supervisor = team.name === 'IT Support' ? 'Claire Martin' : team.lead;
  }
  
  // Add secondary supervisor for some employees (20% chance)
  const secondarySupervisor = Math.random() > 0.8 ? (team.department === 'Engineering' ? 'Dr. Sarah Müller' : 
    team.department === 'Product Management' ? 'Marco Rossi' : 
    team.department === 'Sales & Business Development' ? 'Anna Kowalska' : 
    team.department === 'Marketing & Communications' ? 'Pierre Dubois' : 
    team.department === 'Human Resources' ? 'Elena Vasquez' : 
    team.department === 'Finance & Legal' ? 'Hans Weber' : 
    'Claire Martin') : undefined;
  
  // Assign random groups to employees (1-3 groups)
  const numGroups = Math.floor(Math.random() * 3) + 1;
  const assignedGroups: string[] = [];
  while (assignedGroups.length < numGroups) {
    const randomGroup = teams[Math.floor(Math.random() * teams.length)];
    if (!assignedGroups.includes(randomGroup.id)) {
      assignedGroups.push(randomGroup.id);
    }
  }

  employees.push({
    id: `EMP-${i.toString().padStart(3, '0')}`,
    firstName,
    lastName,
    gender,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@techcorp.eu`,
    employmentType,
    employmentStatus,
    position,
    team: team.name,
    department: team.department,
    weeklyHours,
    workplace,
    supervisor,
    secondarySupervisor,
    legalEntity,
    hireDate,
    probationLength,
    contractEndDate,
    costCenter,
    groups: assignedGroups
  });
}

export default employees;
