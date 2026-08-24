import { Router } from 'express';
import { getDSAProblems, createDSAProblem, updateDSAProblem, deleteDSAProblem } from '../controllers/dsaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getDSAProblems);
router.post('/', createDSAProblem);
router.put('/:id', updateDSAProblem);
router.delete('/:id', deleteDSAProblem);

export default router;
