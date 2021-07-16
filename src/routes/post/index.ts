import { Router } from 'express';
import { getPostList } from '../../api/getList';
//import { getPostDetail } from

const router: Router = Router();

router.get('/', getPostList);
//router.get('/:postId/detail', getPostDetail);
//router.get('/:postId/comments', );

export default router;