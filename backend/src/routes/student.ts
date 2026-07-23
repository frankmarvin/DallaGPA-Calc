import { Router } from 'express';
import {
  getDashboard,
  getCourses,
  addCourse,
  deleteCourse,
  editCourse,
} from '../controllers/student.controller';
import { authorize } from '../middlewares/auth';

const router = Router();
router.use(authorize('STUDENT'));

router.get('/dashboard', getDashboard);
router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.delete('/courses/:id', deleteCourse);
router.put('/courses/:id', editCourse);

export default router;
