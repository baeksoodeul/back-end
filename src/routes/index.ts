//라우터 -> 컨트롤러 -> api or 라우터 -> api

import { Router } from 'express';
import board from './board';
import user from './user';
import post from './post';
import login from './login';

const router = Router();
router.use('/board', board);
//토큰이 없으면 로그인으로, 토큰이 있으면 유저로
router.use('/login', login);
router.use('/user', user);
router.use('/post', post);

export default router;