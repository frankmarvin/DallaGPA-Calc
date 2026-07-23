import { api } from './client';

export const lecturerApi = {
  getAssignedStudents: () =>
    api.get('/lecturers/students').then((res) => res.data),

  uploadResults: (data: { studentId: string; courseId: string; catMarks: number; examMarks: number }) =>
    api.post('/lecturers/results', data).then((res) => res.data),

  approveResult: (resultId: string) =>
    api.patch(`/lecturers/results/${resultId}/approve`).then((res) => res.data),
};
