import { Router } from 'express';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../controllers/applicationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
