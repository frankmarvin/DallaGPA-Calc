import { Router } from 'express';
import { getResults, getResultById, deleteResult } from '../controllers/result.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/', getResults);
router.get('/:id', getResultById);
router.delete('/:id', deleteResult);

export default router;
