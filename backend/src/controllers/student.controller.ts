import { Request, Response } from 'express';
import { prisma } from '../app';
import { calculateGPA, calculateCGPA, getDegreeClassification } from '../services/gpa';

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { faculty: true, department: true, results: { include: { course: true } } }
  });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const currentSemesterResults = student.results.filter(r => r.semester === student.currentSemester && r.year === student.currentYear);
  const { gpa } = calculateGPA(currentSemesterResults);

  const allResults = student.results;
  const { cgpa } = calculateCGPA(allResults);

  const classifications = await prisma.degreeClassification.findMany();
  const classification = getDegreeClassification(cgpa, classifications);

  const creditsCompleted = allResults.reduce((sum, r) => sum + r.course.credits, 0);
  const totalCreditsNeeded = 160;
  const creditsRemaining = totalCreditsNeeded - creditsCompleted;

  const recentCourses = allResults.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0,5);

  const semesters = Array.from(new Set(allResults.map(r => `${r.year}-${r.semester}`))).sort();
  const trend = semesters.map(key => {
    const [year, sem] = key.split('-').map(Number);
    const semResults = allResults.filter(r => r.year === year && r.semester === sem);
    const { gpa: semGPA } = calculateGPA(semResults);
    return { semester: `Y${year}S${sem}`, gpa: semGPA };
  });

  res.json({
    student,
    gpa,
    cgpa,
    classification,
    creditsCompleted,
    creditsRemaining,
    recentCourses,
    trend
  });
};

export const addCourse = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { code, name, credits, semester, year, catMarks, examMarks } = req.body;

  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  let course = await prisma.course.findUnique({ where: { code } });
  if (!course) {
    course = await prisma.course.create({
      data: {
        code,
        name,
        credits,
        departmentId: student.departmentId
      }
    });
  }

  const enrolled = await prisma.enrolledCourse.create({
    data: {
      studentId: student.id,
      courseId: course.id,
      semester,
      year
    }
  });

  if (catMarks !== undefined && examMarks !== undefined) {
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
    const qualityPoints = credits * gradePoint;

    await prisma.result.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        catMarks,
        examMarks,
        totalMarks: total,
        grade,
        gradePoint,
        qualityPoints,
        semester,
        year
      }
    });
  }

  res.status(201).json({ message: 'Course added', enrolled });
};

export const getCourses = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const enrolled = await prisma.enrolledCourse.findMany({
    where: { studentId: student.id },
    include: { course: true }
  });
  const results = await prisma.result.findMany({
    where: { studentId: student.id },
    include: { course: true }
  });

  const courses = enrolled.map(e => {
    const result = results.find(r => r.courseId === e.courseId && r.semester === e.semester && r.year === e.year);
    return {
      ...e,
      course: e.course,
      grade: result?.grade || null,
      gradePoint: result?.gradePoint || null,
      totalMarks: result?.totalMarks || null
    };
  });

  res.json(courses);
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const enrolled = await prisma.enrolledCourse.findFirst({
    where: { id, studentId: student.id }
  });
  if (!enrolled) return res.status(404).json({ error: 'Enrollment not found' });

  await prisma.result.deleteMany({
    where: { studentId: student.id, courseId: enrolled.courseId, semester: enrolled.semester, year: enrolled.year }
  });

  await prisma.enrolledCourse.delete({ where: { id } });
  res.json({ message: 'Course deleted' });
};

export const editCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { catMarks, examMarks } = req.body;
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const enrolled = await prisma.enrolledCourse.findFirst({
    where: { id, studentId: student.id },
    include: { course: true }
  });
  if (!enrolled) return res.status(404).json({ error: 'Enrollment not found' });

  const existingResult = await prisma.result.findFirst({
    where: { studentId: student.id, courseId: enrolled.courseId, semester: enrolled.semester, year: enrolled.year }
  });

  if (!existingResult) return res.status(404).json({ error: 'Result not found' });

  const total = (catMarks || existingResult.catMarks) + (examMarks || existingResult.examMarks);
  const gradingSystem = await prisma.gradingSystem.findFirst({ where: { isDefault: true }, include: { grades: true } });
  let grade = 'E', gradePoint = 0;
  for (const g of gradingSystem?.grades || []) {
    if (total >= g.minMarks && total <= g.maxMarks) {
      grade = g.grade;
      gradePoint = g.gradePoint;
      break;
    }
  }
  const qualityPoints = enrolled.course.credits * gradePoint;

  await prisma.result.update({
    where: { id: existingResult.id },
    data: {
      catMarks: catMarks || existingResult.catMarks,
      examMarks: examMarks || existingResult.examMarks,
      totalMarks: total,
      grade,
      gradePoint,
      qualityPoints
    }
  });

  res.json({ message: 'Course updated' });
};
