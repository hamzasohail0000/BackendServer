import express from 'express';
import createOne from './calculation.controller.js';

const router = express.Router();

router.route('/').post(createOne);

export default router;
