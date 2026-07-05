'use strict';

import express from 'express';
import * as UserController from '../controllers/userController.js';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { createUserRules, validate } from '../validators/userValidator.js';

const router = express.Router();

// Secure by default — every /users route requires a valid JWT.
// Remove this line on a route that must be public.
router.use(authMiddleware);

router.post('/', createUserRules, validate, UserController.create);
router.get('/', UserController.list);
router.get('/:id', UserController.getById);

export default router;
