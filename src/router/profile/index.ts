import { Router } from 'express';
import { getMyProfile } from './';
import list from '../search';
//import post from '../post';
//import comment from '../comment';

const router: Router = Router();

router.get('/profile/:userId', getMyProfile);
router.use('/list', list);

export default router;