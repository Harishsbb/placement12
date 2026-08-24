import { Router } from 'express';
import { seedSampleData, resetToDayZero } from '../controllers/seedController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/', seedSampleData);
router.post('/reset', resetToDayZero);

export default router;

