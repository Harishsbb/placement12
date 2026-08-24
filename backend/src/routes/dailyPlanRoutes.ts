import { Router } from 'express';
import { getDailyPlan, updateDailyPlan } from '../controllers/dailyPlanController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getDailyPlan);
router.put('/', updateDailyPlan);

export default router;
