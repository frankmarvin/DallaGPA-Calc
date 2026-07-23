import { Router } from 'express';
import { getActiveSemester } from '../controllers/semester.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/active', getActiveSemester);

export default router;
