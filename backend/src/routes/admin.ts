import { Router } from 'express';
import {
  createGradingSystem,
  getGradingSystems,
  updateGradingSystem,
  deleteGradingSystem,
  createDegreeClassification,
  getDegreeClassifications,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllLecturers,
  createFaculty,
  getFaculties,
  createDepartment,
  createCourse,
  getAllCourses,
  createSemester,
  getSemesters,
  lockSemester,
  getStatistics,
  backupDatabase,
} from '../controllers/admin.controller';
import { authorize } from '../middlewares/auth';

const router = Router();
router.use(authorize('ADMIN'));

// Grading Systems
router.post('/grading-systems', createGradingSystem);
router.get('/grading-systems', getGradingSystems);
router.put('/grading-systems/:id', updateGradingSystem);
router.delete('/grading-systems/:id', deleteGradingSystem);

// Degree Classifications
router.post('/degree-classifications', createDegreeClassification);
router.get('/degree-classifications', getDegreeClassifications);

// Students
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Lecturers
router.get('/lecturers', getAllLecturers);

// Faculties
router.post('/faculties', createFaculty);
router.get('/faculties', getFaculties);

// Departments
router.post('/departments', createDepartment);

// Courses
router.post('/courses', createCourse);
router.get('/courses', getAllCourses);

// Semesters
router.post('/semesters', createSemester);
router.get('/semesters', getSemesters);
router.put('/semesters/:id/lock', lockSemester);

// Statistics & Backup
router.get('/statistics', getStatistics);
router.post('/backup', backupDatabase);

export default router;
