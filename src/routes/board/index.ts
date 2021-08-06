import { Router } from 'express';
import { getPostList } from '../../controller/postController';
//board에서 라우팅을 해준다면 어떤걸 해줘야할까.... 굳이 라우팅이 필요없을지도
//게시판 별로 나눠주면 될것 같네요... 팁게시판을 만든다는 가정 하에 일반 포스팅이랑 팁이랑 나눠야하니깡
const router: Router = Router();

router.get('/posts', getPostList);
//router.get('/tips', tipListing);

export default router;
