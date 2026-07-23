import { Request, Response } from 'express';
import { prisma } from '../app';

export const getActiveSemester = async (req: Request, res: Response) => {
  const semester = await prisma.semester.findFirst({ where: { isActive: true } });
  if (!semester) return res.status(404).json({ error: 'No active semester' });
  res.json(semester);
};
