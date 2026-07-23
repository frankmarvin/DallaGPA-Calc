import { Router } from 'express';
import { generateTranscript, downloadPDF } from '../controllers/transcript.controller';
import { authorize } from '../middlewares/auth';

const router = Router();
router.use(authorize('STUDENT'));

router.get('/', generateTranscript);
router.get('/pdf', downloadPDF);

export default router;
