import { Request, Response } from 'express';
import { prisma } from '../app';

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { department: true, lecturer: { include: { user: { include: { profile: true } } } } }
  });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, name, credits, departmentId, lecturerId } = req.body;
  const course = await prisma.course.update({
    where: { id },
    data: { code, name, credits, departmentId, lecturerId }
  });
  res.json(course);
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.course.delete({ where: { id } });
  res.json({ message: 'Course deleted' });
};
