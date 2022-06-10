import { Router } from 'express';
import { getMany, createOne, removeOne } from './images.controllers.js';

const router = Router();

// /api/users
router.route('/').get(getMany).post(createOne);

// /api/users /: id
router.route('/:id').delete(removeOne);
export default router;
