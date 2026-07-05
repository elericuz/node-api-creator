import { Router } from 'express';
import userRoutes from '../../modules/user/routes/userRoutes.js';

const router = Router();

// Reference module — demonstrates the repository pattern (mongo | sql).
router.use('/users', userRoutes);

export default router;
