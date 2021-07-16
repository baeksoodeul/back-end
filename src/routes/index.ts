//라우터 -> 컨트롤러 -> api or 라우터 -> api

import { Router } from 'express';
import board from './board';
import user from './user';
import post from './post';

const router = Router();
router.use('/board', board);
router.use('/user', user);
router.use('/post', post);

export default router;