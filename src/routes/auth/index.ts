import { Router } from 'express';

import { auth } from '../../middleware/auth';
import { userLogin, userLogout, userSignup } from '../../controller/authController';

const router: Router = Router();
//login이랑 signup에서는 auth를 따로 잡아줘야할듯. -> auth가 로그인되어 있으면 다음 라우터로 넘어가는데 아니면 그냥 중간에 끝나버리는 구조
router.post('/login', userLogin);
router.get('/logout', auth, userLogout);
router.post('/signup', userSignup);

// router.use('/find') 아이디/비번 찾기 버튼, 이거는 user model 정리하고 나서 생각하자.

export default router;
