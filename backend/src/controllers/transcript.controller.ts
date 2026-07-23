import { Request, Response } from 'express';
import { prisma } from '../app';
import { generateTranscriptPDF } from '../services/transcript';

export const generateTranscript = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: { include: { profile: true } },
      faculty: true,
      department: true,
      results: { include: { course: true } }
    }
  });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Calculate CGPA
  const totalQP = student.results.reduce((sum, r) => sum + r.qualityPoints, 0);
  const totalCredits = student.results.reduce((sum, r) => sum + r.course.credits, 0);
  const cgpa = totalCredits ? totalQP / totalCredits : 0;

  const classifications = await prisma.degreeClassification.findMany();
  const classification = classifications.sort((a,b) => b.minCGPA - a.minCGPA).find(c => cgpa >= c.minCGPA && cgpa <= c.maxCGPA)?.name || 'Fail';

  res.json({
    studentName: `${student.user.profile?.firstName} ${student.user.profile?.lastName}`,
    regNo: student.regNo,
    programme: student.programme,
    faculty: student.faculty.name,
    department: student.department.name,
    courses: student.results.map(r => ({
      code: r.course.code,
      name: r.course.name,
      credits: r.course.credits,
      semester: r.semester,
      year: r.year,
      grade: r.grade,
      gradePoint: r.gradePoint,
      qualityPoints: r.qualityPoints
    })),
    cgpa,
    classification
  });
};

export const downloadPDF = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: { include: { profile: true } },
      faculty: true,
      department: true,
      results: { include: { course: true } }
    }
  });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  await generateTranscriptPDF(student, res);
};
