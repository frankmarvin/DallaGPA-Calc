import { api } from './client';

export const analyticsApi = {
  getGpaTrend: () =>
    api.get('/analytics/gpa-trend').then((res) => res.data),

  getCgpaGrowth: () =>
    api.get('/analytics/cgpa-growth').then((res) => res.data),

  getGradeDistribution: () =>
    api.get('/analytics/grade-distribution').then((res) => res.data),

  getCreditsSummary: () =>
    api.get('/analytics/credits-summary').then((res) => res.data),

  getDepartmentPerformance: () =>
    api.get('/analytics/department-performance').then((res) => res.data),

  getPrediction: (targetClass: string) =>
    api.post('/analytics/predict', { targetClass }).then((res) => res.data),
};
