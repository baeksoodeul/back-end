import { Router } from 'express';
import { removePost, writePost } from '../../controller/postController';
import { upload } from '../../middleware/multer';
import { auth } from '../../middleware/auth';
//import { getPostDetail } from

const router: Router = Router();

//router.get('/:postId/detail', getPostDetail);
//router.get('/:postId/comments', );
//일단 write라고 해두고 나중에 수정해도 됨.
//등록해야할 거: 사진, 이미지, 태그
//파일이 없으면 upload 미들웨어는 자동으로 넘어가진다. => 게시글만 저장됨.
router.post('/write', auth, upload, writePost);
router.post('/delete/:postId', auth, removePost);

export default router;
