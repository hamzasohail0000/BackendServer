import { Router } from 'express';
import { getMany, createOne } from './images.controllers.js';

const router = Router();

// /api/users
router.route('/').get(getMany).post(createOne);
export default router;
