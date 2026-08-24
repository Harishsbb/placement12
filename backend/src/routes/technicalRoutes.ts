import { Router } from 'express';
import { getTechnicalTopics, createTechnicalTopic, updateTechnicalTopic, deleteTechnicalTopic } from '../controllers/technicalController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getTechnicalTopics);
router.post('/', createTechnicalTopic);
router.put('/:id', updateTechnicalTopic);
router.delete('/:id', deleteTechnicalTopic);

export default router;
