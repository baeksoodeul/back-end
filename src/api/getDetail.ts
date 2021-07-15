import { RequestHandler } from 'express';

import Post from '../model/posts';

export const getPostDetail: RequestHandler = async (req, res, next) => {
    const postId = req.params.p_id;

    try {
        const postDetail = await Post
            .createQueryBuilder('post')
            .leftJoin('post.u_id', 'user')
            .select(['post', 'user.nickName'])
            .where('post.p_id = :id', { id: postId })
            .getOne();
        
        if(!postDetail) throw new Error('NOT_FOUND');
        
        res.status(201).json(postDetail);
    }
    catch(err) {
        next(err);
    }
}