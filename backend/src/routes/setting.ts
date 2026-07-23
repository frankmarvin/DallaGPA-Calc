import { Router } from 'express';
import { getSettings, updateSetting } from '../controllers/setting.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/', getSettings);
router.put('/:key', updateSetting);

export default router;
