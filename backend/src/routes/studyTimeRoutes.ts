import { Router } from 'express';
import { getStudySessions, createStudySession, deleteStudySession } from '../controllers/studyTimeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getStudySessions);
router.post('/', createStudySession);
router.delete('/:id', deleteStudySession);

export default router;
