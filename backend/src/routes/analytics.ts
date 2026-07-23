import { Router } from 'express';
import { getStudentAnalytics, getDepartmentPerformance } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/student', getStudentAnalytics);
router.get('/department/:departmentId', getDepartmentPerformance);

export default router;
