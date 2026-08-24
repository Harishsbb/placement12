import { Router } from 'express';
import { getAptitudeRecords, createAptitudeRecord, deleteAptitudeRecord } from '../controllers/aptitudeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getAptitudeRecords);
router.post('/', createAptitudeRecord);
router.delete('/:id', deleteAptitudeRecord);

export default router;
