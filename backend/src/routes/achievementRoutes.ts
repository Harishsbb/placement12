import { Router } from 'express';
import { getAchievements } from '../controllers/achievementController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getAchievements);

export default router;
