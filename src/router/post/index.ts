import { Router } from 'express';
import { getPostDetail } from './';

const router: Router = Router();

router.get('/detail/:postId', getPostDetail);

export default router;