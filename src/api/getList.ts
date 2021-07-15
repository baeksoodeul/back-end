import { RequestHandler } from 'express';
import joi from 'joi';

import Post from '../model/posts';
import User from '../model/users';

//수정 필요
export const getPostList: RequestHandler = async (req, res, next) => {
    try {
        const postList: Post[] = await Post.find({
            where: {
                enabled: true,
            },
            select: [
                'p_id', 'content', 'lookUp', 'writtenDate',
            ],
        });
        res.status(201).json(postList);
    }
    catch(err) {
        next(err);
    }
}

// export const getUserList: RequestHandler = async(req, res, next) => {
//     try {
//         const userList: User[] = await User.find({
//             select: [
//                 'u_id', 'firstName', 'lastName', 'nickName'
//             ]
//         });
//     }
//     catch(err) {
//         next(err);
//     }
// }