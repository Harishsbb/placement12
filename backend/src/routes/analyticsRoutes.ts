import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getAnalytics);

export default router;
