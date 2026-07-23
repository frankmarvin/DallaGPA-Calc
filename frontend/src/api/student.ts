import { api } from './client';

export interface CourseInput {
  code: string;
  name: string;
  credits: number;
  semester: number;
  year: number;
  catMarks?: number;
  examMarks?: number;
}

export const studentApi = {
  getDashboard: () =>
    api.get('/students/dashboard').then((res) => res.data),

  getCourses: () =>
    api.get('/students/courses').then((res) => res.data),

  addCourse: (data: CourseInput) =>
    api.post('/students/courses', data).then((res) => res.data),

  editCourse: (id: string, data: Partial<CourseInput>) =>
    api.put(`/students/courses/${id}`, data).then((res) => res.data),

  deleteCourse: (id: string) =>
    api.delete(`/students/courses/${id}`).then((res) => res.data),

  calculateGPA: (semester: number, year: number) =>
    api.post('/students/calculate-gpa', { semester, year }).then((res) => res.data),
};
