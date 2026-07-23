import { Request, Response } from 'express';
import { prisma } from '../app';

export const getAssignedStudents = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const lecturer = await prisma.lecturer.findUnique({
    where: { userId },
    include: { courses: true }
  });
  if (!lecturer) return res.status(404).json({ error: 'Lecturer not found' });

  const courseIds = lecturer.courses.map(c => c.id);
  const results = await prisma.result.findMany({
    where: { courseId: { in: courseIds } },
    include: { student: { include: { user: { include: { profile: true } } } }, course: true }
  });

  // Group by student
  const studentsMap = new Map();
  for (const r of results) {
    const studentId = r.studentId;
    if (!studentsMap.has(studentId)) {
      studentsMap.set(studentId, {
        student: r.student,
        results: []
      });
    }
    studentsMap.get(studentId).results.push(r);
  }

  res.json(Array.from(studentsMap.values()));
};

export const uploadResults = async (req: Request, res: Response) => {
  const { studentId, courseId, semester, year, catMarks, examMarks } = req.body;
  const userId = req.user!.id;
  const lecturer = await prisma.lecturer.findUnique({ where: { userId } });
  if (!lecturer) return res.status(404).json({ error: 'Lecturer not found' });

  // Verify lecturer teaches this course
  const course = await prisma.course.findFirst({
    where: { id: courseId, lecturerId: lecturer.id }
  });
  if (!course) return res.status(403).json({ error: 'You are not assigned to this course' });

  const total = catMarks + examMarks;
  const gradingSystem = await prisma.gradingSystem.findFirst({ where: { isDefault: true }, include: { grades: true } });
  let grade = 'E', gradePoint = 0;
  for (const g of gradingSystem?.grades || []) {
    if (total >= g.minMarks && total <= g.maxMarks) {
      grade = g.grade;
      gradePoint = g.gradePoint;
      break;
    }
  }
  const qualityPoints = course.credits * gradePoint;

  const result = await prisma.result.create({
    data: {
      studentId,
      courseId,
      lecturerId: lecturer.id,
      catMarks,
      examMarks,
      totalMarks: total,
      grade,
      gradePoint,
      qualityPoints,
      semester,
      year,
      isApproved: false
    }
  });

  res.status(201).json(result);
};

export const approveResults = async (req: Request, res: Response) => {
  const { resultId } = req.params;
  const userId = req.user!.id;
  const lecturer = await prisma.lecturer.findUnique({ where: { userId } });
  if (!lecturer) return res.status(404).json({ error: 'Lecturer not found' });

  const result = await prisma.result.findUnique({
    where: { id: resultId },
    include: { course: true }
  });
  if (!result) return res.status(404).json({ error: 'Result not found' });
  if (result.course.lecturerId !== lecturer.id) return res.status(403).json({ error: 'Not authorized' });

  await prisma.result.update({
    where: { id: resultId },
    data: { isApproved: true, approvedBy: lecturer.id, approvedAt: new Date() }
  });

  res.json({ message: 'Result approved' });
};

export const editResult = async (req: Request, res: Response) => {
  const { resultId } = req.params;
  const { catMarks, examMarks } = req.body;
  const userId = req.user!.id;
  const lecturer = await prisma.lecturer.findUnique({ where: { userId } });
  if (!lecturer) return res.status(404).json({ error: 'Lecturer not found' });

  const result = await prisma.result.findUnique({
    where: { id: resultId },
    include: { course: true }
  });
  if (!result) return res.status(404).json({ error: 'Result not found' });
  if (result.course.lecturerId !== lecturer.id) return res.status(403).json({ error: 'Not authorized' });
  if (result.isApproved) return res.status(400).json({ error: 'Cannot edit approved result' });

  const total = (catMarks || result.catMarks) + (examMarks || result.examMarks);
  const gradingSystem = await prisma.gradingSystem.findFirst({ where: { isDefault: true }, include: { grades: true } });
  let grade = 'E', gradePoint = 0;
  for (const g of gradingSystem?.grades || []) {
    if (total >= g.minMarks && total <= g.maxMarks) {
      grade = g.grade;
      gradePoint = g.gradePoint;
      break;
    }
  }
  const qualityPoints = result.course.credits * gradePoint;

  await prisma.result.update({
    where: { id: resultId },
    data: {
      catMarks: catMarks || result.catMarks,
      examMarks: examMarks || result.examMarks,
      totalMarks: total,
      grade,
      gradePoint,
      qualityPoints
    }
  });

  res.json({ message: 'Result updated' });
};
