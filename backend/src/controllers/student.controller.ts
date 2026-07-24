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

// New endpoints for the updated workflow

export const getAvailableCourses = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const courses = await prisma.course.findMany({
    where: { departmentId: student.departmentId },
    include: { department: true, lecturer: true }
  });

  res.json(courses);
};

export const getEnrolledCourses = async (req: Request, res: Response) => {
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

  const enrolledWithGrades = enrolled.map(e => {
    const grade = results.find(r => r.courseId === e.courseId && r.semester === e.semester && r.year === e.year);
    return {
      ...e,
      grade: grade?.grade || null,
      gradePoint: grade?.gradePoint || null
    };
  });

  res.json(enrolledWithGrades);
};

export const enrollCourse = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { courseId, semester, year } = req.body;

  if (!courseId || !semester || !year) {
    return res.status(400).json({ message: 'courseId, semester, and year are required' });
  }

  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Check if already enrolled
  const existing = await prisma.enrolledCourse.findFirst({
    where: {
      studentId: student.id,
      courseId,
      semester,
      year
    }
  });

  if (existing) {
    return res.status(400).json({ message: 'Already enrolled in this course for this semester/year' });
  }

  const enrolled = await prisma.enrolledCourse.create({
    data: {
      studentId: student.id,
      courseId,
      semester,
      year
    },
    include: { course: true }
  });

  res.status(201).json(enrolled);
};

export const addGrade = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { courseId, semester, year, grade } = req.body;

  if (!courseId || !semester || !year || !grade) {
    return res.status(400).json({ message: 'courseId, semester, year, and grade are required' });
  }

  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Get the course
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // Get grading system to find grade point for the letter grade
  const gradingSystem = await prisma.gradingSystem.findFirst({
    where: { isDefault: true },
    include: { grades: true }
  });

  let gradePoint = 0;
  let foundGrade = false;

  if (gradingSystem) {
    // Find the grade scale that matches the letter grade
    const gradeScale = gradingSystem.grades.find(g => g.grade === grade);
    if (gradeScale) {
      gradePoint = gradeScale.gradePoint;
      foundGrade = true;
    }
  }

  if (!foundGrade) {
    // Default grade point mapping if grading system doesn't exist
    const gradePointMap: { [key: string]: number } = {
      'A': 4.0,
      'B+': 3.5,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'E': 0.0
    };
    gradePoint = gradePointMap[grade] || 0;
  }

  const qualityPoints = course.credits * gradePoint;

  // Check if result already exists
  let result = await prisma.result.findFirst({
    where: {
      studentId: student.id,
      courseId,
      semester,
      year
    }
  });

  if (result) {
    // Update existing result
    result = await prisma.result.update({
      where: { id: result.id },
      data: {
        grade,
        gradePoint,
        qualityPoints,
        totalMarks: gradePoint * 25 // Approximate marks from grade point
      },
      include: { course: true }
    });
  } else {
    // Create new result
    result = await prisma.result.create({
      data: {
        studentId: student.id,
        courseId,
        semester,
        year,
        grade,
        gradePoint,
        qualityPoints,
        totalMarks: gradePoint * 25,
        isApproved: false
      },
      include: { course: true }
    });
  }

  res.status(201).json(result);
};

