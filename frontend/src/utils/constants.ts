// App-wide constants

export const ROLES = {
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  ADMIN: 'ADMIN',
} as const;

export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  GRADUATED: 'GRADUATED',
  WITHDRAWN: 'WITHDRAWN',
  SUSPENDED: 'SUSPENDED',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export const ACADEMIC_YEARS = ['1', '2', '3', '4'] as const;
export const SEMESTERS = ['1', '2'] as const;

// Default grading system (Kenyan common)
export const DEFAULT_GRADING_SYSTEM = [
  { minMarks: 70, maxMarks: 100, grade: 'A', gradePoint: 4.0 },
  { minMarks: 65, maxMarks: 69, grade: 'B+', gradePoint: 3.5 },
  { minMarks: 60, maxMarks: 64, grade: 'B', gradePoint: 3.0 },
  { minMarks: 55, maxMarks: 59, grade: 'C+', gradePoint: 2.5 },
  { minMarks: 50, maxMarks: 54, grade: 'C', gradePoint: 2.0 },
  { minMarks: 45, maxMarks: 49, grade: 'D+', gradePoint: 1.5 },
  { minMarks: 40, maxMarks: 44, grade: 'D', gradePoint: 1.0 },
  { minMarks: 0, maxMarks: 39, grade: 'E', gradePoint: 0.0 },
];

// Degree classifications
export const DEGREE_CLASSIFICATIONS = [
  { name: 'First Class Honours', minCGPA: 3.7, maxCGPA: 4.0 },
  { name: 'Second Class Honours (Upper Division)', minCGPA: 3.3, maxCGPA: 3.69 },
  { name: 'Second Class Honours (Lower Division)', minCGPA: 2.7, maxCGPA: 3.29 },
  { name: 'Pass', minCGPA: 2.0, maxCGPA: 2.69 },
  { name: 'Fail', minCGPA: 0, maxCGPA: 1.99 },
];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  STUDENT: {
    DASHBOARD: '/students/dashboard',
    COURSES: '/students/courses',
  },
  ADMIN: {
    GRADING_SYSTEMS: '/admins/grading-systems',
    USERS: '/admins/users',
  },
  TRANSCRIPT: '/transcript',
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'dallagpa-theme',
  USER: 'dallagpa-user',
  TOKEN: 'dallagpa-token',
} as const;
