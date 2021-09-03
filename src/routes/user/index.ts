import { Router } from 'express';
// import { getUserList, getUserProfile } from './user.ctrl';
// import getUserList from '../search';
// import post from '../post';
// import comment from '../comment';
import { auth } from '../../middleware/auth';
import Auth from '../auth';

const router: Router = Router();

// 로그인, 로그아웃, 비번 찾기, 회원가입 등은 auth를 따로 빼서 넣을까...
//여기 auth를 정리해줘야할듯...
router.use('/auth', Auth);
//로그인이 되어있을때는 auth에서 next로 넘어가 mypage를 불러옴.
//로그인이 안되어 있을때는 next로 넘어가지 못함. 그냥 res.json에 따라 빈 마이 페이지를 불러옴.
router.get('/mypage', auth); //getmypage
router.get('/myphotos', auth); //getmyphotos

//router.get('/mycomments', auth); ? 이렇게 해야함?

// 또 다른 user 기능이 뭐가 있을까

// getUserList는 권한을 줘야하지 않을까
// router.use('/list', getUserList);

export default router;
