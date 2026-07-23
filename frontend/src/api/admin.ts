import { api } from './client';

export interface GradeScaleInput {
  minMarks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
}

export interface GradingSystemInput {
  name: string;
  description?: string;
  isDefault?: boolean;
  grades: GradeScaleInput[];
}

export const adminApi = {
  // Grading Systems
  getGradingSystems: () =>
    api.get('/admins/grading-systems').then((res) => res.data),

  createGradingSystem: (data: GradingSystemInput) =>
    api.post('/admins/grading-systems', data).then((res) => res.data),

  updateGradingSystem: (id: string, data: Partial<GradingSystemInput>) =>
    api.put(`/admins/grading-systems/${id}`, data).then((res) => res.data),

  deleteGradingSystem: (id: string) =>
    api.delete(`/admins/grading-systems/${id}`).then((res) => res.data),

  // Degree Classifications
  getClassifications: () =>
    api.get('/admins/classifications').then((res) => res.data),

  createClassification: (data: { name: string; minCGPA: number; maxCGPA: number }) =>
    api.post('/admins/classifications', data).then((res) => res.data),

  // Users
  getUsers: () =>
    api.get('/admins/users').then((res) => res.data),

  createUser: (data: any) =>
    api.post('/admins/users', data).then((res) => res.data),

  // Faculties & Departments
  getFaculties: () =>
    api.get('/admins/faculties').then((res) => res.data),

  getDepartments: () =>
    api.get('/admins/departments').then((res) => res.data),
};
