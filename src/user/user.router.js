import { Router } from 'express';
import {
  updateUser, getMany, createOne, getOne, removeOne, approveChangePasswordRequest,
} from './user.controllers';

const router = Router();

// /api/users
router
  .route('/')
  .get(getMany)
  .post(createOne);

router
  .route('/forgetPassword')
  .put(approveChangePasswordRequest);

// /api/users /: id
router
  .route('/:id')
  .get(getOne)
  .put(updateUser)
  .delete(removeOne);

export default router;
