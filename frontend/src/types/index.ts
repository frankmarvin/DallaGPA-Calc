// ============================================================
// Enums
// ============================================================

export enum Role {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  GRADUATED = 'GRADUATED',
  WITHDRAWN = 'WITHDRAWN',
  SUSPENDED = 'SUSPENDED',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// ============================================================
// Core Models (simplified for frontend)
// ============================================================

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  profile?: Profile;
  student?: Student;
  lecturer?: Lecturer;
  admin?: Admin;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  regNo: string;
  facultyId: string;
  faculty: Faculty;
  departmentId: string;
  department: Department;
  programme: string;
  currentYear: number;
  currentSemester: number;
  graduationYear?: number;
  status: StudentStatus;
  results: Result[];
  enrolledCourses: EnrolledCourse[];
  createdAt: string;
  updatedAt: string;
}

export interface Lecturer {
  id: string;
  userId: string;
  staffNo: string;
  departmentId: string;
  department: Department;
  courses: Course[];
  results: Result[];
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  userId: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  faculty: Faculty;
  students: Student[];
  lecturers: Lecturer[];
  courses: Course[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  departmentId: string;
  department: Department;
  lecturerId?: string;
  lecturer?: Lecturer;
  enrolledCourses: EnrolledCourse[];
  results: Result[];
  createdAt: string;
  updatedAt: string;
}

export interface EnrolledCourse {
  id: string;
  studentId: string;
  student: Student;
  courseId: string;
  course: Course;
  semester: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: string;
  studentId: string;
  student: Student;
  courseId: string;
  course: Course;
  lecturerId?: string;
  lecturer?: Lecturer;
  catMarks?: number;
  examMarks?: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
  qualityPoints: number;
  semester: number;
  year: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GradingSystem {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  grades: GradeScale[];
  createdAt: string;
  updatedAt: string;
}

export interface GradeScale {
  id: string;
  gradingSystemId: string;
  gradingSystem: GradingSystem;
  minMarks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
  createdAt: string;
  updatedAt: string;
}

export interface DegreeClassification {
  id: string;
  name: string;
  minCGPA: number;
  maxCGPA: number;
  universityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  user: User;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  details?: any;
  ip?: string;
  createdAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// API Request / Response Types
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  regNo?: string;
  facultyId?: string;
  departmentId?: string;
  programme?: string;
  staffNo?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface DashboardData {
  student: Student;
  gpa: number;
  cgpa: number;
  classification: string;
  creditsCompleted: number;
  creditsRemaining: number;
  recentCourses: Result[];
  trend: Array<{ semester: string; gpa: number }>;
}

export interface CourseInput {
  code: string;
  name: string;
  credits: number;
  semester: number;
  year: number;
  catMarks?: number;
  examMarks?: number;
}

export interface GradingSystemInput {
  name: string;
  description?: string;
  grades: Array<{
    minMarks: number;
    maxMarks: number;
    grade: string;
    gradePoint: number;
  }>;
}

export interface TranscriptData {
  studentName: string;
  regNo: string;
  programme: string;
  cgpa: number;
  classification: string;
  courses: Array<{
    id: string;
    semester: number;
    code: string;
    name: string;
    credits: number;
    grade: string;
    gradePoint: number;
  }>;
}

export interface AnalyticsData {
  gpaTrend: Array<{ semester: string; gpa: number }>;
  cgpaGrowth: Array<{ semester: string; cgpa: number }>;
  creditsEarned: Array<{ semester: string; credits: number }>;
  gradeDistribution: Array<{ grade: string; count: number }>;
  passFailRatio: { pass: number; fail: number };
  departmentPerformance?: Array<{ department: string; avgGPA: number }>;
  facultyPerformance?: Array<{ faculty: string; avgGPA: number }>;
}

// ============================================================
// Utility Types for Forms
// ============================================================

export interface SelectOption {
  label: string;
  value: string;
}

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiError = {
  error: string;
  details?: any;
};
