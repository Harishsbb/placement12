import { Router } from 'express';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../controllers/interviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getInterviews);
router.post('/', createInterview);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
