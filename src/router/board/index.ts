import { Router } from 'express';
//import { getPostList, getPostDetail, getUserPostList } from '.';
import list from '../search';

const router: Router = Router();

//router.get('/list', getPostList);
router.use('/list', list)

//router.get('/list/user/:userId', getUserPostList);
//제목으로 검색하는 부분
//router.get('/post/:postId', getPostDetail);

export default router;