import joi from 'joi';

import Post from '../model/posts';
import User from '../model/users';

//수정 필요
/**
 * 
 */
export const getPostList = async () => {
    try {
        const postList = await Post
            .createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select(['post', 'user.nickName'])
            .where('post.enabled = true')
            .getMany();

        return postList;
    }
    catch(err) {
        //console.error(err);
        //throw err;
    }
}

//어떤 리스트? 일반적인 리스트업을 할때, site나 tag항목도 리스트업을 해야할까...