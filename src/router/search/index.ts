import { Router } from 'express';
import { getPostList, getUserPostList, getUserCommentList } from './';

const router: Router = Router();

router.use('/posts', getPostList);
router.get('/posts/:userId', getUserPostList);//user명 검색 및 profile
router.get('/comments/:userId', getUserCommentList);//profile
//제목/내용 검색기능


export default router;