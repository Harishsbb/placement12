import { Router } from 'express';
import { getCommunicationSessions, createCommunicationSession, deleteCommunicationSession } from '../controllers/communicationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getCommunicationSessions);
router.post('/', createCommunicationSession);
router.delete('/:id', deleteCommunicationSession);

export default router;
