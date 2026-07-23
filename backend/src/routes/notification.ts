import { Router } from 'express';
import { getNotifications, markAsRead, markAllRead } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllRead);

export default router;
