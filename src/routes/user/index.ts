import { Router } from 'express';
// import { getUserList, getUserProfile } from './user.ctrl';
// import getUserList from '../search';
// import post from '../post';
// import comment from '../comment';
import { auth } from '../../middleware/auth';

const router: Router = Router();

// 로그인, 로그아웃, 비번 찾기, 회원가입 등은 auth를 따로 빼서 넣을까...
router.get('/auth', auth);
router.get('/mypage', auth);

// 또 다른 user 기능이 뭐가 있을까

// getUserList는 권한을 줘야하지 않을까
// router.use('/list', getUserList);

export default router;
