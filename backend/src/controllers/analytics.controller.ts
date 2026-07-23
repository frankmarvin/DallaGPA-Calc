import { Request, Response } from 'express';
import { prisma } from '../app';
import { calculateGPA } from '../services/gpa';

export const getStudentAnalytics = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { results: { include: { course: true } } }
  });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const allResults = student.results;

  // GPA trend per semester
  const semesters = Array.from(new Set(allResults.map(r => `${r.year}-${r.semester}`))).sort();
  const gpaTrend = semesters.map(key => {
    const [year, sem] = key.split('-').map(Number);
    const semResults = allResults.filter(r => r.year === year && r.semester === sem);
    const { gpa } = calculateGPA(semResults);
    return { semester: `Y${year}S${sem}`, gpa };
  });

  // Grade distribution
  const gradeCounts: { [key: string]: number } = {};
  allResults.forEach(r => {
    gradeCounts[r.grade] = (gradeCounts[r.grade] || 0) + 1;
  });
  const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count }));

  res.json({ gpaTrend, gradeDistribution });
};

export const getDepartmentPerformance = async (req: Request, res: Response) => {
  const { departmentId } = req.params;
  const students = await prisma.student.findMany({
    where: { departmentId },
    include: { results: { include: { course: true } } }
  });
  // Aggregate performance
  const performance: any[] = [];
  for (const s of students) {
    const totalQP = s.results.reduce((sum, r) => sum + r.qualityPoints, 0);
    const totalCredits = s.results.reduce((sum, r) => sum + r.course.credits, 0);
    const cgpa = totalCredits ? totalQP / totalCredits : 0;
    performance.push({ regNo: s.regNo, cgpa });
  }
  res.json(performance);
};
