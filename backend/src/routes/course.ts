import { Router } from 'express';
import { getCourse, updateCourse, deleteCourse } from '../controllers/course.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/:id', getCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
