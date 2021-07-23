import { Router } from 'express';

import { auth } from '../../middleware/auth';
import {
    userLogin,
    userLogout,
    userSignup
} from '../../controller/authController';

const router: Router = Router();
router.use('/login', auth, userLogin);
router.use('/logout', auth, userLogout);
router.use('/signup', auth, userSignup);

// router.use('/find') 아이디/비번 찾기 버튼, 이거는 user model 정리하고 나서 생각하자.

// 아이디, 비밀번호 입력창, auth값이 false일 때만 연결
// request가 날아올때 토큰이 없으면 isAuth가 false인 상태로 날아와야함.
router.get('/', auth, (req: any, res) => {
    if (req.isAuth) {
        return res.status(400).json({
            // 로그인 된 상태에서 해당 url로 접근 시 에러
        });
    }
    // isAuth가 false일 때
    return res.status(200);
    // 아무런 정보가 없는데??? 그냥 안해도 될지도... 딱히 넘겨줄 정보가 없음;
    // 단순 로그인 페이지만 띄워도 될듯함.
});

export default router;
