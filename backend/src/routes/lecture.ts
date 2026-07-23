import { Router } from 'express';
import {
  getAssignedStudents,
  uploadResults,
  approveResults,
  editResult,
} from '../controllers/lecturer.controller';
import { authorize } from '../middlewares/auth';

const router = Router();
router.use(authorize('LECTURER'));

router.get('/students', getAssignedStudents);
router.post('/results', uploadResults);
router.put('/results/:resultId/approve', approveResults);
router.put('/results/:resultId', editResult);

export default router;
