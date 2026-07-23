import { Request, Response } from 'express';
import { prisma } from '../app';

export const getResults = async (req: Request, res: Response) => {
  const { studentId, courseId, semester, year } = req.query;
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (courseId) where.courseId = courseId;
  if (semester) where.semester = parseInt(semester as string);
  if (year) where.year = parseInt(year as string);

  const results = await prisma.result.findMany({
    where,
    include: { student: { include: { user: { include: { profile: true } } } }, course: true }
  });
  res.json(results);
};

export const getResultById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await prisma.result.findUnique({
    where: { id },
    include: { student: true, course: true, lecturer: true }
  });
  if (!result) return res.status(404).json({ error: 'Result not found' });
  res.json(result);
};

export const deleteResult = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.result.delete({ where: { id } });
  res.json({ message: 'Result deleted' });
};
