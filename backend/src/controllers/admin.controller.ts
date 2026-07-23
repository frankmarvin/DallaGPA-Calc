import { Request, Response } from 'express';
import { prisma } from '../app';

// Grading Systems
export const createGradingSystem = async (req: Request, res: Response) => {
  const { name, description, grades, isDefault } = req.body;
  try {
    if (isDefault) {
      await prisma.gradingSystem.updateMany({ data: { isDefault: false } });
    }
    const system = await prisma.gradingSystem.create({
      data: {
        name,
        description,
        isDefault: isDefault || false,
        grades: {
          create: grades.map((g: any) => ({
            minMarks: g.minMarks,
            maxMarks: g.maxMarks,
            grade: g.grade,
            gradePoint: g.gradePoint
          }))
        }
      }
    });
    res.status(201).json(system);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create grading system' });
  }
};

export const getGradingSystems = async (req: Request, res: Response) => {
  const systems = await prisma.gradingSystem.findMany({ include: { grades: true } });
  res.json(systems);
};

export const updateGradingSystem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, isDefault } = req.body;
  try {
    if (isDefault) {
      await prisma.gradingSystem.updateMany({ data: { isDefault: false } });
    }
    const system = await prisma.gradingSystem.update({
      where: { id },
      data: { name, description, isDefault }
    });
    res.json(system);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const deleteGradingSystem = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.gradingSystem.delete({ where: { id } });
  res.json({ message: 'Grading system deleted' });
};

// Degree Classifications
export const createDegreeClassification = async (req: Request, res: Response) => {
  const { name, minCGPA, maxCGPA } = req.body;
  const classification = await prisma.degreeClassification.create({
    data: { name, minCGPA, maxCGPA }
  });
  res.status(201).json(classification);
};

export const getDegreeClassifications = async (req: Request, res: Response) => {
  const classifications = await prisma.degreeClassification.findMany();
  res.json(classifications);
};

// Students management
export const getAllStudents = async (req: Request, res: Response) => {
  const students = await prisma.student.findMany({
    include: { user: { include: { profile: true } }, faculty: true, department: true }
  });
  res.json(students);
};

export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: { include: { profile: true } }, faculty: true, department: true, results: { include: { course: true } } }
  });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { regNo, facultyId, departmentId, programme, currentYear, currentSemester, status } = req.body;
  const student = await prisma.student.update({
    where: { id },
    data: { regNo, facultyId, departmentId, programme, currentYear, currentSemester, status }
  });
  res.json(student);
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.student.delete({ where: { id } });
  res.json({ message: 'Student deleted' });
};

// Lecturers
export const getAllLecturers = async (req: Request, res: Response) => {
  const lecturers = await prisma.lecturer.findMany({
    include: { user: { include: { profile: true } }, department: true, courses: true }
  });
  res.json(lecturers);
};

// Faculties & Departments
export const createFaculty = async (req: Request, res: Response) => {
  const { name, code } = req.body;
  const faculty = await prisma.faculty.create({ data: { name, code } });
  res.status(201).json(faculty);
};

export const getFaculties = async (req: Request, res: Response) => {
  const faculties = await prisma.faculty.findMany({ include: { departments: true } });
  res.json(faculties);
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, code, facultyId } = req.body;
  const department = await prisma.department.create({ data: { name, code, facultyId } });
  res.status(201).json(department);
};

// Courses
export const createCourse = async (req: Request, res: Response) => {
  const { code, name, credits, departmentId, lecturerId } = req.body;
  const course = await prisma.course.create({
    data: { code, name, credits, departmentId, lecturerId }
  });
  res.status(201).json(course);
};

export const getAllCourses = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { department: true, lecturer: { include: { user: { include: { profile: true } } } } }
  });
  res.json(courses);
};

// Semesters
export const createSemester = async (req: Request, res: Response) => {
  const { name, academicYear, startDate, endDate, isActive } = req.body;
  if (isActive) {
    await prisma.semester.updateMany({ data: { isActive: false } });
  }
  const semester = await prisma.semester.create({
    data: { name, academicYear, startDate, endDate, isActive }
  });
  res.status(201).json(semester);
};

export const getSemesters = async (req: Request, res: Response) => {
  const semesters = await prisma.semester.findMany({ orderBy: { startDate: 'desc' } });
  res.json(semesters);
};

export const lockSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  const semester = await prisma.semester.update({
    where: { id },
    data: { isLocked: true }
  });
  res.json(semester);
};

// Statistics
export const getStatistics = async (req: Request, res: Response) => {
  const [students, lecturers, courses, faculties, departments] = await Promise.all([
    prisma.student.count(),
    prisma.lecturer.count(),
    prisma.course.count(),
    prisma.faculty.count(),
    prisma.department.count()
  ]);
  res.json({ students, lecturers, courses, faculties, departments });
};

export const backupDatabase = async (req: Request, res: Response) => {
  // In production, this would trigger a pg_dump or similar.
  res.json({ message: 'Backup initiated (dummy)' });
};
